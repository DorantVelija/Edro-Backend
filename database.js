const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://edro:CGITbxC6lfU8Krg1@cluster0.u33sd.mongodb.net/Profiles?retryWrites=true&w=majority&tls=true&tlsInsecure=true";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db;

async function connectToDatabase() {
  try {
    await client.connect();
    db = client.db("Profiles");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
}

function getDb() {
  return db;
}

module.exports = { connectToDatabase, getDb };
