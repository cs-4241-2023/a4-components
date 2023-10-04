/* eslint-disable no-undef */
import express from "express";
import ViteExpress from "vite-express";
import cookieSession from "cookie-session";
import { MongoClient, ObjectId } from "mongodb";
import "dotenv/config";

const port = process.env.PORT;
const app = express();

// MongoDB Connection
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}`;
const client = new MongoClient(uri);

client.connect();
const db = client.db("whatToDo");
const usersCollection = db.collection("Users");
let collection = null;

// Middleware
app.use(express.json());
app.use(
    cookieSession({
        name: "session",
        keys: [process.env.SESS_KEY],
    })
);

// Requests
app.get("/init", async (req, res) => {
    sendTasks(req, res);
});

app.post("/login", async (req, res) => {
    // Find the user within the MongoDB
    const response = await usersCollection.findOne({
        username: req.body.username,
    });

    if (response !== null) {
        if (response.password === req.body.password) {
            // Change cookie to say we're logged in
            req.session.user = req.body.username;
            console.log("Login success");
            // Change current collection in the server to the logged in user (might want to change this so it is clientside or write it to the cookie)
            collection = db.collection(response.collection);
            res.status(200);
            res.end();
        } else {
            console.log("Incorrect password");
            res.status(401);
            res.end();
        }
    }
    // Else say user not found and to create a new user.
    else {
        console.log("user not found");
        await db.createCollection(req.body.username)
        console.log("user created")
        usersCollection.insertOne({
          username: req.body.username,
          password: req.body.password,
          collection: req.body.username,
        })
        res.status(404);
        res.end();
    }
});

app.post("/submit", async (req, res) => {
    let newTask = req.body;

    if (newTask.due === "") {
        const originalDate = new Date(newTask.date);
        switch (newTask.priority) {
            case "Low":
                newTask.due = addDays(originalDate, 5)
                    .toISOString()
                    .split("T")[0];
                break;
            case "Medium":
                newTask.due = addDays(originalDate, 3)
                    .toISOString()
                    .split("T")[0];
                break;
            case "High":
                newTask.due = addDays(originalDate, 1)
                    .toISOString()
                    .split("T")[0];
                break;
        }
    }

    const cloneNewTask = { ...newTask };

    delete cloneNewTask._id;

    await collection.replaceOne(
        { _id: new ObjectId(newTask._id) },
        { ...cloneNewTask }
    );

    sendTasks(req, res);
});

app.post("/new", async (req, res) => {
    const newTask = {
        title: "New Note",
        date: new Date().toISOString().split("T")[0],
        priority: "Low",
        description: "",
        dueDate: "",
    };

    await collection.insertOne(newTask);

    sendTasks(req, res);
});

async function sendTasks(req, res) {
    if (collection !== null) {
        const docs = await collection.find({}).toArray();
        res.json(docs);
    }
}

app.delete("/delete", async (req, res) => {
    await collection.deleteOne({ _id: new ObjectId(req.body.taskID) });

    sendTasks(req, res);
});

ViteExpress.listen(app, port, () =>
    console.log("Server is listening on", port)
);
