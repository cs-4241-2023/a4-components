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
  callbackURL: "https://a3colinm1215-m9bh3.ondigitalocean.app/auth/github/callback"
},
(accessToken, refreshToken, profile, done) => {
    // Here you would typically look up or save the user in your database
    // For the sake of this example, let's just return the profile
    return done(null, profile);
}
));


app.use(express.static(path.join(__dirname, 'build')));

// Add your API routes here
app.get('/api/getData', async (req, res) => { /* ... */ });
app.post('/api/submit', async (req, res) => { /* ... */ });
app.post('/api/modifyData/:id', async (req, res) => { /* ... */ });
app.delete('/api/data', async (req, res) => { /* ... */ });

// This should be the last route
// It tells Express to serve up the `index.html` if it doesn't recognize the route
// This ensures React's BrowserRouter works correctly
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
});


app.listen(process.env.PORT || port, () => {
  console.log(`Server is running on ${port}`);
});
