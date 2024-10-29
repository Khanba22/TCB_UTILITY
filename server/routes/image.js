const express = require("express");
const path = require("path");
const router = express.Router();

// Route to serve PNG image by filename
router.get("/uploads/:filename", (req, res) => {
  const filename = req.params.filename;
  console.log(filename);
  // Check if the filename has a .png extension
  if (path.extname(filename) !== ".png") {
    return res.status(400).send("Only PNG files are supported.");
  }
  console.log("Request hit");
  // Construct the full file path
  const filePath = path.join(__dirname, "../public/uploads", filename);

  // Send the image file as a response
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(404).send("Image not found");
    }
  });
});

module.exports = router;
