import express from "express";
import ViteExpress from "vite-express";

const app = express();
let appdata=[]

app.get("/display", (req, res) => {
  res.json(appdata);
});

app.post("/submit",(req,res)=>{
  appdata.push(req.body)
  
  res.json(appdata)
})
ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000...")
);
