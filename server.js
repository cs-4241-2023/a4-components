//e.g server.js
import express from "express";
import ViteExpress from "vite-express";

// require('dotenv').config()
import bcrypt from "bcrypt"
// const bcrypt = require('bcrypt');
import util from "util"
// const util = require('util');
const hashAsync = util.promisify(bcrypt.hash);
// const express    = require('express'),

// const { MongoClient } = require("mongodb"),
import {MongoClient} from "mongodb"
const app        = express()
let currentUser = 'test'
const saltRounds = 10;


app.use( express.static( 'public' ) )
app.use( express.static( 'views'  ) )
app.use( express.json() )
app.use(express.urlencoded());
app.use( (req,res,next) => {
  if( PlayerCollection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})

// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

const uri = `mongodb+srv://rbdyer3:pass@cluster0.h1jga56.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient( uri )
let PlayerCollection = null
let userCollection = null

/* Function to connect to databases */
async function run() {
  console.log('in run')
  //connect to client
  await client.connect()
  userCollection = await client.db("Login").collection("user")
  PlayerCollection = await client.db("2kRating").collection("rating")


// Handle login POST request
app.post('/playerRating.html', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log('username and password: ', username, password);

  try {
    // Check if the user exists in the database
    const user = await userCollection.find({ username: username }).toArray();
    console.log(user);

    if (user.length === 0) {
      console.log("add user");

      // Use async/await with bcrypt.hash
      const hash = await hashAsync(password, saltRounds);

      // Store hash in your password DB.
      const userToAdd = await userCollection.insertOne({ username: username, password: hash });
    }

    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user[0].password);

    if (passwordMatch) {
      console.log('password correct');
      currentUser = username;
      const absoluteFilePath = __dirname + '/public/playerRating.html';
      console.log(absoluteFilePath);
      console.log(req.path);
      res.sendFile(absoluteFilePath, (err) => {
        if (err) {
          console.error('Error sending file:', err);
          res.status(500).send('Internal Server Error');
        }
      });
    } else {
      console.log('password incorrect');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});
  // route to get all docs
  app.get("/get", async (req, res) => {
    if (PlayerCollection !== null) {
      const docs = await PlayerCollection.find(
        {user: currentUser}
      ).toArray()
      console.log(docs)
      // res.json( docs )
      res.json({test: "test"})
    }
   })
   // add player to database
   app.post( '/add', async (req,res) => {
    const reqPlayer = req.body.newPlayer;
    reqPlayer.rating = calculateOverallRating(reqPlayer.outside,reqPlayer.inside,reqPlayer.athleticism,reqPlayer.playmaking,reqPlayer.defense)
    reqPlayer.user = currentUser
    const result = await PlayerCollection.insertOne( reqPlayer )
    const docs = await PlayerCollection.find(
      {user: currentUser}
    ).toArray()
    res.json( docs )
  }) 
  //delete player from database
  // assumes req.body takes form { _id:5d91fb30f3f81b282d7be0dd } etc.
  app.post( '/remove', async (req,res) => {
    const playerName = req.body.name
    const result = await PlayerCollection.deleteOne({ 
      name: playerName
    })
    const docs = await PlayerCollection.find(
      {user: currentUser}
    ).toArray()
    res.json( docs )
  })
  //update user in the database
  app.post( '/update', async (req,res) => {
    const reqPlayer = req.body.newPlayer;
    reqPlayer.rating = calculateOverallRating(reqPlayer.outside,reqPlayer.inside,reqPlayer.athleticism,reqPlayer.playmaking,reqPlayer.defense)
    const result = await PlayerCollection.updateOne(
      { name: reqPlayer.name },
      { 
        $set: { 'outside': reqPlayer.outside,
        'inside': reqPlayer.inside,
        'athleticism': reqPlayer.athleticism,
        'playmaking': reqPlayer.playmaking,
        'defense': reqPlayer.defense,
        'rating': reqPlayer.rating,
     }
    }
    )
    console.log(reqPlayer.name)
    const docs = await PlayerCollection.find({
      user: currentUser
    }).toArray()
    res.json( docs )
  })

}
/* connect to database */
run()


// app.get( '/get', async (req,res) => {
//   const result = await collection.updateOne(
//     { _id:MongoClient.ObjectId( req.body._id ) },
//     { $set:{ name:req.body.name } }
//   )

//   res.json( result )
// })





// app.delete('/delete', (req, res) => {
//   const playerToDelete = req.body.name;
//   // Use the correct filter function to remove the player with the specified name
//   nbaPlayerData = nbaPlayerData.filter((player) => player.name !== playerToDelete);
//   res.status(200).json(nbaPlayerData);
// });
// app.get('/get', (req, res) => {
//   try {
//     res.status(200).json(nbaPlayerData);
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });




let nbaPlayerData = [
  {
    "name": "LeBron James",
    "outside": 88,
    "inside": 90,
    "athleticism": 92,
    "playmaking": 96,
    "defense": 85,
    "rating": 90
  },
  {
    "name": "Stephen Curry",
    "outside": 98,
    "inside": 75,
    "athleticism": 88,
    "playmaking": 92,
    "defense": 70,
    "rating": 85
  },
  {
    "name": "Giannis Antetokounmpo",
    "outside": 78,
    "inside": 95,
    "athleticism": 97,
    "playmaking": 84,
    "defense": 90,
    "rating": 89
  },
  {
    "name": "Kevin Durant",
    "outside": 95,
    "inside": 88,
    "athleticism": 90,
    "playmaking": 85,
    "defense": 82,
    "rating": 88
  },
  {
    "name": "Kawhi Leonard",
    "outside": 88,
    "inside": 80,
    "athleticism": 92,
    "playmaking": 75,
    "defense": 95,
    "rating": 86
  },
  {
    "name": "Luka Dončić",
    "outside": 90,
    "inside": 85,
    "athleticism": 86,
    "playmaking": 94,
    "defense": 78,
    "rating": 86
  },
  {
    "name": "Anthony Davis",
    "outside": 75,
    "inside": 92,
    "athleticism": 89,
    "playmaking": 72,
    "defense": 96,
    "rating": 85
  },
  {
    "name": "James Harden",
    "outside": 96,
    "inside": 85,
    "athleticism": 84,
    "playmaking": 93,
    "defense": 72,
    "rating": 86
  },
  {
    "name": "Joel Embiid",
    "outside": 72,
    "inside": 95,
    "athleticism": 87,
    "playmaking": 70,
    "defense": 89,
    "rating": 83
  },
  {
    "name": "Damian Lillard",
    "outside": 97,
    "inside": 75,
    "athleticism": 86,
    "playmaking": 90,
    "defense": 68,
    "rating": 83
  },
  {
    "name": "Jimmy Butler",
    "outside": 84,
    "inside": 88,
    "athleticism": 86,
    "playmaking": 82,
    "defense": 90,
    "rating": 86
  },
  {
    "name": "Karl-Anthony Towns",
    "outside": 80,
    "inside": 85,
    "athleticism": 84,
    "playmaking": 72,
    "defense": 78,
    "rating": 80
  },
  {
    "name": "Devin Booker",
    "outside": 92,
    "inside": 78,
    "athleticism": 86,
    "playmaking": 80,
    "defense": 70,
    "rating": 81
  },
  {
    "name": "Rudy Gobert",
    "outside": 45,
    "inside": 88,
    "athleticism": 80,
    "playmaking": 55,
    "defense": 96,
    "rating": 73
  },
  {
    "name": "Chris Paul",
    "outside": 87,
    "inside": 70,
    "athleticism": 82,
    "playmaking": 95,
    "defense": 76,
    "rating": 82
  },
 

];

function calculateOverallRating(outsideScoring, insideScoring, athleticism, playmaking, defending) {
  // Check if the input ratings are within the valid range (0-99)
  if (
    outsideScoring < 0 || outsideScoring > 99 ||
    insideScoring < 0 || insideScoring > 99 ||
    athleticism < 0 || athleticism > 99 ||
    playmaking < 0 || playmaking > 99 ||
    defending < 0 || defending > 99
  ) {
    throw new Error('All ratings must be between 0 and 99.');
  }

  // Weighted average of the ratings with arbitrary weights
  const overallRating = (
    outsideScoring * 0.2 +
    insideScoring * 0.25 +
    athleticism * 0.15 +
    playmaking * 0.3 +
    defending * 0.1
  );

  // Round the overall rating to the nearest integer
  return Math.round(overallRating);
}



ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));