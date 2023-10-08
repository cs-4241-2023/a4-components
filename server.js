const express = require("express"),
  mongodb = require("mongodb"),
  helmet = require("helmet"),
  ObjectID = mongodb.ObjectId,
  app = express();

require("dotenv").config();

app.use(express.static("./views/"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

const requestLogger = (request, response, next) => {
  console.log(`${request.method} url: ${request.url}`);
  next();
};

app.use(requestLogger);

// #region Mongodb
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`;
const client = new mongodb.MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
let userID;
const db = client.db(process.env.DB);
let userCollection = db.collection(process.env.DB_USERS);
let taskCollection = db.collection(process.env.DB_TASKS);

app.post("/login", async (req, res) => {
  userID = await checkLoginInfo(req, res);

  if (userID !== null) {
    res.redirect("content.html");
  } else {
    res.redirect("loginfail.html");
  }
});

app.post("/createAccount", async (req, res) => {
  console.log("Create Account");
  userID = await checkCreateAccount(req, res);

  if (userID !== null && userID !== undefined) {
    res.redirect("content.html");
  } else {
    res.sendFile(__dirname + "/views/signupfail.html");
  }
});

const checkCreateAccount = async (req) => {
  let info = await userCollection.findOne({ username: req.body.Username });
  if (info === null || info === undefined) {
    let acc = { username: req.body.Username, password: req.body.Password };
    return await userCollection.insertOne(acc);
  } else {
    return null;
  }
};

const checkLoginInfo = async (req, res) => {
  let password = req.body.Password;
  let invalidInput = req.body.Username === null && password === null;
  if (!invalidInput) {
    console.log(req.body.Username + " " + req.body.Password);
    let info = await userCollection.findOne({ username: req.body.Username });
    if (info !== null) {
      if (password === info.password) {
        return info._id;
      } else {
        console.log("Incorrect Password");
        res.sendFile(__dirname + "/views/signup.html");
        return null;
      }
    } else {
      console.log("No Account Found");
      return null;
    }
  }
};

//Load Table
app.get("/loadTasks", async (req, res) => {
  if (userID !== null) {
    if (userID.toString() === process.env.USER) {
      taskCollection
        .find()
        .toArray()
        .then((result) => {
          res.json(result);
        });
    } else {
      taskCollection
        .find({ userID: userID })
        .toArray()
        .then((result) => {
          res.json(result);
        });
    }
  }
});

app.post("/submit", express.json(), async (req, res) => {
  if (userID !== process.env.ADMIN_ACCOUNT_ID) {
    let info = req.body;
    await taskCollection.insertOne({
      userID: userID,
      task: info.task,
      duedate: info.duedate,
    });
  }
  res.end();
});

app.post("/update", express.json(), async (req, res) => {
  let id = JSON.parse(req.body._id);
  await taskCollection.updateOne(
    { _id: new ObjectID(id) },
    { $set: { task: req.body.task, duedate: req.body.duedate } }
  );
  res.redirect("content.html");
});

app.post("/delete", express.json(), async (req, res) => {
  let id = JSON.parse(req.body._id);
  await taskCollection.deleteOne({ _id: new ObjectID(id) });
  res.redirect("content.html");
});

app.listen(3000);