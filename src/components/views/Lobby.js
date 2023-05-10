import { Col, Container, Row, Stack } from "react-bootstrap";
import "styles/views/Lobby.scss";
import "styles/ui/LobbyCode.scss";
import "styles/ui/Button.scss";
import {Button} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import React, {useEffect, useState} from "react";
import ActivePlayersList from "../ui/ActivePlayersList";
import LobbySettings from "../ui/LobbySettings";

import {api} from "../../helpers/api";
import Cookies from "universal-cookie";
import {Spinner} from "../ui/Spinner";
import {lobby, game} from "../../helpers/endpoints";
import {Notification} from "../ui/Notification";
import Chat from "../ui/Chat";
import {LoadingButton} from "../ui/LoadingButton";
import {LobbyCodeContainer} from "../ui/LobbyCodeContainer";

const Lobby = () => {
  const cookies = new Cookies();
  const history = useHistory();
  const [currentLobby, setCurrentLobby] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSynchronizing] = useState(false);
  const toggleShowAlert = () => setShowAlert(!showAlert);


  useEffect( () => {
    const getLobbyData = async () => {
      let playerIsInLobby = false;
      try {
        const response = await api.get(`${lobby}/${localStorage.getItem("code")}`, {headers: {'Authorization': 'Bearer ' + cookies.get("token")}});
        setCurrentLobby(response.data);
        //Check if player is the owner
        if(response.data.owner.id === cookies.get("token")){
          setIsAdmin(true);
        }
        //Check if player is in the lobby's player list
        response.data.players.forEach(player => {
          if(player.id === cookies.get("token")){
            playerIsInLobby = true;
          }
        });

        if(response.data.gameStartedAt !== null){
          startGameAtTheSameTime(response.data)
        }

        if(!playerIsInLobby){
          await leaveLobby("Kicked from Lobby");
        }
        }
      catch (error){
        await leaveLobby("Lobby Not Found")
        console.log(error);
      }
    }
    const interval = setInterval(async () => {
      await getLobbyData();
    }, 1000);
    return () => clearInterval(interval);
  })

  const leaveLobby = async (reason) => {
    try {
      await api.delete(`${lobby}/${currentLobby.code}/players`, {headers: {'Authorization': 'Bearer ' + cookies.get("token")}});
    }
    catch {
      //Do nothing, alert is handled in Home using localStorage alert.
    }
    finally {
      localStorage.clear()
      localStorage.clear()
      localStorage.setItem("alert", reason)
      cookies.remove("token")
      history.push("/")
    }
  }

  const startGame = async () => {

    await api.post(`/${game}/${currentLobby.code}`,{},{headers: {'Authorization': 'Bearer ' + cookies.get("token")}});
  }

  const startGameAtTheSameTime= (currentLobby) =>{
    localStorage.setItem("started", "true")
    history.push(`/game/${currentLobby.gameId}`);
  }

  return (
      <div className={"lobby content"}>
      <Container>
        <div className={"lobby alert"}>
          <Notification
              reason="Game is synchronizing all players and will start soon..."
              showAlert={(showAlert && isSynchronizing)}
              toggleShowAlert={toggleShowAlert}
          />
        </div>
          <Stack gap={3}>
            <div className={"lobby card"}>
              {currentLobby.lobbySetting ?
                  <div>
                    <Row>
                      <h2 className={"d-flex align-items-center justify-content-center"}>{currentLobby.name} - Waiting...</h2>
                    </Row>
                    <Row>
                      <hr className={"lobby line"}/>
                    </Row>
                    <Row>
                      <Col md={"auto"}>
                        <h3 className="lobby player-title">Players</h3>
                        <ActivePlayersList lobby={currentLobby} players={currentLobby.players} isEditable={isSynchronizing}/>
                      </Col>
                      <Col >
                        <h3 className="lobby player-title">Settings</h3>
                        <LobbySettings Lobby={currentLobby} isAdmin={isAdmin} isEditable={isSynchronizing}/>
                      </Col>
                      <Col md={"auto"}>
                          <LoadingButton
                              buttonText={"Leave Lobby"}
                              loadingText={"Leaving..."}
                              onClick={() => leaveLobby("Disconnected")}
                              c_name={"lobby leave-btn"}
                              loadingTime={500}
                              disabledIf={isSynchronizing}
                          />
                          <LobbyCodeContainer code={currentLobby.code}/>
                      </Col>
                    </Row>
                    {isAdmin ? (
                        <Row className={"d-flex align-items-center justify-content-center"}>
                          <Button
                              onClick={startGame}
                              disabled={currentLobby.gameStartedAt}
                              className="lobby btn start"
                          >
                            Start Game
                          </Button>
                        </Row>
                    ) : <div></div>
                    }
                  </div>
                  : (<Row> <Col> <Spinner /> </Col> </Row>)
              }
            </div>
          </Stack>
        {currentLobby.lobbySetting ?
        <Chat currentLobby={currentLobby} /> : <></> }
      </Container>
      </div>
  )
};

export default Lobby;
