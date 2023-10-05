import { useState, useEffect } from 'react'
import { Tab } from './components/tab'
import AddPlayerForm from './components/addPlayerForm'
import PlayerDeletion from './components/PlayerDeletion'
import './App.css'
import PlayerTable from './components/PlayerTable'

function App() {

  // Player list
  const [players, setPlayers] = useState(nbaPlayerData);
  const [count, setCount] = useState(0)

  useEffect(() => {
    fetch("/players")
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(responseData => setPlayers(responseData))
      .catch(error => {
        console.error("Error fetching player data:", error);
      });
  }, []);
  
  


  // Function to add a new player to the players array
  const addPlayer = (newPlayer) => {
    setPlayers([...players, newPlayer]);
  };

  
// Tabs
  const tabs = [
    { label: 'Add Player', content: <AddPlayerForm
    onAddPlayer={addPlayer}/>},
    { label: 'Delete Player', content: <PlayerDeletion
    players={players}
    onDeletePlayer={(playerName) => {
      // Filter the players list to exclude the deleted player
      const updatedPlayers = players.filter(
        (player) => player.name !== playerName
      );
      setPlayers(updatedPlayers);
    }}
  />},
  ];


  return (
    <>
    <Tab tabs={tabs} />
    <PlayerTable players={players}/>
  </>
  )
}

export default App

const nbaPlayerData = [
  {
    "name": "LeBron James",
    "outside": 88,
    "inside": 90,
    "athleticism": 92,
    "playmaking": 96,
    "defense": 85,
    "rating": 90
  },
  {
    "name": "Stephen Curry",
    "outside": 98,
    "inside": 75,
    "athleticism": 88,
    "playmaking": 92,
    "defense": 70,
    "rating": 85
  },
  {
    "name": "Giannis Antetokounmpo",
    "outside": 78,
    "inside": 95,
    "athleticism": 97,
    "playmaking": 84,
    "defense": 90,
    "rating": 89
  },
  {
    "name": "Kevin Durant",
    "outside": 95,
    "inside": 88,
    "athleticism": 90,
    "playmaking": 85,
    "defense": 82,
    "rating": 88
  },
  {
    "name": "Kawhi Leonard",
    "outside": 88,
    "inside": 80,
    "athleticism": 92,
    "playmaking": 75,
    "defense": 95,
    "rating": 86
  },
  {
    "name": "Luka Dončić",
    "outside": 90,
    "inside": 85,
    "athleticism": 86,
    "playmaking": 94,
    "defense": 78,
    "rating": 86
  },
  {
    "name": "Anthony Davis",
    "outside": 75,
    "inside": 92,
    "athleticism": 89,
    "playmaking": 72,
    "defense": 96,
    "rating": 85
  },
  {
    "name": "James Harden",
    "outside": 96,
    "inside": 85,
    "athleticism": 84,
    "playmaking": 93,
    "defense": 72,
    "rating": 86
  },
  {
    "name": "Joel Embiid",
    "outside": 72,
    "inside": 95,
    "athleticism": 87,
    "playmaking": 70,
    "defense": 89,
    "rating": 83
  },
  {
    "name": "Damian Lillard",
    "outside": 97,
    "inside": 75,
    "athleticism": 86,
    "playmaking": 90,
    "defense": 68,
    "rating": 83
  },
  {
    "name": "Jimmy Butler",
    "outside": 84,
    "inside": 88,
    "athleticism": 86,
    "playmaking": 82,
    "defense": 90,
    "rating": 86
  },
  {
    "name": "Karl-Anthony Towns",
    "outside": 80,
    "inside": 85,
    "athleticism": 84,
    "playmaking": 72,
    "defense": 78,
    "rating": 80
  },
  {
    "name": "Devin Booker",
    "outside": 92,
    "inside": 78,
    "athleticism": 86,
    "playmaking": 80,
    "defense": 70,
    "rating": 81
  },
  {
    "name": "Rudy Gobert",
    "outside": 45,
    "inside": 88,
    "athleticism": 80,
    "playmaking": 55,
    "defense": 96,
    "rating": 73
  },
  {
    "name": "Chris Paul",
    "outside": 87,
    "inside": 70,
    "athleticism": 82,
    "playmaking": 95,
    "defense": 76,
    "rating": 82
  },
];
