const mongoose = require('mongoose');
require('dotenv').config();

const uri = `mongodb+srv://admin:${process.env.DB_PASSWORD}@portfolios.v4p6z.mongodb.net/portfolios?retryWrites=true&w=majority&appName=Portfolios`;

async function connectDB() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to Database");
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    return null;
  }
}

module.exports = {
  connectDB,
};