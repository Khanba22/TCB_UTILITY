const express = require("express");
const CertificateSchema = require("../Database/Schemas/CertificateSchema");
const router = express.Router();
const { generateCertificateData } = require("../functions/generateCertificateData");
const path = require("path");
const fs = require("fs").promises;
const TemplateSchema = require("../Database/Schemas/TemplateSchema");

router.post("/generate-certificate", async (req, res) => {
  const { templateId, dataArr } = req.body;

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

    const imagePath = path.join(__dirname, "../public/uploads", path.basename(parsedData.image));

    try {
      const imageData = await fs.readFile(imagePath);
      const base64Image = imageData.toString("base64");

      const imageObj = {
        content: base64Image,
        type: "image/png", // Assuming the image is a PNG
      };

      const responseObject = {
        id: parsedData._id,
        imageObj,
        image: parsedData.image,
        texts: parsedData.texts,
      };

      res.status(200).json(responseObject);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error retrieving image", error: err.message });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving data", error: error.message });
  }
});

module.exports = router;