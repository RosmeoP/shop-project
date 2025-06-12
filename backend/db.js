require('dotenv').config(); // Load environment variables from .env

const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI; // Load MONGO_URI from .env

const client = new MongoClient(uri);

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to itemsDB!");
    return client.db('mi_base_datos_items'); // Return the database instance
  } catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1); // Exit the process if the connection fails
  }
}

module.exports = connectToDatabase;