import express from 'express';
import cors from 'cors';
import mime from 'mime';
import http from 'http';
import fs from 'fs';

const appdata = []
const app = express();

var corsOptions = {
  //origin: "http://127.0.0.1:3002"
  origin: "*"
};

app.use(cors(corsOptions));
app.use(express.static('public')); 

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


// simple route
app.get('/', (request, response) => {
    dir = 'public/'
    const filename = dir + request.url.slice( 1 ) 
  
    if( request.url === '/' ) {
        console.log("Returning index.html");
      sendFile( response, 'public/index.html' )
    }
    else {
      sendFile( response, filename )
    }
});

app.get('/results', (request, response) => {
  const jsonContent = JSON.stringify(appdata);
  response.send(jsonContent)
});

app.post('/submit', (request, response ) => {
    const myData = request.body
    if (myData.action === 'create') {
        //addToMemory()
        let Element = {}
        let name = myData.name
        let attack = myData.attack
        let defense = myData.defense
        let speed = myData.speed
        let trueatk = parseInt(attack)
        let truedef = parseInt(defense)
        let truespd = parseInt(speed)
        Element.name = name
        Element.attack = attack
        Element.defense = defense
        Element.speed = speed
        let avg     = (trueatk + truedef + truespd)/3
        avg  = Math.trunc(avg * Math.pow(10, 2))/Math.pow(10, 2)
        Element.average = avg
  
        let recommended = 'Fighter'
        if ((attack === defense) && (attack != speed)) {
            recommended = 'Paladin'
        }
        if ((attack === speed) && (attack != defense)) {
            recommended = 'Ranger'
        }
        if ((defense === speed) && (attack != defense)) {
            recommended = 'Monk'
        }
        if ((truedef > trueatk) && (truedef > truespd)) {
            recommended = 'Tank'
        }
        if ((trueatk > truespd) && (trueatk > truedef)) {
            recommended = 'Barbarian'
        }
        if ((truespd > trueatk) && (truespd > truedef)) {
            recommended = 'Rogue'
        } 
        Element.recommended = recommended     
        for (let i = 0; i < appdata.length; i++) {
          if (appdata[i].name === myData.name) {
            appdata.splice(i,1)
          }
        }
        appdata.push(Element)
    }
    if (myData.action === 'delete') {
        for (let i = 0; i < appdata.length; i++) {
            if (appdata[i].name === myData.name) {
                console.log(i)
                appdata.splice(i,1)
            }
          }
    }
    if (myData.action === 'modify') {
        //appdata.
    }
    const jsonContent = JSON.stringify(appdata);
    response.send(jsonContent)
  });

const sendFile = function( response, filename ) {
    const type = mime.getType( filename ) 
 
    fs.readFile( filename, function( err, content ) {
 
      // if the error = null, then we've loaded the file successfully
      if( err === null ) {
 
        // status code: https://httpstatuses.com
        response.writeHeader( 200, { 'Content-Type': type })
        response.end( content )
 
      }else{
 
        // file not found, error code 404
        response.writeHeader( 404 )
        response.end( '404 Error: File Not Found' )
 
      }
    })
 }

// set port, listen for requests
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});