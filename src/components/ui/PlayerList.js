import React from 'react';
import PlayerAvatar from './PlayerAvatar';

const PlayerList = ({ players }) => {
  return (
    <div className="player-list">
      {players.map((player, index) => (
        <PlayerAvatar player={player} key={index} />
      ))}
    </div>
  );
};

export default PlayerList;
