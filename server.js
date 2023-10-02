require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const path = require('path'); // <-- Add this
const app = express();
const port = 3000;

// const uri_tasks = "mongodb+srv://doapps-4ec1f246-ba4d-4013-aed9-b45e89750f81:l149ko35X086aHQj@db-mongodb-nyc1-53233-0b371da4.mongo.ondigitalocean.com/Tasks?authSource=admin&tls=true";
const uri_tasks = "mongodb+srv://Jack_1224:Herbie101@assignment3.bycjnqa.mongodb.net/?retryWrites=true&w=majority";

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

// Express will serve up production assets from React build directory
app.use(express.static(path.resolve(__dirname, '../build'))); // <-- Add this to point to React's build directory

app.use(session({
  secret: "559b2acc65596376a1e709a3eb40f8c84a994938d6bebf2ff8dc5672842251c2de3f513b2bdc971078f565b211ffa5c7",
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
  callbackURL: "http://localhost:3000/auth/github/callback"
},
(accessToken, refreshToken, profile, done) => {
    // Here you would typically look up or save the user in your database
    // For the sake of this example, let's just return the profile
    return done(null, profile);
}
));

app.use(function (req, res, next) {
  if (req.user || req.path === '/login.html' || req.path === '/auth/github' || req.path.includes('/auth/github/callback') || req.path.includes('/robots.txt')) {
    next();
  }
  else {
    res.sendFile(__dirname + "/build/login.html");
  }
});

app.use(express.static(__dirname + "/build"));

app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  function (req, res) {
    res.redirect('/index.html');
});

// Add your API routes here
app.get('/api/getData', async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });

    res.json(tasks);
  } catch (err) {
    res.status(500).send('Error fetching data from database.');
  }
});


app.post('/api/submit', async (req, res) => {
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

app.post('/api/modifyData/:id', async (req, res) => {
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

app.delete('/api/data', async (req, res) => {
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

// This should be the last route
// It tells Express to serve up the `index.html` if it doesn't recognize the route
// This ensures React's BrowserRouter works correctly
app.get('*', (req, res) => {
  res.sendFile(__dirname + "/build/index.html");
});


app.listen(process.env.PORT || port, () => {
  console.log(`Server is running on ${port}`);
});
