const mongoose = require('mongoose');

require('dotenv').config();

const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
//const client = new MongoClient(uri);

async function connectToMongoDB() {
  try {
    //mongoose.set("useNewUrlParser", true);

    await mongoose.connect(uri);

    console.log("connected to database");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};


module.exports = connectToMongoDB;
