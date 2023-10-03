import express from  'express'
import ViteExpress from 'vite-express'

const app = express()

const appdata = []

app.use( express.json() )

app.post( '/submit', ( req,res ) => {
  const data = req.body
  data.birthyear = data.year - data.age - 1
  appdata.push( data )
  res.json( appdata )
})

app.post( '/delete', function( req,res ) {
  appdata.splice(req.body.index, 1)
  
  res.json( appdata )
})

app.get( '/read', function( req,res ) {
  res.json( appdata )
})

ViteExpress.listen( app, 3000 )