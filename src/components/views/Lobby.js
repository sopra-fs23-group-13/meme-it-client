import { Col, Container, Row, Stack } from "react-bootstrap";
import "styles/views/Lobby.scss";
import "styles/ui/LobbyCode.scss"; //Copyfield of LobbyCode
import "styles/ui/Button.scss";
import BaseContainer from "../ui/BaseContainer";
import {Button, OverlayTrigger, Tooltip} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import ActivePlayersList from "../ui/ActivePlayersList";
import LobbySettings from "../ui/LobbySettings";
import { FaCopy } from "react-icons/fa";

import {api} from "../../helpers/api";
import Cookies from "universal-cookie";
import {Spinner} from "../ui/Spinner";
import {lobby, game} from "../../helpers/endpoints";
import {Notification} from "../ui/Notification";
import Chat from "../ui/Chat";
import {LoadingButton} from "../ui/LoadingButton";
import {AppContext} from "../../context";

const Lobby = () => {
  const cookies = new Cookies();
  const history = useHistory();
  const {setLoadedGameData} = useContext(AppContext);
  const [currentLobby, setCurrentLobby] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSynchronizing, setIsSynchronizing] = useState(false);
  const toggleShowAlert = () => setShowAlert(!showAlert);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentLobby.code);
  };

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

        if(response.data.gameStartedAT !== null){
          if(!isSynchronizing) {
            executeForAllPlayersAtSameTime(new Date(response.data.gameStartedAT), () => {
              startGameAtTheSameTime(response.data);
            });
            preloadGame(response);
            setIsSynchronizing(!isSynchronizing);
          }
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
    const interval = setInterval(() => {
      getLobbyData();
    }, 1000);
    return () => clearInterval(interval);
  })

  const leaveLobby = async (reason) => {
    try {
      await api.delete(`${lobby}/${currentLobby.code}/players`, {headers: {'Authorization': 'Bearer ' + cookies.get("token")}});
    }
    catch {
      //Do nothing, alert is handled in Home using sessionStorage alert.
    }
    finally {
      localStorage.clear()
      sessionStorage.setItem("alert", reason)
      cookies.remove("token")
      history.push("/")
    }
  }

  const renderTooltip = (props) => (
      <Tooltip id="button-tooltip" {...props}>
        Copy to clipboard
      </Tooltip>
  );

  const startGame = async () => {
    const response = await api.post(`/${game}/${currentLobby.code}`,{},{headers: {'Authorization': 'Bearer ' + cookies.get("token")}});
    preloadGame(response);
  }

  const preloadGame = async (response) => {
    const preLoadedGameData = await api.get(`${game}/${response.data.gameId}`,{headers: {'Authorization': 'Bearer ' + cookies.get("token")}});
    const preLoadedMemeTemplate = await api.get(`${game}/${response.data.gameId}/template`,{headers: {'Authorization': 'Bearer ' + cookies.get("token")}});
    const memeData = {
      ...preLoadedGameData.data,
      meme: {...preLoadedMemeTemplate.data}
    }
    console.log(memeData);
    setLoadedGameData(memeData);
  }

  const startGameAtTheSameTime= (currentLobby) =>{
    console.log(currentLobby);
    localStorage.setItem("started", "true")
    history.push(`/game/${currentLobby.gameId}`);
  }


  const executeForAllPlayersAtSameTime = async (time, callback) => {
    if(!isSynchronizing){
      const delay = time - Date.now();
      if (delay <= 0) {
        callback();
      } else {
        setTimeout(callback, delay);
      }
      setIsSynchronizing(!isSynchronizing);
      setShowAlert(true);
    }
  };

  return (
      <div className={"lobby content"}>
      <Container >
        <div className={"lobby alert"}>
          <Notification reason="Game is synchronizing all players and will start soon..."
                        showAlert={(showAlert && isSynchronizing)}
                        toggleShowAlert={toggleShowAlert}
          />
        </div>
        <Stack gap={3}>
          <div className={"lobby card"}>
            {/*
            <Col>
              <h1 className="lobby title">Meme-It</h1>
              <p className="lobby subtitle"> The Meme Creation Game</p>
            </Col>
            */}
            <BaseContainer className="lobby container">
              { currentLobby.lobbySetting ?
                  <Row>
                    <Col>
                      <h2 className="lobby player-title">Players</h2>
                      <ActivePlayersList lobby={currentLobby} players={currentLobby.players} isEditable={isSynchronizing}/>
                    </Col>

                    <Col
                        xs={1}
                        className="d-flex align-items-center justify-content-center"
                    >
                      <div className="vertical-line"></div>
                    </Col>
                    <Col>
                      <h2 className="lobby player-title">Settings</h2>
                      <LobbySettings Lobby={currentLobby} isAdmin={isAdmin} isEditable={isSynchronizing}/>


                      <div className="lobby-code-container lobby card">
                        <h2 className="lobby-code-heading">Lobby Code:</h2>
                        <div className="lobby-code">
                          <span className="lobby-code-text">{currentLobby.code}</span>
                          <OverlayTrigger
                              placement="left"
                              delay={{ show: 250, hide: 400 }}
                              overlay={renderTooltip}
                          >
                      <span
                          className="copy-icon"
                          onClick={copyToClipboard}
                          title="Copy to clipboard"
                      >
                    <FaCopy />
                  </span>
                          </OverlayTrigger>
                        </div>
                      </div>
                    </Col>

                  </Row>
                  : (
                      <Row>
                        <Col>
                          <Spinner />
                        </Col>
                      </Row>
                  )
              }
              <Row>
                <Col>
                  <LoadingButton
                      buttonText={"Leave Lobby"}
                      loadingText={"Leaving..."}
                      onClick={() => leaveLobby("Disconnected")}
                      c_name={"lobby leave-btn"}
                      loadingTime={500}
                      disabledIf={isSynchronizing}
                  />
                </Col>
              </Row>
            </BaseContainer>
            {isAdmin ? (
                <Row className={"d-flex align-items-center justify-content-center"}>
                  <Button
                      onClick={startGame}
                      disabled={currentLobby.startTimeAT}
                      className="lobby btn start"
                  >
                    Start Game
                  </Button>
                </Row>
            ) : <div></div>
            }
          </div>

        </Stack>
        <Chat currentLobby={currentLobby} />
      </Container>
      </div>
  )
};

export default Lobby;
