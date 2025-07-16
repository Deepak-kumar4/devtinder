const mongoose = require("mongoose");

const connectDB= async () => {
  await mongoose.connect(
    "mongodb+srv://deepakobc933:Haswiaadmi@cluster1.xevwqro.mongodb.net/devTinder"
  )
};

module.exports = connectDB;
// This code connects to a MongoDB database using Mongoose. It exports the connectDB function   