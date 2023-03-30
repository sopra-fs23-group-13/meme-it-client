import React from 'react';
import 'styles/ui/LobbyHeader.scss';

const LobbyHeader = ({lobbyName}) => {
  return (
    <h1 className="lobby-header">
      {lobbyName.split("").map((letter, index) => (
        <span key={index} className="letter">{letter}</span>
      ))}
    </h1>
  );
}

export default LobbyHeader;
