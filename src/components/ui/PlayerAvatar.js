import React from 'react';

const PlayerAvatar = ({ player }) => {
  return (
    <div className="player-avatar">
      <div
        className="player-avatar__circle"
        style={{ backgroundColor: player.color }}
      >
        {player.name.charAt(0).toUpperCase()}
      </div>
      <div className="player-avatar__name">{player.name}</div>
    </div>
  );
};

export default PlayerAvatar;
