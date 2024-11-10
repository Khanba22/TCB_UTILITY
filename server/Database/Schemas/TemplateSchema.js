const mongoose = require("mongoose");

const TemplateSchema = mongoose.Schema({
  templateName: String,
  image: String,
  dimensions: Object,
  texts: Array,
  generatedID:String,
  driveFileId:String,
});


module.exports = mongoose.model("Template", TemplateSchema);