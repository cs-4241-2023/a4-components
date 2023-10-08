import express from "express";
import ViteExpress from "vite-express";
import dotenv from "dotenv";
dotenv.config();
const app = express();

let todos = [];

app.use(express.json());

app.get("/tasks", async (req, res) => {
  res.json(todos);
});

app.post("/add", async (req, res) => {
  todos.push(req.body);
  res.json(todos);
});

app.put("/edit", function (req, res) {
  todos = todos.map(task => {
    if (task.id === req.body.id) {
      return req.body;
    } else {
      return task;
    }
  });
  res.json(todos);
});

app.delete("/delete/:id", async (req, res) => {
  todos = todos.filter(task => task.id !== req.params.id);
  res.json(todos);
});

ViteExpress.listen(app, 3000);
