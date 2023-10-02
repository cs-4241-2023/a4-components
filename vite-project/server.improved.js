import express from "express";
import ViteExpress from "vite-express";

const app = express();


const appdata = [
  {'yourname': 'Justin', 'username': 'Sombero', 'email': 'jwonoski2@wpi.edu', 'position': 'DPS'},
  {'yourname': 'Mason', 'username': 'Sneke', 'email': 'mSneke@wpi.edu', 'position': 'Support'},
  {'yourname': 'Tim', 'username': 'Robo', 'email': 'tRobo@wpi.edu', 'position': 'Tank'} 
]

// const headers = {
//   'Access-Control-Allow-Origin': '*',  
//   'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, DELETE, SUBMIT, EDIT',
//   'Access-Control-Allow-Headers': 'Content-Type',
// };

// const server = http.createServer( function( request,response ) {
//   if (request.method === 'OPTIONS') {
//     response.writeHead(204, headers);
//     response.end();
//     return;
//   }
//   if( request.method === 'GET' ) {
//     handleGet( request, response )    
//   }else if( request.method === 'POST' ){
//     handlePost( request, response ) 
//   } else if( request.method === 'DELETE' ){
//   handlePost( request, response )
// } else if (request.method === 'EDIT'){
//   handlePost( request, response )
// }
// })



app.get( '/get', ( req, res ) => {
  res.status( 200 ).json(appdata)
})

app.post( '/submit', ( req, res ) => {
  // our request object now has a 'json' field in it from our previous middleware
  console.log( req.body )
  appdata.push( req.body )  
  res.writeHead( 200, { 'Content-Type': 'application/json'})
  res.end( req.json )
})

app.delete( '/delete', ( req, res ) => {
    const pee = req.body
    const num = Number(pee.index)
    console.log(num)
      appdata.splice(num, 1)
  res.status( 200 ).json(appdata)
})

app.put( '/edit', ( req, res ) => {
  const playerinfo = req.body
  const index = playerinfo.index
    appdata[index] = playerinfo.playerdata
  res.status( 200 ).json(appdata)
});

// const handlePost = function( request, response ) {
//   let dataString = ''

//   if( request.url === '/delete' ) {
//     request.on( 'data', function( data ) {
//       dataString += data
      
//       console.log(JSON.parse( dataString ))
//       //This deserves to be pee. Don't debate with me‹.
//       const pee = JSON.parse( dataString )  
//       const num = Number(pee.index)
//       console.log(num)
//         appdata.splice(num, 1)
//     })

//     request.on( 'end', function() {
//       response.writeHead( 200, "OK", {...headers, 'Content-Type': 'text/plain' })
//       response.end('test')
//     })
//   }  
//   // Implementation for Edit: If I got time. 
//   else if( request.url === '/edit' ) {
//     //Implement edit function here.
//     request.on( 'data', function( data ) {
//       //Data.playerData is being sent from main.js 
//       dataString += data //Adding data to assembly code to make it a string.
//       const playerinfo = JSON.parse(dataString)
//       const index = playerinfo.index
//       console.log(dataString)
//       console.log(JSON.parse(dataString))
//         appdata[index] = playerinfo.playerdata
//     })

//     request.on( 'end', function() {
//       response.writeHead( 200, "OK", {...headers, 'Content-Type': 'text/plain' })
//       response.end('test')
//     })
//   }
//   else {
//     request.on( 'data', function( data ) {
//       dataString += data 
//       console.log(dataString)
//   })

//     request.on( 'end', function() {
//     console.log( JSON.parse( dataString ) )

//     // ... do something with the data here!!!
//     appdata.push( JSON.parse( dataString ) )
//     response.writeHead( 200, "OK", {...headers, 'Content-Type': 'text/plain' })
//     response.end('test')
//   })
//   }

// }

// const sendFile = function( response, filename ) {
//    const type = mime.getType( filename ) 

//    fs.readFile( filename, function( err, content ) {

//      // if the error = null, then we've loaded the file successfully
//      if( err === null ) {

//        // status code: https://httpstatuses.com
//        response.writeHeader( 200, { 'Content-Type': type })
//        response.end( content )

//      }else{

//        // file not found, error code 404
//        response.writeHeader( 404 )
//        response.end( '404 Error: File Not Found' )

//      }
//    })
// }

const server = app.listen(3000, "0.0.0.0", () => console.log("Server is listening..."));
ViteExpress.bind(app, server);
