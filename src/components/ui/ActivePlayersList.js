import React from 'react';
import { FaCrown } from 'react-icons/fa';
import Cookies from "universal-cookie";
import {Button} from "react-bootstrap";
import {api} from "../../helpers/api";
import {lobby as lobbyEndpoint} from "../../helpers/endpoints";

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

const ActivePlayersList = ({lobby, players, isEditable}) => {
  const cookies = new Cookies();
  let playerItems;

  //Temporary Kick Solution
  const kickPlayer = async (uuid) => {
    try {
      sessionStorage.setItem("alert", "You were removed from the lobby")
      await api.delete(`${lobbyEndpoint}/${lobby.code}/players`, {headers: {'Authorization': 'Bearer ' + uuid}});
    }
    catch (error) {
      console.log(error)
    }
  }
  //If player is the owner of the lobby (show kick button)
  if(players && lobby.owner.id=== cookies.get("token")){
    playerItems = (
        <div>
          {players.map(player => (
              <div key={player.id} style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid gray', padding: '10px' }}>
                <div style={{ marginRight: '10px' }}>
                  <PlayerAvatar name={player.name} color={"#7260e3"} isAdmin={player.id === lobby.owner.id} />
                </div>
                <div style={{ flexGrow: 1 }}>
                  <div>{player.name}</div>
                </div>
                <div>
                  {player.id != lobby.owner.id && <Button className="lobby kick-btn" onClick={() => kickPlayer(player.id)} disabled={isEditable}>
                    Kick
                  </Button>}
                </div>
              </div>
          ))}
        </div>
    );
  }
  //If player is not the owner of the lobby (no kick button)
  else if(players){
    playerItems = (
        <div>
          {players.map(player => (
              <div key={player.id} style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid gray', padding: '10px' }}>
                <div style={{ marginRight: '10px' }}>
                  <PlayerAvatar name={player.name} color={"#7260e3"} isAdmin={player.id === lobby.owner.id} />
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
      <div className={"lobby card"}>
        {playerItems}
      </div>
  )

};

export default ActivePlayersList;
