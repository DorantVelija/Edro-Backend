const express = require("express");
const bodyParser = require("body-parser");
const { connectToDatabase, getDb } = require("./database");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use((req, res, next) => {
  // Allow requests from any origin
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Allow specific methods
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  // Allow specific headers
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Allow preflight requests to be cached for 24 hours (86400 seconds)
  res.setHeader("Access-Control-Max-Age", "86400");
  next();
});

async function startServer() {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/users", async (req, res) => {
  try {
    const db = getDb();
    const collection = db.collection("Users");

    const newUser = req.body;
    const result = await collection.insertOne(newUser);
    res.status(200).send(`User inserted with _id: ${result.insertedId}`);
  } catch (error) {
    console.error("Error inserting user:", error);
    res.status(500).send("Failed to insert user: " + error.message);
  }
});

app.get("/users", async (req, res) => {
  try {
    const db = getDb();
    const collection = db.collection("Users");

    // Fetch all users
    const users = await collection.find({}).toArray();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Failed to fetch users: " + error.message);
  }
});

app.get("/users/email/:email", async (req, res) => {
  try {
    const db = getDb();
    const collection = db.collection("Users");

    // Fetch the user by email
    const user = await collection.findOne({ email: req.params.email });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send(`User with email ${req.params.email} not found`);
    }
  } catch (error) {
    console.error("Error fetching user by email:", error);
    res.status(500).send("Failed to fetch user: " + error.message);
  }
});

app.get("/users/:username/posts", async (req, res) => {
  try {
    const db = getDb();
    const collection = db.collection("Users");

    // Find the user by username and project only the posts
    const user = await collection.findOne(
      { name: req.params.username },
      { projection: { posts: 1 } }
    );

    if (user) {
      res.status(200).json(user.posts);
    } else {
      res.status(404).send(`User ${req.params.username} not found`);
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).send("Failed to fetch posts: " + error.message);
  }
});

try {
  await db
    .collection("Users")
    .updateOne({ _id: "list" }, { $push: { items: newData } });
  res.status(201).json({ message: "Data added successfully", newData });
} catch (error) {
  console.error("Error adding data to MongoDB", error);
  res.status(500).json({ message: "Internal Server Error" });
}

startServer();
