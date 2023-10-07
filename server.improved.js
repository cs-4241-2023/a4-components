import express from "express";
import ViteExpress from "vite-express";
import cors from "cors";
import { duration } from "./utils/helpers.js";

const app = express();

app.use(cors());

// logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} request for ${req.url}`);
  next();
});

// parses JSON bodies
app.use(express.json());

ViteExpress.listen(app, 3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});
