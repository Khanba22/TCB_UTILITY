const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const dotenv = require("dotenv");
const { csvToJson } = require("./functions/csvToJsonConverter");
const { generateDataFrame } = require("./functions/generateDataFrame");
const connectToMongo = require("./Database/DB");
dotenv.config();
connectToMongo()

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

// Set up multer for CSV file uploads
const upload = multer({ dest: "/documents/" });

// POST route to handle CSV file upload and conversion
app.post("/api/convert-csv", upload.single("file"), async (req, res) => {
  try {
    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Call csvToJson function with the uploaded file path
    const jsonResult = await csvToJson(req.file.path);
    const jsonDataFrame = generateDataFrame(jsonResult);
    const rowDf = jsonDataFrame.getRows();

    // Delete the file after processing
    fs.unlinkSync(req.file.path);

    // Send JSON result as response
    res.json({ dataFrame: rowDf, keys: jsonDataFrame.keys });
  } catch (error) {
    console.error("Error in CSV conversion:", error);
    res.status(500).json({ error: "Failed to convert CSV to JSON" });
  }
});

// Use design route for template handling
app.use("/api/design", require("./routes/templateRoute"));
app.use("/api/certificate", require("./routes/certificateRoute"));

// Root route to check server status
app.get("/api", (req, res) => {
  res.send("Server Active");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
