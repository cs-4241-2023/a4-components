import express from 'express'
import ViteExpress from 'vite-express'
import { MongoClient, ServerApiVersion } from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv'

const app = express();

let userdata = null;
let userid = "admin";

app.use( express.json() )
app.use(cors())
dotenv.config()

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let collection = null

async function run() {
  await client.connect()
  collection = await client.db("workoutlogdb").collection("workoutlog")
}

app.get("/fetchData", async (_, res) => {
  const docs = await collection.find({}).toArray()
  if (docs.length !== 0) {
    userdata = docs
  } 
  res.json(userdata)
})

app.post( '/submit', async (req,res) => {
  userdata[0]['workoutdata'].push(req.body)
  const result = await collection.replaceOne({"userid": userid }, userdata[0])
  res.json( result )
})

app.post( '/delete', async (req,res) => {
    userdata[0]['workoutdata'].splice(req.body.deleteResponse, 1);
    const result = await collection.replaceOne({"userid": userid }, userdata[0])
    res.json( result )
})

run()

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000...")
);
