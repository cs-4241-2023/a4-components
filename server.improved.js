const http = require("http"),
  express = require('express'),
  dotenv = require('dotenv');
  app = express(),
  path = require('path'),
  dir = "public/",
  port = 3000;

dotenv.config();

const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectID = require('mongodb').ObjectId

//const uri = `mongodb+srv://TestUser:Oe1wY0NZGom47CB5@cluster0.ffqniuy.mongodb.net/?retryWrites=true&w=majority`;
const uri = `mongodb+srv://TestUser:${process.env.PASSWORD}@cluster0.ffqniuy.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

var loggedInUser = null
var editUser = null

app.get('/getUsers', (request, response) => {
    client.connect();
    var db = client.db('usersDB');
    var coll = db.collection('users');
    if (loggedInUser.dept === 'All'){
      coll.find().toArray().then( result => {
        response.json( result )
      } )
    }else{
      coll.find({'dept': loggedInUser.dept}).toArray().then( result => {
        response.json( result )
      } )
    }

})

app.get('/getLoggedInUser', (request, response) => {
    response.json( loggedInUser )
})
app.get('/getEditUser', (request, response) => {
  response.json( editUser )
})
app.get('/', (request, response) => {
  handleGet(request, response)
})
// app.get('/index', (request, response) => {
//   sendFile(response, "public/index.html");
// })
app.post('/newUser', (request, response) => {
  handlePost(request, response)
})

app.post( '/login', async (request, response) => {
    // let invalidInput = req.body.Username === null && password === null;
    // if(!invalidInput){
    let dataString = "";

    request.on("data", function (data) {
      dataString += data;
    });
    request.on("end", async function () {
      const json = JSON.parse(dataString);
      let email = json.email
      let pass = json.pass
      var db = client.db('usersDB');
      var coll = db.collection('users');
  
      let admin = await coll.findOne({'email': email});
      if(admin === null){
        console.log("no user found");
      }
      if(pass === admin.pass){
        if (admin.type === 'Systems Admin'){
          loggedInUser = admin
        }else{  
          console.log("user is not an admin");
        }
      }else{
          console.log("wrong pass");
      }
      if(loggedInUser !== null){
          console.log(loggedInUser)
          //response.set('location', '/public/index.html');
          response.redirect('/index.html')
      }
    })
})
app.post( '/edit', async (request, response) => {
  let dataString = "";

  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", function () {
      const json = JSON.parse(dataString);
      console.log(json)
      editUser = json
      response.redirect('/edit.html')
  });
})

app.post( '/update', async (request, response) => {
  console.log('posted!!')
  let dataString = "";

  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", async function () {
    const json = JSON.parse(dataString);
    var db = client.db('usersDB');
    var coll = db.collection('users');
    console.log(json)
    coll.updateOne({"_id": new ObjectID(json._id)},{ $set: {
      "pass": json.pass,
      "type": json.type,
      "dept": json.dept
    }})
    const u = await coll.findOne({"_id": new ObjectID(json._id)});
    console.log(u)
    response.redirect('/edit.html')
  });
})

app.post( '/logout', async (request, response) => {
  loggedInUser = null
  console.log("logged out")
  response.redirect('/login.html')
})

app.delete('/deleteUser', (request, response) => {
  handleDelete(request, response)
})

app.delete('/clearUsers', (request, response) => {
  var db = client.db('usersDB');
  var coll = db.collection('users');
  coll.deleteMany({})
  response.writeHead(200, "OK", { "Content-Type": "text/json" });
  response.end("deleted all users!");
})
const server = http.createServer(app)

const handleGet = function (request, response) {
  const filename = dir + request.url.slice(1);
  if (request.url === "/") {
    sendFile(response, "public/login.html");
  }else{
    sendFile(response, filename);
  }
};

app.use(express.static('public'));

const handlePost = function (request, response) {
  console.log('posted!!')
  let dataString = "";

  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", function () {
    const json = JSON.parse(dataString);
    const email = `${json.name.charAt(0)}${json.email}@wpi.edu`.toLowerCase();
    json["name"] += ` ${json.email}`;
    json["email"] = email;
    var db = client.db('usersDB');
    var coll = db.collection('users');
    coll.insertOne(json);
    response.writeHead(200, "OK", { "Content-Type": "text/json" });
    response.end(JSON.stringify(json));
  });
};

const handleDelete = function (request, response) {
  console.log('deleted!!')
  let dataString = "";
  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", function () {
    let data = JSON.parse(dataString);
    var db = client.db('usersDB');
    var coll = db.collection('users');
    console.log(data)
    coll.deleteOne({"_id" : new ObjectID(data._id)})
    response.writeHead(200, "OK", { "Content-Type": "text/json" });
    response.end("deleted user!");
  });
};

const sendFile = function (response, filename) {
  const options = {
      root: path.join(__dirname)
  };
  
  response.sendFile(filename, options, function (err) {
      if (err) {
          console.log('Error:', err);
      } else {
          console.log('Sent:', filename);
      }
  });
};

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})