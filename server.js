import express from "express"
import ViteExpress from "vite-express"

const app = express();
const port = 3000;

app.use(express.json());

const assignmentData = [
    {className: "CS 4241", assignmentName: "Assignment 2", dueDate:"2023-09-11", difficulty: 5, priority: "Medium"},
    {className: "CS 3013", assignmentName: "Homework 1", dueDate:"2023-09-05", difficulty: 3, priority: "Low"}
];

app.post("/submit-assignment", (request, response) => {
    assignmentData.push(request.body);
    response.writeHead(200,{"Content-Type" : "application/json"});
    response.end(JSON.stringify({result: "success"}));
});

app.get("/get-assignments", (request, response) => {
    response.writeHead(200,{"Content-Type" : "application/json"});
    response.end(JSON.stringify(assignmentData))
})


ViteExpress.listen(app, 3000);