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
  const rows = [];
  for (let i = 0; i < players.length; i += 5) {
    const row = players.slice(i, i + 5);
    rows.push(row);
  }
  return (
    <div>
      {rows.map((row, index) => (
        <div key={index} style={{ display: 'flex' }}>
          {row.map((player) => (
            <div key={player.id} style={{ margin: '0 10px' }}>
              <PlayerAvatar name={player.name} color={player.color} />
              <div style={{ textAlign: 'center' }}>{player.name}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ActivePlayersList;
