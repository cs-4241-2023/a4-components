import express from 'express'
import ViteExpress from 'vite-express'

const app = express()

const appdata = []

app.use( express.json() )

app.get( '/library', ( req, res ) => res.json( appdata ) )


app.post( '/add', async (req,res) => {
    try {
      const newItem = req.body

    let duplicate = appdata.some(item => item.title === newItem.title && item.author === newItem.author && item.startDate === newItem.startDate && item.dateFinished === newItem.dateFinished)
    if (duplicate){

      res.status(409).json({message: 'Duplicate entry'})
    }
    else{
      
    //appdata.push(JSON.parse(newItem))
    appdata.push(newItem)
    res.json(appdata)
    console.log(appdata)
  }
}
    catch (error) {
        console.error('Error adding data to appdata:', error)
        res.status(500).json({ message: 'Failed to add data to appdata' })
      }
   
  })

  app.delete('/delete/:id', async (req, res) => {
  
    if (req.url.startsWith('/delete')){
      const itemIdentifier  = req.url.replace('/delete/','')
      console.log("Received DELETE request for itemID:", itemIdentifier)
  
      let index = -1
      for (let i = 0; i < appdata.length;i ++){
        if (appdata[i].identifier === itemIdentifier) {
          index = i
          break
        }
      }
  
      if (index !== -1){
        appdata.splice(index,1)
        console.log("Current appdata post deletion:", appdata);

        res.json(appdata)

  
      }
      else{
  
        res.status(404).json({ message: 'Data not found' })
  
      }
    }
    else {
      console.log("Invalid DELETE request:", req.url)
  
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.status(500).json({ message: 'Failed to add data to appdata' })
    }
  })
  

ViteExpress.listen( app, 3000 )