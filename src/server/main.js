const express = require("express");
const ViteExpress = require("vite-express");

const app = express()

let todos = [
  { todo: 'Do CS4241 A2', date: '2023-09-11', urgency: 'Done', completed: true },
  { todo: 'CS4241 Readings', date: '2023-09-07', urgency: 'Late', completed: false },
  { todo: 'Attend Office Hours', date: 'TBD', urgency: 'Not Urgent', completed: false} 
]

app.use( express.json() )

app.get( '/read', ( req, res ) => res.json( todos ) )

app.post( '/add', ( req,res ) => {
  if(req.body.date === ""){
    req.body.date = "TBD";
  }
  todos.push( req.body )
  res.json( todos )
})

app.post( '/change', function( req,res ) {
  const idx = todos.findIndex( v => v.todo === req.body.todo )
  todos[ idx ].completed = req.body.completed
  let boolValue = req.body.completed
  if(boolValue){
    todos[ idx ].urgency = "Done";
  }
  else{
    let urgency = "Not Urgent";
    if(todos[ idx ].date !== "TBD"){
      const currentDate = new Date();
      const targetDate = new Date(todos[ idx ].date);
      const timeDifference = targetDate.getTime() - currentDate.getTime();
      const daysDifference = timeDifference / (1000 * 3600 * 24);
      if(daysDifference < 0){
        urgency = "Late"
      }
      else if(daysDifference <= 7){
        urgency = "Urgent"
      }
    }
    todos[ idx ].urgency = urgency;
  }
  res.json( todos )
  res.sendStatus( 200 )
})

app.post( '/delete', async (req,res) => {
  todos = todos.filter(item => item.todo !== req.body.todo);
  res.json( todos )
})

ViteExpress.listen( app, 3000 )