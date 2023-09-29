const express = require( 'express' ),
    app = express(),
    ViteExpress = require( 'vite-express' ),
    mongodb = require( 'mongodb' ),
    ObjectID = mongodb.ObjectId

require('dotenv').config();

app.use( express.json() )
app.use( express.urlencoded({ extended:true }) )



// #region Mongodb
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
const db=client.db( process.env.DB );
let taskCollection=db.collection( process.env.DB_TASKS );

app.get( '/read', ( req, res ) => {
    taskCollection.find().toArray().then( result => {
        res.json( result )
    } )
})

app.post( '/add', express.json(), async ( req,res ) => {
    let info=req.body;
    await taskCollection.insertOne(
        {task:info.task, creationDate: info.creationDate, deadline: info.deadline}
    )
    res.end();
})

app.post( '/update',express.json(), async  function( req,res ) {
    let id=req.body._id;
    await taskCollection.updateOne({_id:new ObjectID(id)},{ $set: { task: req.body.task,creationDate:req.body.creationDate,deadline:req.body.deadline } });
    res.redirect( 'index.html' )
})

app.post( '/delete',express.json(), async  function( req,res ) {

    await taskCollection.deleteOne({_id: new ObjectID(req.body._id)});

    res.end()
})

ViteExpress.listen( app, 3000 )