//server.js
require('dotenv').config()

const express = require('express');
const { MongoClient , ObjectId } = require('mongodb');



const app = express();
const port = process.env.PORT || 3000;
console.log(process.env.MONGO_URL)
// MongoDB Atlas connection string
const url = process.env.MONGO_URL ;

app.use(express.json());

app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

// Connect to MongoDB Atlas when the server starts
async function connectToMongoDB() {
  try {
    const client = new MongoClient(url);
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    return client;
  } catch (err) {
    console.error('Error connecting to MongoDB Atlas:', err);
    throw err; // Rethrow the error so that the server fails to start if there's a connection error
  }
}

// Define a global variable to hold the MongoDB client
let mongoClient;

// Start the server
async function startServer() {
  try {
    // Connect to MongoDB Atlas
    mongoClient = await connectToMongoDB();

    } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1); // Exit the process with a non-zero status code to indicate failure
  }
}

startServer().then(() => {
  // Start handling requests after the server has started and the database connection has been established
  console.log('Server started and database connected.');
  // Call the function to add ratings
}).catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1); // Exit the process with a non-zero status code to indicate failure
});


app.get("/", async (req, res) => {
  res.sendFile(__dirname+'/index.html');
});

// Server-side route to fetch tasks data
app.get("/tasks", async (req, res) => {
  try {
      // Access a specific database and collection
      const database = mongoClient.db('todo-list');
      const collection = database.collection('tasks');

      // Fetch tasks from MongoDB+++++++++++
      const tasks = await collection.find({}).toArray();

      // Send tasks data as a JSON response
      res.json(tasks);
  } catch (err) {
      console.error('Error fetching tasks from MongoDB:', err);
      res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a new task
app.post("/add-task", async (req, res) => {
  try {
      // Access a specific database and collection
      const database = mongoClient.db('todo-list');
      const collection = database.collection('tasks');

      await collection.insertOne({
          description: req.body.task,
      });

      // Send success response
      res.redirect("/");
  } catch (err) {
      console.error('Error inserting data to MongoDB:', err);
      res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a task
app.delete("/delete-task/:id", async (req, res) => {
  try {
      // Access a specific database and collection
      const database = mongoClient.db('todo-list');
      const collection = database.collection('tasks');

      // Delete the task based on the provided id
      const result = await collection.deleteOne({_id:new ObjectId(req.params.id) });
      // console.log(req.params.id);
      console.log(result);

      // Send success response
      res.sendStatus(200);
  } catch (err) {
      console.error('Error deleting task from MongoDB:', err);
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.put("/update-task/:id", async (req, res) => {
  try {
      // Access a specific database and collection
      const database = mongoClient.db('todo-list');
      const collection = database.collection('tasks');

      // Extract the new description from the request body
      const description  = req.body.description;
      console.log(req.body.description , typeof req.body.description);

      // Update the task based on the provided id
      const result = await collection.updateOne({ _id:new ObjectId(req.params.id) }, { $set: { description: description } });
      console.log(result);
      // Check if the update operation was successful
      if (result.modifiedCount === 1) {
          console.log(`Task with ID ${req.params.id} updated successfully`);
          res.sendStatus(200);
      } else {
          console.log(`No task found with ID ${req.params.id}`);
          res.sendStatus(404);
      }
  } catch (err) {
      console.error('Error updating task in MongoDB:', err);
      res.status(500).json({ error: 'Internal server error' });
  }
});

// Server-side route to delete all tasks
app.delete("/delete-all-tasks", async (req, res) => {
  try {
      // Access a specific database and collection
      const database = mongoClient.db('todo-list');
      const collection = database.collection('tasks');

      // Delete all tasks from the collection
      const result = await collection.deleteMany({});

      // Check if the delete operation was successful
      if (result.deletedCount > 0) {
          console.log("All tasks deleted successfully");
          res.sendStatus(200);
      } else {
          console.log("No tasks found to delete");
          res.sendStatus(404);
      }
  } catch (err) {
      console.error('Error deleting all tasks from MongoDB:', err);
      res.status(500).json({ error: 'Internal server error' });
  }
});


// Start the Express server
app.listen(port,"0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
});
