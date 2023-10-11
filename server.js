import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import ViteExpress from 'vite-express';
const app = express();
import { MongoClient, ObjectId } from 'mongodb';


app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(express.json())

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@a3.5svubdq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri)
let collection = client.db("a3").collection("palettes");

// get all elements
app.get('/getAll', async(req, res) => {
    const docs = await collection.find({ addedBy: "a4" }).toArray()
    res.json(docs)
})

// add object
app.post('/add', async(req, res) => {
    let data = req.body;
    data["addedBy"] = "a4";
    const result = await collection.insertOne(data)
    res.json(result)
})

app.delete('/remove/:id', async(req, res) => {
    let id = req.params.id;
    const result = await collection.deleteOne({
        "_id": new ObjectId(id)
    })

    res.json(result)
})
app.post('/update', async(req, res) => {
    const result = await collection.updateOne({ _id: new ObjectId(req.body._id) }, {
        $set: {
            name: req.body.name,
            primary_color: req.body.primary_color,
            secondary_color: req.body.secondary_color,
            teritary_color: req.body.teritary_color,
            accent_1: req.body.accent_1,
            accent_2: req.body.accent_2
        },
    })

    res.json(result)
})


ViteExpress.listen(app, 3000)