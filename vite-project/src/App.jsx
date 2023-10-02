import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
 // Define variables to take information from.
const [yourname, setName] = useState('');
const [username, setUsername] = useState('');
const [email, setEmail] = useState('');
const [position, setPosition] = useState('');
//So react uses state hooks to update the table. (?)
const [players, setPlayers] = useState([]);


// FRONT-END (CLIENT) JAVASCRIPT HERE all converted from main.js

const submitPlayerData = async function (event) {
  event.preventDefault();

  const json = { yourname: yourname, username: username, email: email, position: position };
  const body = JSON.stringify(json);

  function validateInput() {
    if (yourname === '' || username === '' || email === '' || position === '') {
      return false;
    }
    return true;
  }

  if (validateInput() === false) {
    alert('Please fill out all fields.');
  } else {
    console.log('Input validated.');
  }

  const response = await fetch('/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body,
  });

  if (response.ok) {
    // Data was successfully submitted
    const text = await response.text();
    console.log('Server response:', text);

    // Clear form fields after submission
    setName('');
    setUsername('');
    setEmail('');
    setPosition('');

    // Refresh the table to display updated data
    updateTable();
  } else {
    console.error('Error submitting data to the server');
  }
};

// Function to update the table with data from the server
const updateTable = async function () {
  const response = await fetch('/get', {
    method: 'GET'
  });
  if (response.ok) {
    const data = await response.json();
    console.log('Table data:', data);
    // Update the players state, this replaced populate table in my main.js
    setPlayers(data);
  } else {
    console.error('Error fetching data from the server');
  }
};

// Function to delete a player from the table
const deletePlayer = async function (index) {
  console.log('Deleting player with index:', index);
  const response = await fetch('/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ index: index }),
  });
  updateTable();
};

// Function to edit a player from the table
const editPlayer = async function (index) {
  console.log('Editing player with index:', index);
  const json = { yourname: yourname, username: username, email: email, position: position };
  const response = await fetch('/edit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ index: index, playerdata: json }),
  });
  updateTable();
};

useEffect(() => {
  // Load initial data when the component mounts
  updateTable();
}, []);


  return (
    <div className="App">
    <h1 id="web-header">ESports Sign Up</h1>
    <form onSubmit={submitPlayerData}>
      <input type="text" value={yourname} onChange={(e) => setName(e.target.value)} placeholder="Your real name here." style={{ padding: '7px 15px', margin: '10px 0' }}/>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Your gamertag here." style={{ padding: '7px 15px', margin: '10px 0' }}/>
      <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email here." style={{ padding: '7px 15px', margin: '10px 0' }}/>
      <input type="text" value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Your position here." style={{ padding: '7px 15px', margin: '10px 0' }}/>
      <button type="submit" style={{ padding: '7px 15px', margin: '10px 0' }}>Submit </button>
    </form>
    <table id="player-table">
      <thead>
        <tr>
          <th>Edit</th>
          <th>Delete</th>
          <th>Player Name</th>
          <th>Player GamerTag</th>
          <th>Player Email</th>
          <th>Player Position</th>
        </tr>
      </thead>
      <tbody id="table-body">
      {players.map((player, index) => (
  <tr key={index}>
    <td>
      <button onClick={() => editPlayer(index)}>Edit</button>
    </td>
    <td>
      <button onClick={() => deletePlayer(index)}>Delete</button>
    </td>
    <td>{player.yourname}</td>
    <td>{player.username}</td>
    <td>{player.email}</td>
    <td>{player.position}</td>
  </tr>
    ))}
      </tbody>
    </table>
  </div>
);
}

export default App
