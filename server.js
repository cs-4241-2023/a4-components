const express = require( 'express' ),
    app = express(),
    ViteExpress = require( 'vite-express' )

const todos = [
    { 'task': 'homework', 'creationDate': '9/01/2023', 'deadline': '9/29/2023'},
    { 'task': 'taxes', 'creationDate': '9/01/2023', 'deadline': '9/30/2023' },
    { 'task': 'chores', 'creationDate': '9/01/2023', 'deadline': '10/1/2023' }
]

app.use( express.json() )

app.get( '/read', ( req, res ) => res.json( todos ) )

app.post( '/add', ( req,res ) => {
    todos.push( req.body )
    res.json( todos )
})

app.post( '/change', function( req,res ) {
    const idx = todos.findIndex( v => v.name === req.body.name )
    todos[ idx ].completed = req.body.completed

    res.sendStatus( 200 )
})

ViteExpress.listen( app, 3000 )