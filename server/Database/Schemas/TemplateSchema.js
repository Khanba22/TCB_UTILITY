const mongoose = require("mongoose");

const TemplateSchema = mongoose.Schema({
  templateName: String,
  image: String,
  texts: Array,
  generatedID:String,
});


module.exports = mongoose.model("Template", TemplateSchema);