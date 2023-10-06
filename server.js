import express from "express"
import ViteExpress from "vite-express"
import env from "dotenv"
import {MongoClient, ObjectId} from "mongodb"

const app = express();
const port = 1111;
env.config();

const dbURL =
    // eslint-disable-next-line no-undef
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}`;

const dbClient = new MongoClient(dbURL);
let assignmentCollection = null;

const initDatabase = async () => {
    await dbClient.connect();
    assignmentCollection = await dbClient.db("a3").collection("a3");
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
    let sentData = request.body;

    let task = sentData.task;
    let duedate = sentData.duedate;

    let result;

    // send failure if any of the fields are empty
    if (task === "" || duedate === "") {
        result = {result: "Failure", message: "One or more fields are empty!"};
    } else {

        await assignmentCollection.insertOne(
            {
                task: task,
                duedate: duedate,
            }
        );
        result = {result: "Success", message: ""};
    }
    response.writeHead(200,{"Content-Type" : "application/json"});
    response.end(JSON.stringify(result));
});

app.put("/edit-assignment", async (request, response) => {
    await assignmentCollection.updateOne(
        {_id: new ObjectId(request.body._id)},
        {
            $set: {
                task: request.body.task,
                duedate: request.body.duedate,
            }
        }
    );
    response.writeHead(200, {"Content-Type": "application/json"});
    response.end(JSON.stringify({result: "Success", message: ""}));
});

app.delete("/delete-assignment", async (request, response) => {
    await assignmentCollection.deleteOne({
        _id: new ObjectId(request.body._id)
    });
    response.writeHead(200, {"Content-Type": "application/json"});
    response.end(JSON.stringify({result: "Success", message: ""}));
});

ViteExpress.listen(app, port); // listen on port 3000