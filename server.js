import express from  'express'
import ViteExpress from 'vite-express'
import {MongoClient, ServerApiVersion, ObjectId } from 'mongodb'

//const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()

const uri = "mongodb+srv://ngheineman:assignment3@fictiontracker.wlfu0nv.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

let accountName = 'ngheineman'

import session from 'express-session'
//const session = require('express-session');

import passport from 'passport'
//const passport = require('passport');

import GitHubStrategy from 'passport-github2' // might now be broken
//const GitHubStrategy = require('passport-github2').Strategy;


/*
ClientID: f3f3f475744e79044ed5
ClientSecret: ea6c8474ad873ea2a31350a4428537e6ebfe90b0
*/


//OAuth
app.use(session({
  secret: 'babysharkdodododododobabysharkdodododododo', // Replace with a strong and unique secret key
  resave: false,
  saveUninitialized: true,
}));



passport.use(new GitHubStrategy({
  clientID: 'f3f3f475744e79044ed5',
  clientSecret: 'ea6c8474ad873ea2a31350a4428537e6ebfe90b0',
  callbackURL: 'https://fictional-character-tracker.glitch.me/auth/github/callback',
}, async (accessToken, refreshToken, profile, done) => {


  const user = await client.db('world-data').collection('githubUsers').findOne({user : profile.id})

  accountName = profile.username;

  if (!user) {
    const document = {user : profile.id}
    const newUser = await client.db('world-data').collection('githubUsers').insertOne(document)
    return done(null, document);
  } 

  // Save the user object in the session
  return done(null, user);
}));

// Serialize the user to store it in the session
passport.serializeUser((user, done) => {
  done(null, user.user); // Use the GitHub id as the unique identifier
});

// Deserialize the user when retrieving it from the session
passport.deserializeUser(async (id, done) => {
  // Find the user by GitHub username
  const user = await client.db('world-data').collection('githubUsers').findOne({user : id})

  if (!user) {
    return done(new Error('User not found'));
  }

  done(null, user);
});

app.use(passport.initialize());

app.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    // Redirect to a success page or perform other actions after successful authentication
    res.redirect('/index');
  }
);

// Route to display user profile (requires authentication)
app.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`Welcome, ${req.user.username}`);
  } else {
    res.redirect('/');
  }
});



//setup express functions

app.use(express.static('public'));

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/views/login.html');
// });

app.get('/index', (req, res) => {
  res.sendFile('/index.html');
});

app.post('/assignActiveUser', async (req, res) => {

  let dataString = ''

  req.on('data', function (data) {
    dataString += data
  })

  req.on('end', async function () {
    
    const x = dataString;
    const account = await client.db('world_data').collection('users').findOne({user : dataString})

    accountName = account.user;

    res.setHeader('Content-Type', 'text');
    res.end(accountName);
  })
  
})

app.post('/login', async (request, response) => {

  let dataString = ''

  request.on('data', function (data) {
    dataString += data
  })

  request.on('end', async function () {
    let login = dataString.split(' ');

    const account = await client.db('world_data').collection('users').findOne({user : login[0]});

    if(account == null || account.password != login[1]){
      response.writeHead(200, "OK", { 'Content-Type': 'text/json' })
      response.end("false")
    } else {
      response.writeHead(200, "OK", { 'Content-Type': 'text/json' })
      response.end("true")
    }

  })

})

app.post('/signup', async (request, response) => {

  let dataString = ''

  request.on('data', function (data) {
    dataString += data
  })

  request.on('end', async function () {
    let login = dataString.split(' ');
    

    const document = {user : login[0], password: login[1]}

    const account = await client.db('world_data').collection('users').findOne({user : login[0]})
    

    if(account === null){
      await client.db('world_data').collection('users').insertOne(document);
      response.writeHead(200, "OK", { 'Content-Type': 'text/json' })
      response.end("true")
    } else {
      response.writeHead(200, "OK", { 'Content-Type': 'text/json' })
      response.end("false")
    }

  })

})


//get functions

 app.get('/timelineData', async (req, res) => {
  

  const cursor = client.db('world_data').collection('timelineData').find({user : accountName}).sort({date: 1});
  const timelineData = await cursor.toArray()

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(timelineData));
});

app.get('/characterData', async (req, res) => {
  await RecheckCharacters();

  const cursor = client.db('world_data').collection('characterData').find({user : accountName}).sort({start: 1});
  const characterData = await cursor.toArray()
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(characterData));
});




//add functions

app.post('/timelineData', async (request, response) => {
  let dataString = ''

  request.on('data', function (data) {
    dataString += data
  })

  request.on('end', async function () {

    console.log('hello');

    let value = JSON.parse(dataString);
    value.user = accountName;

    const x = await client.db('world_data').collection('timelineData').insertOne(value);
    const cursor = client.db('world_data').collection('timelineData').find({user : accountName}).sort({date : 1});


    await RecheckCharacters()
    const timelineData = await cursor.toArray()

    response.writeHead(200, "OK", { 'Content-Type': 'text/json' })
    response.end(JSON.stringify(timelineData))
  })

})

