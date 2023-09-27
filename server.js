import express from "express"
import ViteExpress from "vite-express"

const app = express();
const port = 3000;

ViteExpress.listen(app, 3000);