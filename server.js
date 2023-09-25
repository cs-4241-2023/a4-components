const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

require('dotenv').config();
const mongoDBPASSW = process.env.MONGOPASSW;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://msgarbaczonek:"+mongoDBPASSW+"@a3.zqvh72t.mongodb.net/?retryWrites=true&w=majority";

let appdata = [
  { TaskName: "Task 1", DueDate: "09/12/2023", Priority: 1, MyDay: true },
  { TaskName: "Task 2", DueDate: "09/12/2023", Priority: 1, MyDay: true },
]

function requestLog(req, res, next) {
  console.log(`Request: ${req.method}, ${req.url}`);
  next();
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.use(bodyParser.json());
app.use(requestLog);

app.post( '/submit', async ( req, res ) => {
  const json = req.body

  try {
    await client.connect();

    const db = client.db('A3'); 
    const collection = db.collection('AppData'); 
    let result;
  
    switch (json.type) {
      case "addTask":
        const newTaskData = json.taskData;
        result = await collection.insertOne(newTaskData);
        break;
      case "deleteTask":
        result = await collection.deleteOne({ _id: new ObjectId(json.deleteRow) });
        break;
      case "updateTask":
        result = await collection.replaceOne({ _id: new ObjectId(json.id) }, json.taskData );
        break;
    }

  } catch (error) {
    console.error('Error inserting data:', error);
  } finally {
    await client.close();
  }

  res.writeHead( 200, { 'Content-Type': 'application/json'})
  res.end( req.json )
})

app.get('/css/main.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'css', 'main.css'));
});

app.get('/js/main.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'js', 'main.js'));
});

app.get('/appdata', async (req, res) => {
  let documents;
  try {
    await client.connect();
    const db = client.db('A3');
    const collection = db.collection('AppData');
    documents = await collection.find().toArray();
  } finally {
    await client.close();
  }
  res.json(documents);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

function errorHandler(err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
}

app.use(errorHandler);

const listener = app.listen( process.env.PORT || 3000 )











// const express = require('express');
// const app = express();
// const path = require('path');
// const bodyParser = require('body-parser');

// require('dotenv').config();
// const mongoDBPASSW = process.env.MONGOPASSW;
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const uri = "mongodb+srv://msgarbaczonek:"+mongoDBPASSW+"@a3.zqvh72t.mongodb.net/?retryWrites=true&w=majority";
// const passport = require('passport');
// const GitHubStrategy = require('passport-github2').Strategy;
// const mongoose = require('mongoose');
// const session = require('express-session');


// mongoose.connect(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const db = mongoose.connection;

// app.use(session({
//   secret: process.env.SESSECRET,
//   resave: false,
//   saveUninitialized: true,
// }));

// app.use(passport.initialize());



// let appdata = [
//   { TaskName: "Task 1", DueDate: "09/12/2023", Priority: 1, MyDay: true },
//   { TaskName: "Task 2", DueDate: "09/12/2023", Priority: 1, MyDay: true },
// ]

// function requestLog(req, res, next) {
//   console.log(`Request: ${req.method}, ${req.url}`);
//   next();
// }

// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// app.use(bodyParser.json());
// app.use(requestLog);

// app.post( '/submit', async ( req, res ) => {
//   const json = req.body

//   try {
//     await client.connect();

//     const db = client.db('A3'); 
//     const collection = db.collection('AppData'); 
//     let result;
  
//     switch (json.type) {
//       case "addTask":
//         const newTaskData = json.taskData;
//         result = await collection.insertOne(newTaskData);
//         break;
//       case "deleteTask":
//         result = await collection.deleteOne({ _id: new ObjectId(json.deleteRow) });
//         break;
//       case "updateTask":
//         result = await collection.replaceOne({ _id: new ObjectId(json.id) }, json.taskData );
//         break;
//     }

//   } catch (error) {
//     console.error('Error inserting data:', error);
//   } finally {
//     await client.close();
//   }

//   res.writeHead( 200, { 'Content-Type': 'application/json'})
//   res.end( req.json )
// })

// app.get('/css/main.css', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'css', 'main.css'));
// });

// app.get('/js/main.js', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'js', 'main.js'));
// });

// app.get('/appdata', async (req, res) => {
//   let documents;
//   try {
//     await client.connect();
//     const db = client.db('A3');
//     const collection = db.collection('AppData');
//     documents = await collection.find().toArray();
//   } finally {
//     await client.close();
//   }
//   res.json(documents);
// });


// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
//   res.render('login', { user: req.user });
// });

// function errorHandler(err, req, res, next) {
//   console.error(err.stack)
//   res.status(500).send('Something broke!')
// }

// app.use(errorHandler);




// // passport.use(new GitHubStrategy({
// //   clientID: process.env.CLIENT_ID,
// //   clientSecret: process.env.CLIENT_SECRET,
// //   callbackURL: process.env.CALLBACK
// // },
// // function(accessToken, refreshToken, profile, done) {
// //   User.findOrCreate({ githubId: profile.id }, function (err, user) {
// //     return done(err, user);
// //   });
// // }
// // ));

// // app.get('/auth/github', passport.authenticate('github', { scope: [ 'user:email' ] }));
// // app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }),
// // function(req, res) {
// //   res.redirect('/');
// // });



// const userSchema = new mongoose.Schema({
//   githubId: String,
//   githubUsername: String
// });
// const User = mongoose.model('User', userSchema);
// module.exports = User;

// passport.use(new GitHubStrategy({
//   clientID: process.env.CLIENT_ID,
//   clientSecret: process.env.CLIENT_SECRET,
//   callbackURL: process.env.CALLBACK
// }, async (accessToken, refreshToken, profile, done) => {
//   try {
//     // console.log(profile.id);
//     // console.log(profile.username);
//     // const allUsers = await User.find();
//     // console.log('All Users:', allUsers);
//     let user = await User.findOne({ githubId: profile.id });

//     if (!user) {
//       user = new User({
//         githubId: profile.id,
//         githubUsername: profile.username,
//       });

//       await user.save();
//     }
//     return done(null, user);
//   } catch (err) {
//     return done(err);
//   }
// }));

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//   User.findById(id, (err, user) => {
//     done(err, user);
//   });
// });

// app.get('/auth/github', passport.authenticate('github', { scope: [ 'user:email' ] }));
// app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }),
// function(req, res) {
//   console.log('Authenticated user:', req.user);
//   res.redirect('/');
// });


// // User.deleteMany({}, (err) => {
// //   if (err) {
// //     console.error('Error deleting users:', err);
// //   } else {
// //     console.log('All users have been removed.');
// //   }

// //   // Close the database connection
// //   mongoose.connection.close();
// // });show

// const listener = app.listen( process.env.PORT || 3000 )