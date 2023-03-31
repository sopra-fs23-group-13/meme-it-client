import React from 'react';

const PlayerAvatar = ({ name, color }) => {
  const initials = name.charAt(0).toUpperCase();
  const backgroundColor = color || 'gray';
  const avatarStyle = {
    backgroundColor: backgroundColor,
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80px',
    height: '80px',
    fontSize: '28px',
    fontWeight: '600',
    color: 'white',
    border: `2px solid ${backgroundColor}`
  };
  return (
    <div style={avatarStyle}>
      {initials}
    </div>
  );
};

const ActivePlayersList = ({ players }) => {
  return (
    <div>
      {players.map((player) => (
        <div key={player.id} style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid gray', padding: '10px' }}>
          <div style={{ marginRight: '10px' }}>
            <PlayerAvatar name={player.name} color={player.color} />
          </div>
          <div style={{ flexGrow: 1 }}>
            <div>{player.name}</div>
          </div>
          <div>
            <button style={{ backgroundColor: 'red', color: 'white', padding: '10px', border: 'none', borderRadius: '5px' }}>Kick</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivePlayersList;
