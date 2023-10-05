const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you're testing this on your local machine.
      // However, Glitch will install it automatically by looking in your package.json
      // file.
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000



let appdata = []

const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )    
  }else if( request.method === 'POST' ){
    handlePost( request, response ) 
  }
})

//Priority logic

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  } else if(request.url === '/getTodos') { // added this else if
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(appdata));
  } else{
    sendFile( response, filename )
  }
}

const handlePost = function(request, response) {
  let dataString = '';

  request.on('data', function(data) {
    dataString += data;
  });

  request.on('end', function() {
    console.log('hello3')
    console.log(request)
   // console.log(dataString)

    //const receivedData = JSON.parse(dataString);

    // ... do something with the data here!!!
    if(request.url === '/submit') {
      //calculate priority 
      //priorityData = 
      let date = new Date(receivedData.dueDate)
      let today = new Date
      const diff = date - today
      console.log(diff)
      priority = ""
      if(diff < 200000000){
        priority = "HIGH"
      }
      else{
        priority = "LOW"
      }
      receivedData.priority = priority
      //receivedData.push('priority', priority);
      appdata.push(receivedData);
      console.log("Added: ", receivedData.todoinput," Due on: ", receivedData.dueDate);
      response.writeHead(200, "OK", {'Content-Type': 'text/plain'});
      response.end('Data received');
    } 
    else if(request.url === '/delete') {
      const index = appdata.findIndex(item => item.id === receivedData.id);
      if(index !== -1) {
        appdata.splice(index, 1);
        console.log("Deleted id#: ", receivedData.id);
        response.writeHead(200, "OK", {'Content-Type': 'text/plain'});
        response.end('Todo deleted');
      } else {
        console.log("ID not found: ", receivedData.id);
        response.writeHead(400, "Not found", {'Content-Type': 'text/plain'});
        response.end('ID not found');
      }
    }
  });
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
