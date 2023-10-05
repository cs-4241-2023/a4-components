import express from  'express'
import ViteExpress from 'vite-express'

//express = require('express')
const app = express()

const todos = []

app.use( express.json() )

//Change this to send the array - res.json( todos )
app.get( '/read', ( req, res ) => {
  res.json( todos )
})

app.post( '/submit', ( req,res ) => {
  todos.push( req.body )
  res.json( todos )
})

app.post( '/delete', function( req,res ) {
  appdata.splice(req.body.index, 1)
  
  res.json( appdata )
})

app.post( '/change', function( req,res ) {
  const idx = todos.findIndex( v => v.name === req.body.name )
  todos[ idx ].completed = req.body.completed
  
  res.sendStatus( 200 )
})

ViteExpress.listen( app, 3000 )

/*const http = require('http'),
  fs = require('fs'),
  mime = require('mime'),
  dir = 'public/',
  port = 3000

let appdata = [
  {
    'course': 'CS4241',
    'assignment': 'A2',
    'dueDate': '2023-09-12',
    'dueTime': '11:59',
    'daysLeft': '0',
  },
]

const server = http.createServer(function (request, response) {
  if (request.method === 'GET') {
    handleGet(request, response)
  } else if (request.method === 'POST') {
    handlePost(request, response)
  }
  else if (request.method === 'DELETE') {
    handleDelete(request, response)
  }
})
const handleGet = function (request, response) {
  const filename = dir + request.url.slice(1)
  if (request.url === '/') {
    sendFile(response, 'public/index.html')
  }
  else if (request.url === '/data') {
    response.writeHeader(200, { "Content-type": "text/json" });
    response.end(JSON.stringify(appdata));
  }
  else {
    sendFile(response, filename)
  }
}
const handlePost = function (request, response) {
  console.log("request URL" + request.url);
  let dataString = ''
  request.on('data', function (data) {
    dataString += data
  })
  request.on('end', function () {
    let postResponse = JSON.parse(dataString);


    let daysLeft = calculateDaysLeft(postResponse.dueDate)
    appdata.push({ course: postResponse.course, assignment: postResponse.assignment, dueDate: postResponse.dueDate, dueTime: postResponse.dueTime, daysLeft: daysLeft })
    response.writeHead(200, "OK", { 'Content-Type': 'text/json' })
    response.end(JSON.stringify(appdata))
  })
}

const handleDelete = function (request, response) {
  let dataString = ''
  request.on('data', function (data) {
    dataString += data
  })
  request.on('end', function () {
    let assignmentToRemove = JSON.parse(dataString).assignmentToRemove
    appdata = appdata.filter(function (n, i) {
      return n.title !== assignmentToRemove;
    })
    response.writeHead(200, "OK", { 'Content-Type': 'text/plain' })
    response.end(JSON.stringify(appdata))
  })
}

const sendFile = function (response, filename) {
  const type = mime.getType(filename)

  fs.readFile(filename, function (err, content) {

    // if the error = null, then we've loaded the file successfully
    if (err === null) {

      // status code: https://httpstatuses.com
      response.writeHeader(200, { 'Content-Type': type })
      response.end(content)

    } else {

      // file not found, error code 404
      response.writeHeader(404)
      response.end('404 Error: File Not Found')

    }
  })
}

const calculateDaysLeft = function (dueDate){
    //2023-09-12
    dueDate= new Date(dueDate)
    console.log(dueDate)
    
    let today = new Date()
    
    let time = dueDate.getTime() - today.getTime()
    console.log(time)
    time= Math.floor(time / (1000 * 3600 * 24))+1 //days
    console.log(time)
    return time
  }


server.listen(process.env.PORT || port)*/