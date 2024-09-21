const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://edro:CGITbxC6lfU8Krg1@cluster0.u33sd.mongodb.net/Profiles?retryWrites=true&w=majority&tls=true&tlsInsecure=true";

async function testConnection() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Connection failed:", error);
  } finally {
    await client.close();
  }
}

testConnection();
