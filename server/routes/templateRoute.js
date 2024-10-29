// routes/dataRoutes.js
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Resolve path to the 'public/uploads' folder from the server root
    cb(null, path.resolve(__dirname, "../public/uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename the file
  },
});

const upload = multer({ storage });

// Route to store an array of texts and an image
router.post("/store", upload.single("image"), (req, res) => {
  const texts = JSON.parse(req.body.texts); // Expecting an array of texts
  const imagePath = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;
  // Construct the data to save
  const dataToSave = {
    texts: texts, // Parse texts from JSON string
    image: imagePath,
  };

  // Save the data to a JSON file
  fs.writeFile("data.json", JSON.stringify(dataToSave, null, 2),'utf8', (err) => {
    if (err) {
      return res.status(500).json({ message: "Error saving data", error: err });
    }
    res.status(200).json({ message: "Data saved successfully" });
  });
});



// Route to retrieve data and include the image as a base64 string
router.get("/retrieve", (req, res) => {
  // Read the data.json file
  fs.readFile("data.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error retrieving data", error: err });
    }

    const parsedData = JSON.parse(data);
    
    // Construct the path to the image
    const imagePath = path.join(__dirname, "../public/uploads", parsedData.image.split("/").pop());

    // Read the image file
    fs.readFile(imagePath, (err, imageData) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error retrieving image", error: err });
      }

      // Convert image data to base64
      const base64Image = imageData.toString("base64");
      
      // Create imageObj with the base64 string
      const imageObj = {
        content: base64Image,
        type: `image/png`, // Assuming the image is a PNG
      };

      // Construct the response object
      const responseObject = {
        imageObj,  // Include the imageObj
        image: parsedData.image,
        texts: parsedData.texts, // Return texts
      };

      // Send the response
      res.status(200).json(responseObject);
    });
  });
});


module.exports = router;
