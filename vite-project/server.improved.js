import express from "express";
import ViteExpress from "vite-express";
import cors from "cors";

const app = express();

app.use(cors())
app.use(express.json())

let port = 3000;


const appdata = [
  {'yourname': 'Justin', 'username': 'Sombero', 'email': 'jwonoski2@wpi.edu', 'position': 'DPS'},
  {'yourname': 'Mason', 'username': 'Sneke', 'email': 'mSneke@wpi.edu', 'position': 'Support'},
  {'yourname': 'Tim', 'username': 'Robo', 'email': 'tRobo@wpi.edu', 'position': 'Tank'} 
]

app.get( '/get', ( req, res ) => {
  console.log( 'get request received' )
  res.status( 200 ).json(appdata)
})

app.post( '/submit', ( req, res ) => {
  // our request object now has a 'json' field in it from our previous middleware
  console.log( req.body )
  appdata.push( req.body )  
  res.writeHead( 200, { 'Content-Type': 'application/json'})
  res.end( req.json )
})

app.post( '/delete', ( req, res ) => {
    const pee = req.body
    const num = Number(pee.index)
    console.log(num)
      appdata.splice(num, 1)
  res.status( 200 ).json(appdata)
})

app.post( '/edit', ( req, res ) => {
  const playerinfo = req.body
  const index = playerinfo.index
    appdata[index] = playerinfo.playerdata
  res.status( 200 ).json(appdata)
});

ViteExpress.listen(app, port, () => console.log("Server is listening..."));
