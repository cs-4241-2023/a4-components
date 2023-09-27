import express from "express"
import ViteExpress from "vite-express"

const app = express();
const port = 3000;

app.use(express.json());

app.post("/submit-assignment", (request, response) => {
    let assignment = request.body;
    console.log(assignment);
    response.writeHead(200,{"Content-Type" : "application/json"});
    response.end(JSON.stringify({result: "success"}));
});


ViteExpress.listen(app, 3000);