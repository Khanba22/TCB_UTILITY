const mongoose = require("mongoose");
const TemplateSchema = require("./TemplateSchema");

const CertificateSchema = mongoose.Schema({
  templateName: String,
  image: String,
  texts: Array,
  generatedID:String,
});

module.exports = mongoose.model("Certificate", CertificateSchema);
