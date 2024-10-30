const URI = process.env.MONGO_CONNECTION_URI || "mongodb://127.0.0.1:27017/automailer";
const mongoose = require("mongoose");

const connectToMongo = async () => {
  console.log(URI);

  await mongoose.connect(URI).catch((err) => {
    console.log("Cannot Connect To Database",err);
  });
  console.log("Connection Successful");
};

module.exports = connectToMongo;
