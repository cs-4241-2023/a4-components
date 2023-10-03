const express = require("express");
const ViteExpress = require("vite-express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const logdata = []

let userdata = null;
let userid = "admin";

app.use( express.json() )
require("dotenv").config()

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

  app.get("/fetchData", async (req, res) => {
    const docs = await collection.find({"userid":userid}).toArray()
    if (docs.length !== 0) {
      userdata = docs
    } else {
      userdata = {"userid": userid, "workoutdata": []}
      let response = await collection.insertOne(userdata)
    }
    res.json(userdata)
  })
}

app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})

app.post( '/submit', async (req,res) => {
  console.log(userdata)
  userdata[0]['workoutdata'].push(req.body)

  console.log(userdata)
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
