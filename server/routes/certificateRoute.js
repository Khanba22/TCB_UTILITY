const express = require("express");
const CertificateSchema = require("../Database/Schemas/CertificateSchema");
const { google } = require('googleapis');
const { generateCertificateData } = require("../functions/generateCertificateData");
const TemplateSchema = require("../Database/Schemas/TemplateSchema");

const router = express.Router();


const auth = new google.auth.GoogleAuth({
  keyFile: 'credentials.json', // Ensure this path is correct
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const drive = google.drive({ version: 'v3', auth });


router.post("/generate-certificate", async (req, res) => {
  const { templateId, dataArr } = req.body;
  console.log(templateId, dataArr);
  if (!templateId || !Array.isArray(dataArr)) {
    return res.status(400).json({ message: "Invalid input data" });
  }

  try {
    const template = await TemplateSchema.findById(templateId);
    if (!template) {
      return res.status(404).json({ message: "Template Not Found" });
    }

    const certArr = generateCertificateData(template, dataArr);

    const insertedData = await CertificateSchema.insertMany(certArr);
    res.status(200).json(insertedData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error generating certificates", error: err.message });
  }
});

router.get("/retrieve/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const parsedData = await CertificateSchema.findById(id);
    if (!parsedData) {
      return res.status(404).json({ message: "Object Not Found" });
    }

    // Download file from Google Drive
    const driveResponse = await drive.files.get({
      fileId: parsedData.driveFileId,
      alt: 'media',
    }, {
      responseType: 'arraybuffer'
    });

    // Convert to base64
    const base64Image = Buffer.from(driveResponse.data).toString('base64');

    const imageObj = {
      content: base64Image,
      type: 'image/png',
    };

    const responseObject = {
      dimensions: parsedData.dimensions,
      id: parsedData._id,
      imageObj,
      image: parsedData.image,
      texts: parsedData.texts,
    };

    res.status(200).json(responseObject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving data", error: error.message });
  }
});

module.exports = router;