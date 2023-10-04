import React, { useState } from 'react';

const AddPlayerForm = ({ onAddPlayer }) => {
  const [playerName, setPlayerName] = useState('');
  const [attributes, setAttributes] = useState([0, 0, 0, 0, 0]);

  const handleInputChange = (e, index) => {
    const newAttributes = [...attributes];
    newAttributes[index] = parseInt(e.target.value, 10);
    setAttributes(newAttributes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPlayer = {
      name: playerName,
      outside: attributes[0],
      inside: attributes[1],
      athleticism: attributes[2],
      playmaking: attributes[3],
      defense: attributes[4],
      rating: calculateRating(attributes[0],attributes[1],attributes[2],attributes[3],attributes[4])
    };
    try {
      const response = await fetch('/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPlayer }),
      }).then( response => response.json() ).then(response => console.log(response))
      

      if (response.ok) {
        console.log("response okay")
        const getResponse = await fetch('/get'); // Assuming this endpoint returns the updated data
      if (getResponse.ok) {
        console.log("get response okay")
        const updatedData = await getResponse.json();
        // Handle the updated data as needed in your component
        console.log('Player added successfully and data retrieved:', updatedData);
      } else {
        // Handle errors in the GET request
        console.error('Failed to retrieve updated data');
      }

      } else {
        // Handle errors (e.g., show an error message).
        console.error('Failed to add player');
      }
    }catch (error) {
      console.error('Error:', error);
    }
    onAddPlayer(newPlayer);
    setPlayerName('');
    setAttributes([0, 0, 0, 0, 0]);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Player Name:
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
        </label>
        <br />
        <label>
          Attributes:
          {attributes.map((attribute, index) => (
            <input
              key={index}
              type="number"
              value={attribute}
              onChange={(e) => handleInputChange(e, index)}
              min={0}
              max={99}
            />
          ))}
        </label>
        <br />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default AddPlayerForm;

// A function to calculate the player's rating based on attributes
const calculateRating = (outsideScoring, insideScoring, athleticism, playmaking, defending) => {
  // Check if the input ratings are within the valid range (0-99)
  if (
    outsideScoring < 0 || outsideScoring > 99 ||
    insideScoring < 0 || insideScoring > 99 ||
    athleticism < 0 || athleticism > 99 ||
    playmaking < 0 || playmaking > 99 ||
    defending < 0 || defending > 99
  ) {
    throw new Error('All ratings must be between 0 and 99.');
  }

  // Weighted average of the ratings with arbitrary weights
  const overallRating = (
    outsideScoring * 0.2 +
    insideScoring * 0.25 +
    athleticism * 0.15 +
    playmaking * 0.3 +
    defending * 0.1
  );

  // Round the overall rating to the nearest integer
  return Math.round(overallRating);
};