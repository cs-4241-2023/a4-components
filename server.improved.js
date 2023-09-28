const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you're testing this on your local machine.
      // However, Glitch will install it automatically by looking in your package.json
      // file.
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

const appdata = [
  {'yourname': 'Justin', 'username': 'Sombero', 'email': 'jwonoski2@wpi.edu', 'position': 'DPS'},
  {'yourname': 'Mason', 'username': 'Sneke', 'email': 'mSneke@wpi.edu', 'position': 'Support'},
  {'yourname': 'Tim', 'username': 'Robo', 'email': 'tRobo@wpi.edu', 'position': 'Tank'} 
]

const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )    
  }else if( request.method === 'POST' ){
    handlePost( request, response ) 
  }
  else if( request.method === 'DELETE' ){
    handleDelete( request, response ) 
  }
})

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  }  else if( request.url === '/get' ) {
    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    response.end(JSON.stringify(appdata))
  }
  else{
    sendFile( response, filename )
  }

}

const handlePost = function( request, response ) {
  let dataString = ''

  if( request.url === '/delete' ) {
    request.on( 'data', function( data ) {
      dataString += data
      
      console.log(JSON.parse( dataString ))
      //This deserves to be pee. Don't debate with me.
      const pee = JSON.parse( dataString )  
      const num = Number(pee.index)
      console.log(num)
        appdata.splice(num, 1)
    })

    request.on( 'end', function() {
      response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
      response.end('test')
    })
  }  
  // Implementation for Edit: If I got time. 
  else if( request.url === '/edit' ) {
    //Implement edit function here.
    request.on( 'data', function( data ) {
      //Data.playerData is being sent from main.js 
      dataString += data //Adding data to assembly code to make it a string.
      const playerinfo = JSON.parse(dataString)
      const index = playerinfo.index
      console.log(dataString)
      console.log(JSON.parse(dataString))
        appdata[index] = playerinfo.playerdata
    })

    request.on( 'end', function() {
      response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
      response.end('test')
    })
  }
  else {
    request.on( 'data', function( data ) {
      dataString += data 
      console.log(dataString)
  })

    request.on( 'end', function() {
    console.log( JSON.parse( dataString ) )

    // ... do something with the data here!!!
    appdata.push( JSON.parse( dataString ) )
    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    response.end('test')
  })
  }

}



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

server.listen( process.env.PORT || port )
