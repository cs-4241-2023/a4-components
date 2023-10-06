import express from "express";
import { MongoClient } from "mongodb"; // Import MongoClient from the mongodb package
import ViteExpress from "vite-express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const uri =
  "mongodb+srv://aszadaphiya:aarsh@a3-aarshzadaphiya.rnuxw22.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
let collection = null;
let userData = null;

const dbConnect = async function () {
  try {
    await client.connect();
    collection = client.db("a3").collection("bmiData");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

//should fetch data at every successful login
    app.get("/docs", async (req, res) => {
      if (collection !== null) {
        const query = { $and: [{ }] };
        const docs = await collection.find(query).toArray();
        userData = docs; //keep track of user data
        res.json(docs);
      }
    });

  app.post("/submit", async (req, res) => {
      try {
        // Extract data from the request body
        //we assume that a user already exists in the database
        const { height, weight, age, gender } = req.body;
        const bmi = calculateBMI(height, weight, age, gender);
        req.body.bmi = bmi;
        let result = await collection.insertOne(req.body);
        userData.push(req.body);
        res.json(userData);
      } catch (error) {
        console.error("Error:", error);
        res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }
    });

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
