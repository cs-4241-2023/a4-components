import express from "express";
import ViteExpress from "vite-express";
import cors from "cors"

const port = 3000;

let appdata = [];

const app = express();

app.use(cors())
app.use(express.json())

app.get('/getTodos', (req, res) => {
    res.json(appdata);
});

app.post('/submit', (req, res) => {
    let receivedData = req.body;
    console.log(req.body)
    let date = new Date(receivedData.dueDate);
    let today = new Date();
    const diff = date - today;
    let priority = "";
    if (diff < 200000000) {
        priority = "HIGH";
    } else {
        priority = "LOW";
    }
    receivedData.priority = priority;

    appdata.push(receivedData);
    console.log("Added: ", receivedData.todoinput, " Due on: ", receivedData.dueDate);
    res.status(200).send('Data received');
});

app.post('/delete', (req, res) => {
    const receivedData = req.body;
    const index = appdata.findIndex(item => item.id === receivedData.id);
    if (index !== -1) {
        appdata.splice(index, 1);
        console.log("Deleted id#: ", receivedData.id);
        res.status(200).send('Todo deleted');
    } else {
        console.log("ID not found: ", receivedData.id);
        res.status(400).send('ID not found');
    }
});

ViteExpress.listen(app, port, () => console.log("Server is listening..."))