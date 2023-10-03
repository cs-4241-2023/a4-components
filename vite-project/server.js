import express from 'express'
import ViteExpress from 'vite-express'
import { MongoClient, ServerApiVersion } from 'mongodb'

const app = express();

const uri = `mongodb+srv://dygobran:${process.env.PASSWORD}@webware.q1f112x.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let userCollection = null
let taskCollection = null

async function run() {
  await client.connect();
  userCollection = client.db("webware").collection("users");
  taskCollection = client.db("webware").collection("tasks");
  // Send a ping to confirm a successful connection
  await client.db("admin").command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
}
run().catch(console.dir);

app.use(express.json());

// Handle GET requests
app.get('/get-list/:user', async (req, res) => {
  const user = req.params.user;
  if (taskCollection !== null) {
    const docs = await taskCollection.find({ user: user }).toArray()
    // Add priority field based on due date of task
    docs.forEach((row) => {
      const date = new Date(row.date);
      const today = new Date();
      const diff = date - today;
      if (diff < 0) {
        row.priority = 'high';
      } else if (diff < 604800000) {
        row.priority = 'medium';
      } else {
        row.priority = `don't worry bout it`;
      }
    });
    res.json(docs)
  }
});

app.post('/submit', async (req, res) => {
  const data = req.body;
  console.log(data);
  // add to appropriate collection
  const result = await taskCollection.insertOne(data);
  res.json(result);
});

// Handle DELETE requests
app.delete('/delete-row/:id', async (req, res) => {
  // Get id from URL params
  const id = req.params.id;
  const result = await taskCollection.deleteOne({ 
    id: id
  })
  res.json(result);
});

// Handle PUT requests
app.put('/edit-row/:id', async (req, res) => {
  // Get id from URL params
  const id = req.params.id;
  const result = await taskCollection.updateOne({
    id: id
  }, {
    $set: req.body
  })
  res.json(result);

});

ViteExpress.listen( app, 3000 )
