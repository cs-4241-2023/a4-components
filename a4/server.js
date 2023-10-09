import express from "express";
import ViteExpress from "vite-express";
const app = express();
import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config();
app.use( express.json() );

var contacts = [
  {
    "firstName": "Nick",
    "lastName": "Borrello",
    "phone": "123-456-7833",
    "email": "nvborrello@wpi.edu",
    "dateOfBirth": "2001-12-17",
    "streetAddress": "99 West St",
    "city": "Worcester",
    "state": "MA",
    "zipCode": "01609",
    "lastEdited": {
      "$date": "2023-09-28T08:43:57.442Z"
    },
    "id": 0
  }
]

var idCounter = 0

async function run() {

  // Get the database contacts table for a specific user
  app.get("/docs", (req, res) => res.json(contacts))

  // Insert data into the table
  app.post( "/add", (req,res) => {
    // get the userContacts for a specific user id
    req.body.lastEdited = new Date()
    idCounter++
    req.body.id = idCounter
    contacts.push(req.body)
    res.json(contacts)
  })

  app.post('/remove', (req, res) => {
    // Remove the req.body._id from the contacts list
    console.log("Remove: ", req.body.index)
    contacts = contacts.splice(req.body.index, 1)
    res.json( contacts )
  })

    // Update the contacts based on teh req.body._id
  app.post('/edit', (req, res) => {
    // Replace the contact with the req.body._id with the req.body
    const index = contacts.findIndex( contact => contact._id == req.body._id )
    contacts[index] = req.body
    res.json( contacts )
  })
}

run()

ViteExpress.listen( app, 3000 );

export default app;


