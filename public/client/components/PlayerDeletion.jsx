import React, { useState } from 'react';

const PlayerDeletion = ({ players, onDeletePlayer }) => {
  const [selectedPlayer, setSelectedPlayer] = useState('');

  const handleDelete = () => {
    if (selectedPlayer) {
      onDeletePlayer(selectedPlayer);
      setSelectedPlayer('');
    }
  };

  return (
    <div>
      <select
        value={selectedPlayer}
        onChange={(e) => setSelectedPlayer(e.target.value)}
      >
        <option value="">Select a Player to Delete</option>
        {players.map((player, index) => (
          <option key={index} value={player.name}>
            {player.name}
          </option>
        ))}
      </select>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default PlayerDeletion;
