import React from 'react';
import { FaCrown } from 'react-icons/fa';
import PropTypes from "prop-types";
import Cookies from "universal-cookie";
import {Button} from "react-bootstrap";

const PlayerAvatar = ({ name, color, isAdmin }) => {
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
    border: `2px solid ${backgroundColor}`,
    position: 'relative'
  };
  const crownStyle = {
    position: 'absolute',
    top: '-10px',
    left: '-10px',
    backgroundColor: '#ffd700',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '30px',
    height: '30px',
    fontSize: '14px',
    fontWeight: '600',
    color: 'black',
  };
  return (
    <div style={avatarStyle}>
      {isAdmin && <div style={crownStyle}><FaCrown /></div>}
      {initials}
    </div>
  );
};

const ActivePlayersList = ({lobby, players}) => {
  const cookies = new Cookies();
  let playerItems;

  if(players && lobby.owner.uuid=== cookies.get("token")){
    playerItems = (
        <div>
          {players.map(player => (
              <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid gray', padding: '10px' }}>
                <div style={{ marginRight: '10px' }}>
                  <PlayerAvatar name={player.name} color={"pink"} isAdmin={player.uuid === lobby.owner.uuid} />
                </div>
                <div style={{ flexGrow: 1 }}>
                  <div>{player.name}</div>
                </div>
                <div>
                  <Button className="lobby kick-btn">
                    Kick
                  </Button>
                </div>
              </div>
          ))}
        </div>
    );
  }
  else if(players){
    playerItems = (
        <div>
          {players.map(player => (
              <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid gray', padding: '10px' }}>
                <div style={{ marginRight: '10px' }}>
                  <PlayerAvatar name={player.name} color={"pink"} isAdmin={player.uuid === lobby.owner.uuid} />
                </div>
                <div style={{ flexGrow: 1 }}>
                  <div>{player.name}</div>
                </div>
              </div>
          ))}
        </div>
    );
  }

  return (
      <div>
        {playerItems}
      </div>
  )

};

export default ActivePlayersList;
