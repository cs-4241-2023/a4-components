import express from "express";
import { MongoClient } from "mongodb"; // Import MongoClient from the mongodb package
import ViteExpress from "vite-express";
import cors from "cors";
import bcrypt from "bcrypt";

const app = express();
app.use(express.json());
app.use(cors());

const uri =
  "mongodb+srv://aszadaphiya:aarsh@a3-aarshzadaphiya.rnuxw22.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
let collection = null;
let username = null;
let password = null;
let userData = null;

const dbConnect = async function () {
  try {
    await client.connect();
    collection = client.db("a3").collection("Users");

    //should fetch data at every successful login
    app.get("/docs", async (req, res) => {
      if (collection !== null) {
        const query = { $and: [{ username: username, password: password }] };
        const docs = await collection.find(query).toArray();
        userData = docs; //keep track of user data
        res.json(docs);
      }
    });

    app.post("/login", async (req, res) => {
      try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        username = req.body.username;
        password = req.body.password;
        //const password = hashedPassword;
        console.log(req.body);
        const query = { $and: [{ username: username, password: password }] };
        const user = await collection.findOne(query);

        if (user !== null) {
          res.sendFile(__dirname + "/public/bmi.html");
        } else {
          res.sendFile(__dirname + "/public/index.html");
        }
      } catch {
        res.status(500).send();
      }
    });

    app.post("/delete", async (req, res) => {
      userData[0]["data"].splice(req.body.id, 1);
      const query = { $and: [{ username: username, password: password }] };
      let result = await collection.replaceOne(query, userData[0]);
      res.json(userData);
    });

    app.post("/edit", async (req, res) => {
      const { id, height, weight, age, gender } = req.body;
      const bmi = calculateBMI(height, weight, age, gender);
      const oldDate = userData[0]["data"][id].date;
      userData[0]["data"][id] = {
        date: oldDate,
        height: req.body.height,
        weight: req.body.weight,
        age: req.body.age,
        gender: req.body.gender,
        bmi: bmi,
      };
      const query = { $and: [{ username: username, password: password }] };
      let result = await collection.replaceOne(query, userData[0]);
      res.json(userData);
    });

    app.post("/submit", async (req, res) => {
      try {
        // Extract data from the request body
        //we assume that a user already exists in the database
        const { height, weight, age, gender } = req.body;
        const bmi = calculateBMI(height, weight, age, gender);

        //Get the array in the JSON and push the new data
        userData[0]["data"].push({
          date: new Date().toLocaleDateString(),
          height: height,
          weight: weight,
          age: age,
          gender: gender,
          bmi: bmi,
        });

        const query = { $and: [{ username: username, password: password }] };
        let result = await collection.replaceOne(query, userData[0]);
        res.json(userData);
      } catch (error) {
        console.error("Error:", error);
        res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }
    });

  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

function calculateBMI(height, weight, age, gender) {
  let bmi;
  if (gender === "male") {
    bmi = (0.74 * weight) / (((height / 100) * height) / 100);
    bmi += 0.063 * age - 3.3;
  } else if (gender === "female") {
    bmi = (0.74 * weight) / (height * height);
    bmi += 0.063 * age + 5.1;
  } else {
    throw new Error("Invalid gender");
  }

  return parseFloat(bmi.toFixed(2));
}

dbConnect();

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000...")
);
