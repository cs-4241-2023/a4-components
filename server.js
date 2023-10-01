require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const fs = require('fs');
const mime = require('mime');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const app = express();
const port = 3000;

const uri_tasks = "mongodb+srv://doapps-4ec1f246-ba4d-4013-aed9-b45e89750f81:l149ko35X086aHQj@db-mongodb-nyc1-53233-0b371da4.mongo.ondigitalocean.com/Tasks?authSource=admin&tls=true";

var conn = mongoose.createConnection(uri_tasks, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true
});

const taskSchema = new mongoose.Schema({
  task: String,
  hours: Number,
  dueDate: Date,
  timeLeft: String,
  priority: String,
  userId: String
});

const Task = conn.model('Task', taskSchema);

app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(new GitHubStrategy({
  clientID: '46eed9c0b0d5d6d2692d',
  clientSecret: 'ff3757c5d09b21eb079a2b2e6b3036cd2d8dbee6',
  callbackURL: "https://a3colinm1215-m9bh3.ondigitalocean.app/auth/github/callback"
}));

app.use(function (req, res, next) {
  console.log("use");
  if (req.user || req.path === '/login.html' || req.path === '/auth/github' || req.path.includes('/auth/github/callback') || req.path.includes('/robots.txt')) {
    next();
  }
  else {
    res.sendFile(__dirname + '/public/login.html');
  }
});

app.use(express.static('public'));

app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  function (req, res) {
    res.redirect('/index.html');
  });

app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send('Error during logout.');
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send('Error destroying session.');
      }
      return res.redirect('/login.html');
    });
  });
});

app.get('/getName', async (req, res) => {
  try {
    res.send(req.user.username);
  } catch (err) {
    res.status(500).send('Error fetching data from database.');
  }
});

app.get('/getData', async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });

    res.json(tasks);
  } catch (err) {
    res.status(500).send('Error fetching data from database.');
  }
});

app.post('/submit', async (req, res) => {
  const receivedData = req.body;

  const task = receivedData.task;
  if (!task || task.trim() === "") {
    res.status(400).send("Bad Request : A task description is required");
    return;
  }

  const hours = parseFloat(receivedData.hours);
  if (isNaN(hours) || hours <= 0) {
    res.status(400).send("Bad Request : Invalid hours. Please enter a number greater than 0.");
    return;
  }

  const dueDate = new Date(receivedData.dueDate);
  if (isNaN(dueDate)) {
    res.status(400).send("Bad Request : Invalid Due Date provided.");
    return;
  }

  const now = new Date();
  const timeLeft = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));

  let priority;
  const timeRatio = (timeLeft * 24.0) / hours;

  if (timeRatio >= 3) {
    priority = "low";
  } else if (timeRatio >= 1.5) {
    priority = "medium";
  } else {
    priority = "high";
  }

  const newTask = new Task({
    task: receivedData.task,
    hours: parseFloat(receivedData.hours),
    dueDate: receivedData.dueDate,
    timeLeft: timeLeft > 0 ? `${timeLeft} days` : "Past due",
    priority: priority,
    userId: req.user.id
  });

  try {
    await newTask.save();
    res.status(200).send("OK : Data received and added to the database");
  } catch (err) {
    res.status(500).send('Error saving to database.');
  }
});

app.post('/modifyData/:id', async (req, res) => {
  const receivedData = req.body;

  const task = receivedData.task;
  if (!task || task.trim() === "") {
    res.status(400).send("Bad Request : A task description is required");
    return;
  }

  const hours = parseFloat(receivedData.hours);
  if (isNaN(hours) || hours <= 0) {
    res.status(400).send("Bad Request : Invalid hours. Please enter a number greater than 0.");
    return;
  }

  const dueDate = new Date(receivedData.dueDate);
  if (isNaN(dueDate)) {
    res.status(400).send("Bad Request : Invalid Due Date provided.");
    return;
  }

  const now = new Date();
  const timeLeft = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));

  let priority;
  const timeRatio = (timeLeft * 24.0) / hours;

  if (timeRatio >= 3) {
    priority = "low";
  } else if (timeRatio >= 1.5) {
    priority = "medium";
  } else {
    priority = "high";
  }

  const updatedData = {
    task: receivedData.task,
    hours: parseFloat(receivedData.hours),
    dueDate: receivedData.dueDate,
    timeLeft: timeLeft > 0 ? `${timeLeft} days` : "Past due",
    priority: priority,
    userId: req.user.id
  };

  try {
    await Task.findOneAndUpdate({ task: receivedData.task }, updatedData);
    res.status(200).send("Data modified successfully");
  } catch (err) {
    res.status(400).send("Error updating data in database.");
  }
});

app.delete('/data', async (req, res) => {
  const taskToDelete = req.body.task;

  try {
    const result = await Task.findOneAndDelete({ task: taskToDelete });

    if (result) {
      res.status(200).send('Data deleted successfully');
    } else {
      res.status(404).send('Data not found');
    }
  } catch (err) {
    res.status(500).send('Error deleting data from database.');
  }
});

app.get('*', (req, res) => {
  const filename = __dirname + '/public' + req.url;
  const type = mime.getType(filename);

  fs.readFile(filename, (err, content) => {
    if (err) {
      res.status(404).send('404 Error: File Not Found');
    } else {
      res.set('Content-Type', type);
      res.send(content);
    }
  });
});

app.listen(process.env.PORT || port, () => {
  console.log(`Server is running on ${port}`);
});
