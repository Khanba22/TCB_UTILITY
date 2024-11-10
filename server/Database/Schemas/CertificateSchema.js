const mongoose = require("mongoose");
const TemplateSchema = require("./TemplateSchema");

const CertificateSchema = mongoose.Schema({
  templateName: String,
  image: String,
  dimensions: Object,
  texts: Array,
  generatedID:String,
  driveFileId:String,
});

module.exports = mongoose.model("Certificate", CertificateSchema);
