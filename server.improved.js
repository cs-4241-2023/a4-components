import express from "express";
import ViteExpress from "vite-express";
import cors from "cors";
import { duration } from "./utils/helpers.js";

const app = express();

app.use(cors());

// logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} request for ${req.url}`);
  next();
});

// parses JSON bodies
app.use(express.json());

// declare variables to hold the data
let currentId = 3;
let tasksList = [
  {
    id: 0,
    taskName: "Clean the garage",
    taskDescription:
      "Throw away old junk in the trash. Reorganize items to clear up more floor space.",
    taskDeadline: "2023-10-22",
    taskPriority: "Medium",
    taskCreated: "2023-09-05",
  },
  {
    id: 1,
    taskName: "Wash the dishes",
    taskDescription:
      "Wash the dishes in the sink. Put them away in the cabinets.",
    taskDeadline: "2023-10-10",
    taskPriority: "High",
    taskCreated: "2023-09-03",
  },
  {
    id: 2,
    taskName: "Do the laundry",
    taskDescription:
      "Wash the clothes in the washing machine. Dry them in the dryer. Fold them and put them away.",
    taskDeadline: "2023-10-20",
    taskPriority: "Low",
    taskCreated: "2023-09-02",
  },
];

const tasksPreprocessingMiddleware = (req, res, next) => {
  for (let i = 0; i < tasksList.length; i++) {
    tasksList[i].totalTime = duration(
      new Date(tasksList[i].taskCreated),
      new Date(tasksList[i].taskDeadline)
    );
    tasksList[i].timeRemaining = duration(
      new Date(),
      new Date(tasksList[i].taskDeadline)
    );
  }
  // move on to the next middleware
  next();
};

// get all tasks
app.get("/api/tasks", tasksPreprocessingMiddleware, (req, res) => {
  res.json(tasksList);
});

// delete a task
app.delete("/api/tasks/:id", tasksPreprocessingMiddleware, (req, res) => {
  const id = Number(req.params.id);
  tasksList = tasksList.filter((task) => task.id !== id);
  res.json(tasksList);
});

//add a task
app.post(
  "/api/tasks",
  (req, res, next) => {
    const newTask = {
      id: currentId++,
      taskName: req.body.taskName,
      taskDescription: req.body.taskDescription,
      taskDeadline: req.body.taskDeadline,
      taskPriority: req.body.taskPriority,
      taskCreated: new Date().toISOString().slice(0, 10),
    };
    tasksList.push(newTask);
    next();
  },
  tasksPreprocessingMiddleware,
  (req, res) => {
    res.json(tasksList);
  }
);

ViteExpress.listen(app, 3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});
