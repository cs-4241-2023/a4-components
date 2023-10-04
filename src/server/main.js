import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.js";
import Submission from "../models/hourSubmission.js";
import express from "express";
import session from "express-session";
import ViteExpress from "vite-express";
import passport from "passport";
import GitHubStrategy from "passport-github2";
import "crypto";

// const cookieParser = require("cookie-parser");
const app = express();

app.use(express.static("src/"));
// app.use(ViteExpress.static("/"));
app.use(express.static("./index.html"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({ secret: "keyboard cat", resave: true, saveUninitialized: false })
);

// app.use(cookieParser);

const password = encodeURIComponent(process.env.PASS);

mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USER}:${password}@${process.env.HOST}`
);

passport.serializeUser((user, done) => {
  console.log("SerializeUser:", user);
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    let user = await User.findById(id, "name email _id");
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("GitHub Authentication Successful");
      // console.log(profile); // Log the user profile for debugging
      try {
        const user = await User.findOne({ user_id: profile.id });
        console.log("github user: ", user);
        if (user != null) {
          console.log("found the user");
          return done(null, user);
        } else {
          const newUser = new User({
            email: profile.email,
            name: profile.displayName,
            password: "auto",
            user_id: profile.id,
          });

          const savedUser = await newUser.save();
          console.log("Saved a new user");
          return done(null, savedUser);
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
// GitHub OAuth2 login route
app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

// GitHub OAuth2 callback route
app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/", session: true }),
  async function (req, res) {
    req.session.user = await User.findById(req.session.passport.user._id);
    console.log(req.session);
    res.redirect("/homepage");
  }
);
//__________________________________________________________________________

app.post("/findUser", async function (req, res) {
  console.log("accessing the db");
  // debugger;
  let data = req.body;
  console.log("data: ", data);
  let username = data.username;
  try {
    const user = await User.findOne({ name: username }).exec();
    console.log("user: ", user);

    if (user != null) {
      if (user.password == data.password) {
        console.log("logging in the user");
        req.session.login = true;
        req.session.user = user;
        res.send(JSON.stringify("true"));
      } else {
        console.log("failed to log in due to password");
        res.send(JSON.stringify("false"));
      }
    } else {
      console.log("creating a new user");
      let randNum = crypto.randomBytes(8).toString("hex");
      const newUser = new User({
        email: data.username,
        name: data.username,
        password: data.password,
        user_id: randNum,
      });

      await newUser.save();
      console.log("Saved a new user and logging in");
      req.session.login = true;
      req.session.user = newUser;
      res.send(JSON.stringify("true"));
    }
  } catch (error) {
    res.send(JSON.stringify("false"));
    console.log("Something went wrong");
    console.log(error);
  }
});

app.get("/signout", function (req, res) {
  req.session = null;
  res.redirect("/");
});

app.get("/getData", async (req, res) => {
  const result = await Submission.find({ person: req.session.user._id });
  let body = JSON.stringify(result);
  // console.log("data: ", body);
  res.send(body);
});

app.post("/add", async (req, res) => {
  let data = req.body;
  debugger;
  console.log("addition data: ", data);
  let submission = new Submission({
    date: data.date,
    person: req.session.user._id,
    numHours: data.numHours,
    reason: data.reason,
  });
  await submission.save();
  res.redirect("/getData");
  console.log("saved an entry");
});

app.post("/update", async (req, res) => {
  let data = req.body;
  console.log("edited data: ", data);
  debugger;
  const query = { [`${data.updatedCell}`]: data.newVal };
  await Submission.updateOne({ _id: data.hourID }, query);
  console.log("should have updated");
  res.redirect("/getData");
});

const logger = (req, res, next) => {
  // console.log("url:", req.url);
  next();
};

app.use(logger);
ViteExpress.listen(app, 8080, () => {
  console.log("Listening");
});