app.post('/characterData', (request, response) => {
  let dataString = ''

  request.on('data', function (data) {
    dataString += data
  })

  request.on('end', async function () {

    let value = JSON.parse(dataString);

    value.user = accountName;

    const x = await client.db('world_data').collection('characterData').insertOne(value);
    await RecheckCharacters();

    const cursor = client.db('world_data').collection('characterData').find({user : accountName}).sort({start : 1});
    const characterData = await cursor.toArray()

    


    response.writeHead(200, "OK", { 'Content-Type': 'text/json' })
    response.end(JSON.stringify(characterData))
  })

})


//delete functions

app.delete('/timelineData', (request, response) => {
  console.log("Handle Delete");
  let dataString = ''

  request.on('data', function (data) {
    dataString += data
  })

  console.log(dataString);

  request.on('end', async function () {
    let data = JSON.parse(dataString);

    const x = await client.db('world_data').collection('timelineData').deleteOne({user : accountName, era: data.era});

    const cursor = client.db('world_data').collection('timelineData').find({user : accountName}).sort({date : 1});
    const timelineData = await cursor.toArray();

    await RecheckCharacters();

    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(timelineData));
  })
})

app.delete('/characterData', (request, response) => {
  console.log("Handle Delete");
    let dataString = ''

    request.on('data', function (data) {
      dataString += data
    })

    console.log(dataString);

    request.on('end', async function () {
      let data = JSON.parse(dataString);


      const x = await client.db('world_data').collection('characterData').deleteOne({user : accountName, name: data.name});

      const cursor = client.db('world_data').collection('characterData').find({user : accountName}).sort({start : 1});
      const characterData = await cursor.toArray();
      response.writeHead(200, "OK", { 'Content-Type': 'text/json' })
      response.end(JSON.stringify(characterData));
    })
})

//modify functions


app.post('/modifyTimelineData', (request, response) => {
  let dataString = ''

  request.on('data', function (data) {
    dataString += data
  })

  request.on('end', async function () {

    const json = JSON.parse(dataString);
    const id = new ObjectId(json._id);

    const modified = await client.db('world_data').collection('timelineData').updateOne(
      {user : accountName, _id: id},
      {$set: 
        { era: json.era,
          date: json.date,
          description: json.description
        }
      }
    );

    await RecheckCharacters()
    
    const cursor = client.db('world_data').collection('timelineData').find({user : accountName}).sort({date : 1});
    const timelineData = await cursor.toArray();

    response.writeHead(200, "OK", { 'Content-Type': 'text/json' })
    response.end(JSON.stringify(timelineData))
  })

})

app.post('/modifyCharacterData', (request, response) =>{
  let dataString = ''

  request.on('data', function (data) {
    dataString += data
  })

  request.on('end', async function () {
    const json = JSON.parse(dataString);
    const id = new ObjectId(json._id);

    const modified = await client.db('world_data').collection('characterData').updateOne(
      {user : accountName, _id: id},
      {$set: 
        { name: json.name,
          start: json.start,
          end: json.end
        }
      }
    );



    await RecheckCharacters()

    const cursor = client.db('world_data').collection('characterData').find({user : accountName}).sort({start : 1});
    const characterData = await cursor.toArray();

    response.writeHead(200, "OK", { 'Content-Type': 'text/json' })
    response.end(JSON.stringify(characterData))
   
  })

})

async function RecheckCharacters() {

  const cursor = client.db('world_data').collection('characterData').find({user : accountName});
  const characterData = await cursor.toArray();

  const cursor2 = client.db('world_data').collection('timelineData').find({user : accountName}).sort({date: 1});
  const timelineData = await cursor2.toArray();

  for (let i = 0; i < characterData.length; i++) {
    await client.db('world_data').collection('characterData').updateOne(
      { user : accountName, name: characterData[i].name},
      {$set: {era: AssignEra(timelineData, characterData[i])}})
    
  }


}

//passed in timeline data in array form, and specific character value, returns a string which is the eras
function AssignEra(timelineData, value) {
  value.era = "unknown"

  if (timelineData.length === 0) {
    return;
  }
  for (let i = 0; i < timelineData.length - 1; i++) {
    //check if incoming character is contained in each age
    let total = value.end - value.start;
    if ((value.start >= timelineData[i].date && value.start <= timelineData[i + 1].date - 1) || (timelineData[i].date >= value.start && timelineData[i + 1].date - 1 <= value.end) || (value.end >= timelineData[i].date && value.end <= timelineData[i + 1].date - 1)) {
      if (value.era === "unknown") {
        value.era = "";
        value.era += timelineData[i].era;
      } else {
        value.era += ", " + timelineData[i].era;
      }
    }
  }

  if ((value.start >= timelineData[timelineData.length - 1].date) || (value.end >= timelineData[timelineData.length - 1].date)) {
    if (value.era === "unknown") {
      value.era = "";
      value.era += timelineData[timelineData.length - 1].era;
    } else {
      value.era += ", " + timelineData[timelineData.length - 1].era;
    }
  }
  return value.era;
}

ViteExpress.listen( app, 3000 )