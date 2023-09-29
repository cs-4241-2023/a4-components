import express from 'express'
import ViteExpress from 'vite-express'
import { MongoClient } from "mongodb"
import dotenv from 'dotenv'
dotenv.config()

console.log(process.env.MONGODB_URI)
const app = express()
const port = process.env.PORT || 3000;

app.use(express.json())
const uri = process.env.MONGODB_URI, client = new MongoClient(uri)
console.log(uri)
let collection = null

async function run() {
    await client.connect()
    collection = await client.db("webware").collection("a4")
    console.log("Connected to MongoDB")
}
run()

app.use(express.json())

app.use((req, res, next) => {
    next()
})
app.get('/read', async (req, res) => {
    console.log("READ" + uri)
    if (collection !== null) {
        let data = await collection.find({}).toArray()
        res.json(data)
    }
})

app.post('/add', async (req, res) => {
    try {
        const result = await collection.insertOne(req.body)
        let data = await collection.find({}).toArray()
        res.json(data)
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.delete('/delete', async (req, res) => {
    const result = await collection.deleteOne(req.body);
    if (result.deletedCount === 1) {
        console.log("Successfully deleted one document.");
        let data = await collection.find({}).toArray()
        res.json(data)
    } else {
        console.log("No documents matched the query. Deleted 0 documents.");
    }
})


ViteExpress.listen(app, 3000)
