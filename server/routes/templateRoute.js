const express = require("express");
const multer = require("multer");
const { google } = require('googleapis');
const stream = require('stream');
const TemplateSchema = require("../Database/Schemas/TemplateSchema");
const mongoose = require("mongoose");
const router = express.Router();

// Configure Google Drive API
const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json", // Ensure this path is correct
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const drive = google.drive({ version: 'v3', auth });

// Set up multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

router.post("/save/:id?", upload.single("image"), async (req, res) => {
  const id = req.params.id || new mongoose.Types.ObjectId();
  let texts, dimensions;

  try {
    texts = JSON.parse(req.body.texts);
    dimensions = JSON.parse(req.body.dimensions);
  } catch (error) {
    return res.status(400).json({ message: "Invalid JSON in request body", error: error.message });
  }

  if (!req.file) {
    return res.status(400).json({ message: "No image file uploaded" });
  }

  try {
    // Upload file to Google Drive
    const bufferStream = new stream.PassThrough();
    bufferStream.end(req.file.buffer);
    const fileMetadata = {
      name:`${id}.${req.file.mimetype.split('/')[1]}`,
      parents: ['12-rMuAdloAOWGT4BfWkoDCRN8ORoa_LG'], // Replace with your folder ID
    };
    
    const media = {
      mimeType: req.file.mimetype,
      body: bufferStream,
    };
    
    const driveResponse = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id,webViewLink',
    });

    // Create shareable link
    await drive.permissions.create({
      fileId: driveResponse.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    const dataToSaveOrUpdate = {
      _id: id,
      generatedID: id,
      dimensions: dimensions,
      texts: texts,
      image: driveResponse.data.webViewLink,
      driveFileId: driveResponse.data.id,
    };

    if (req.params.id) {
      // If an ID is provided in the URL, update the existing template
      const existingTemplate = await TemplateSchema.findById(id);
      if (existingTemplate?.driveFileId) {
        try {
          await drive.files.delete({
            fileId: existingTemplate.driveFileId,
          });
        } catch (error) {
          console.error('Error deleting old file:', error);
        }
      }

      const updatedData = await TemplateSchema.findByIdAndUpdate(
        id,
        dataToSaveOrUpdate,
        { new: true, runValidators: true }
      );

      if (updatedData) {
        return res.json({
          data: updatedData,
          message: "Template updated successfully",
        });
      } else {
        return res.status(404).json({ message: "Template not found" });
      }
    } else {
      // Create a new template object if no ID is provided
      const newTemplate = await TemplateSchema.create(dataToSaveOrUpdate);
      return res.json({
        data: newTemplate,
        message: "Template created successfully",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error saving/updating template",
      error: error.message,
    });
  }
});

// Route to retrieve data and include the image as a base64 string
router.get("/retrieve/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const parsedData = await TemplateSchema.findById(id);
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
      type: parsedData.image.includes('png') ? 'image/png' : 'image/jpeg',
    };

    // Construct the response object
    const responseObject = {
      id: parsedData._id,
      imageObj,
      image: parsedData.image,
      dimensions: parsedData.dimensions,
      texts: parsedData.texts,
    };

    // Send the response
    res.status(200).json(responseObject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: "Error retrieving data", 
      error: error.message 
    });
  }
});

module.exports = router;  