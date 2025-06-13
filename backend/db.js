require('dotenv').config(); 
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI; 

const client = new MongoClient(uri);

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to itemsDB!");
    return client.db('mi_base_datos_items'); 
  } catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1); 
  }
}

module.exports = connectToDatabase;