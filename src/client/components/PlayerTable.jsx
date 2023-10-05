import React from 'react';

const PlayerTable = ({ players }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Outside Shooting</th>
          <th>Inside Shooting</th>
          <th>Athleticism</th>
          <th>Playmaking</th>
          <th>Defense</th>
          <th>Rating</th>
        </tr>
      </thead>
      <tbody>
        {players.map((player, index) => (
          <tr key={index}>
            <td>{player.name}</td>
            <td>{player.outside}</td>
            <td>{player.inside}</td>
            <td>{player.athleticism}</td>
            <td>{player.playmaking}</td>
            <td>{player.defense}</td>
            <td>{player.rating}</td>
            
          </tr>
        ))}
      </tbody>
    </table>
  );
};

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

export default PlayerTable;
