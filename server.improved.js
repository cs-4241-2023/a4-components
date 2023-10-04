import express from  'express'
import ViteExpress from 'vite-express'

const app = express()

const playlists = [{}]

app.use( express.json() )

app.post( '/load', ( req, res ) => {

  const seasonPlaylist = [{}];

  for (let i = 0; i < playlists.length; i++) {
    if (playlists[i].season === req.body.season){
      seasonPlaylist.push(playlists[i]);
    }
  }
  
  res.json(seasonPlaylist); 

})

app.post( '/add', ( req,res ) => {
  const length = req.body.length;
  const minutes = Math.floor(length / 60).toString();
  const seconds = (length % 60).toString();

  let finalTime = "";

  if (seconds < 10) {
    finalTime = minutes + ":0" + seconds;
  } else {
    finalTime = minutes + ":" + seconds;
  }

  req.body.length = finalTime;
  playlists.push( req.body )

  const seasonPlaylist = [{}];
  for (let i = 0; i < playlists.length; i++) {
    if (playlists[i].season === req.body.season){
      seasonPlaylist.push(playlists[i]);
    }
  }
  
  res.json( seasonPlaylist );
})

app.post("/remove", async (req, res) => {

  for (let i = 0; i < playlists.length; i++) {
    if (
      playlists[i].title === req.body.title &&
      playlists[i].artist === req.body.artist &&
      playlists[i].length === req.body.length &&
      playlists[i].season === req.body.season
    ) 
      playlists.splice(i, 1);
  }

  const seasonPlaylist = [{}];
  for (let i = 0; i < playlists.length; i++) {
    if (playlists[i].season === req.body.season){
      seasonPlaylist.push(playlists[i]);
    }
  }
  
  res.json( seasonPlaylist );
});
 
 
ViteExpress.listen( app, 8080 )