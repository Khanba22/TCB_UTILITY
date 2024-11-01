// routes/dataRoutes.js
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const TemplateSchema = require("../Database/Schemas/TemplateSchema");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, "../public/uploads")); // Save to 'public/uploads' folder
  },
  filename: (req, file, cb) => {
    // Generate or retrieve the ID to be used for the filename and database storage
    const id = req.params.id || req.body.imageId || uuidv4(); 
    const newFilename = `${id}${path.extname(file.originalname)}`;
    req.generatedId = id; // Store the generated ID in the request object for access in the route handler
    cb(null, newFilename); // Overwrite if the filename is the same
  },
});

const upload = multer({ storage });

router.post("/save/:id?", upload.single("image"), async (req, res) => {
  const id = req.params.id || req.generatedId; // Use either the provided ID or the generated ID
  const texts = JSON.parse(req.body.texts); // Parse texts from request body
  const imagePath = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`; // Construct image URL
  const dataToSaveOrUpdate = {
    _id: id, // Store the generated id in the object
    generatedID:id,
    texts: texts, // Array of texts
    image: imagePath, // URL of the uploaded image
  };

  try {
    if (id && req.params.id) {
      // If an ID is provided in the URL, update the existing template
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

    const imagePath = path.join(
      __dirname,
      "../public/uploads",
      parsedData.image.split("/").pop()
    );

    // Read the image file
    fs.readFile(imagePath, (err, imageData) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ message: "Error retrieving image", error: err.message });
      }

      // Convert image data to base64
      const base64Image = imageData.toString("base64");

      // Create imageObj with the base64 string
      const imageObj = {
        content: base64Image,
        type: "image/png", // Assuming the image is a PNG
      };

      // Construct the response object
      const responseObject = {
        id: parsedData._id, // Include the stored id in the response
        imageObj, // Include the imageObj
        image: parsedData.image,
        texts: parsedData.texts, // Return texts
      };

      // Send the response
      res.status(200).json(responseObject);
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error retrieving data", error: error.message });
  }
});

module.exports = router;
