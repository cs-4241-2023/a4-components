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
    let sentData = request.body;

    let className = sentData.className;
    let assignmentName = sentData.assignmentName;
    let dueDate = sentData.dueDate;
    let difficulty = sentData.difficulty;
    let difficultyNum = parseInt(difficulty);

    let result;

    // send failure if any of the fields are empty
    if (className === "" || assignmentName === "" || dueDate === "") {
        result = {result: "Failure", message: "One or more fields are empty!"};
    } else if (difficulty === "" || isNaN(difficultyNum) || difficultyNum < 0 || difficultyNum > 10) {
        result = {result: "Failure", message: "Difficulty must be an integer between 1 and 10!"};
    } else {
        let priority = calculatePriority(dueDate, difficulty); // calculate derived field

        await assignmentCollection.insertOne(
            {
                className: className,
                assignmentName: assignmentName,
                dueDate: dueDate,
                difficulty: difficulty,
                priority: priority
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
                className: request.body.className,
                assignmentName: request.body.assignmentName,
                dueDate: request.body.dueDate,
                difficulty: request.body.difficulty,
                priority: calculatePriority(request.body.dueDate, request.body.difficulty)
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

const calculatePriority = function (dueDate, difficulty) {
    let date = new Date(dueDate);
    if((difficulty > 0 && difficulty <= 3) || date.getDay() >= 14) {
        return "Low";
    } else if((difficulty > 3 && difficulty <= 6) || (date.getDay() >= 7 && date.getDay() < 14)) {
        return "Medium";
    } else {
        return "High";
    }
}

ViteExpress.listen(app, port);