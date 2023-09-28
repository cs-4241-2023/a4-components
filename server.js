import express from "express"
import ViteExpress from "vite-express"
import env from "dotenv"
import {MongoClient, ObjectId} from "mongodb"



const app = express();
const port = 3000;
env.config();

const dbURL =
    // eslint-disable-next-line no-undef
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}`;

const dbClient = new MongoClient(dbURL);
let assignmentCollection = null;

const initDatabase = async () => {
    await dbClient.connect();
    assignmentCollection = await dbClient.db("Database0").collection("Collection2");
}

initDatabase().then(() => {
    console.log("Connecting to database...");
    if(assignmentCollection !== null) {
        console.log("Connected to database!");
    } else {
        console.error("Database connection not found");
    }
});

app.get("/get-assignments", async (request, response) => {
    let assignmentData = await assignmentCollection.find({}).toArray();
    response.writeHead(200, {"Content-Type": "application/json"});
    response.end(JSON.stringify(assignmentData))
});

app.use(async (request, response, next) => {
    if(assignmentCollection !== null) {
        next();
    } else {
        response.sendStatus(503);
    }
});

app.use(express.json());

app.post("/submit-assignment", async (request, response) => {
    // TODO: Calculate priority and reject bad data
    await assignmentCollection.insertOne(request.body);
    response.writeHead(200,{"Content-Type" : "application/json"});
    response.end(JSON.stringify({result: "success"}));
});

app.put("/edit-assignment", (request, response) => {
    // TODO: React front-end implementation for edit
    response.writeHead(200,{"Content-Type" : "application/json"});
    response.end(JSON.stringify({result: "success"}));
});

app.delete("/delete-assignment", async (request, response) => {
    await assignmentCollection.deleteOne({
        _id: new ObjectId(request.body._id)
    });
    response.writeHead(200, {"Content-Type": "application/json"});
    response.end(JSON.stringify({result: "success"}));
});

ViteExpress.listen(app, port);