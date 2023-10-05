const express = require("express");
const ViteExpress = require("vite-express");

const app = express();
const { MongoClient, ObjectId } = require("mongodb");
app.use( express.json() )

require('dotenv').config()
const uri = `mongodb+srv://kg:1111@$cluster0.6ionqch.mongodb.net`
const client = new MongoClient( uri )


let collection = null

async function run() {
  await client.connect()
  collection = await client.db("datatest").collection("test")
  

  // route to get all docs
  app.get("/docs", async (req, res) => {
    if (collection !== null) {
      const docs = await collection.find({}).toArray()
      res.json( docs )
    }
  })
}

run()

const dreams = []
app.post( '/submit', async (req, res) => {

  await client.connect()
  collection =  client.db("datatest").collection("test")
  collection.insertOne(req.body)

  
  res.writeHead( 200, { 'Content-Type': 'application/json' })
  res.end( JSON.stringify( dreams ) )

  
})

app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})



app.post( '/add', async (req,res) => {
  const result = await collection.insertOne( req.body )
  res.json( result )
})

app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})



ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000...")
);




