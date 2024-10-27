const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const csv = require("csv-parser");
const { csvToJson } = require("./functions/csvToJsonConverter");
const dotenv = require("dotenv");
const { generateDataFrame } = require("./functions/generateDataFrame");
const json = require("./tempdata.json");
const upload = multer({ dest: "uploads/" });
dotenv.config();

const app = express();
app.use(express.static(path.join(__dirname, "public")));
const PORT = process.env.PORT || 5000;

// POST route to handle CSV file upload and conversion
app.post("/convert-csv", upload.single("file"), async (req, res) => {
  try {
    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Call csvToJson function with the uploaded file path
    const jsonResult = await csvToJson(req.file.path);
    console.log("Json Result", jsonResult);
    const jsonDataFrame = generateDataFrame(jsonResult);
    const rowDf = jsonDataFrame.getRows();
    console.log("JSonDataFrame", jsonDataFrame);
    // Delete the file after processing
    fs.unlinkSync(req.file.path);

    // Send JSON result as response
    res.json({ dataFrame: rowDf , keys:jsonDataFrame.keys });
  } catch (error) {
    console.error("", error);
    res.status(500).json({ error: "Failed to convert CSV to JSON" });
  }
});

app.get("/", async (req, res) => {
  res.send("Server Active")
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
