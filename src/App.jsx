import React, { useState, useEffect } from 'react'

const Playlists = props => {

  if(props.title !== undefined)
  {
    return(
      <li>
        {props.title} by {props.artist} is {props.length}
        <button onClick={() => props.remove(props.season, props.title, props.artist, props.length)}>Delete</button>
      </li>
      )
  }else {
    return (<p></p>) 
  }
}

const App = () => {
  const [playlists, setPlaylists] = useState([ ])

  function add() {
    const season = document.getElementById('season').value
    const title = document.getElementById('title').value
    const artist = document.getElementById('artist').value
    const length = document.getElementById('length').value

    const payload = JSON.stringify({ season: season, title: title, artist: artist, length: length });
    console.log('Payload:', payload);

    fetch( '/add', {
      method:'POST',
      body: payload,
      headers: { 'Content-Type': 'application/json' }
    })
    .then( response => response.json() )
    .then( json => {
      console.log("JSON Resposne: ", json);
       setPlaylists( json )
    })
  }

    function handleSeasonChange(e){
      let newSeason = e.target.value;

      const payload = JSON.stringify({season: newSeason})

      fetch( '/load', {
        method:'POST',
        body: payload,
        headers: { 'Content-Type': 'application/json' }
      })
      .then( response => response.json() )
      .then( json => {
        console.log("JSON Resposne: ", json);
         setPlaylists( json )
      })
    }


  function remove(season, title, artist, length) {

    console.log(season);
    console.log(title);
  
    const payload = JSON.stringify({ season: season, 
    title: title, 
    artist: artist, 
    length: length });


    console.log('Delete Payload:', payload);

    fetch( '/remove', {
      method:'POST',
      body: payload,
      headers: { 'Content-Type': 'application/json' }
    })
    .then( response => response.json() )
    .then( json => {
      console.log("JSON Resposne: ", json);
       setPlaylists( json )
    }) 
 }

  return (
    <div className="App">
  <div class="song-header">
      <h1 id="header"> Season Playlist Creator </h1>
    </div>
    <div class="header-container"/>
      <div class="header-content"/>
        <p>Add a Song to a Season Playlist!</p>
    <p></p>
    <select name="season" id="season" onChange={handleSeasonChange}>
      <option value ="default"></option>
      <option value="fall">Fall</option>
      <option value="winter">Winter</option>
      <option value="spring">Spring</option>
      <option value="summer">Summer</option>
    </select>
    <input type="text" id="title" placeholder="Song Title*" />
    <input type="text" id="artist" placeholder="Artist*" />
    <input type="number" id="length" placeholder="Length in Seconds*" />
    <button id="add" onClick={ add }>Submit</button>
    <p></p>
      <ul>
        { playlists.map( (playlists,i) => <Playlists key={i} season={playlists.season} title={playlists.title} artist={playlists.artist} length={playlists.length} remove={remove}/> ) }
     </ul> 
    </div>
  )
}
export default App