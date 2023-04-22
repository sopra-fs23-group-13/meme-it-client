import { Col, Container, Row, Stack } from "react-bootstrap";
import "styles/views/Lobby.scss";
import "styles/ui/LobbyCode.scss"; //Copyfield of LobbyCode
import "styles/ui/Button.scss";
import BaseContainer from "../ui/BaseContainer";
import {Button, OverlayTrigger, Tooltip} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import React, {useEffect, useState} from "react";
import ActivePlayersList from "../ui/ActivePlayersList";
import LobbySettings from "../ui/LobbySettings";
import { FaCopy } from "react-icons/fa";

import {api} from "../../helpers/api";
import Cookies from "universal-cookie";
import {Spinner} from "../ui/Spinner";

const Lobby = () => {
  const cookies = new Cookies();
  const history = useHistory();
  const [showChat, setShowChat] = useState(false);
  const [currentLobby, setCurrentLobby] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);

/*  const toggleChat = () => {
    setShowChat(!showChat);
  };
*/
  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentLobby.code);
  };

  useEffect( () => {
    const getLobbyData = async () => {
      let playerIsInLobby = false;
      try {
        const response = await api.get('/lobbies/' + localStorage.getItem("code"), {headers: {'Authorization': 'Bearer ' + cookies.get("token")}});
        setCurrentLobby(response.data);
        //Check if player is the owner
        if(response.data.owner.uuid === cookies.get("token")){
          setIsAdmin(true);
        }
        //Check if player is in the lobby's player list
        response.data.players.forEach(player => {
          if(player.uuid === cookies.get("token")){
            playerIsInLobby = true;
          }
        })
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
      await api.delete('/lobbies/' + currentLobby.code + '/players', {headers: {'Authorization': 'Bearer ' + cookies.get("token")}});
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


  return (
      <Container>
        <Stack gap={3}>
          <Container>
            <Col>
              <h1 className="lobby title">Meme-It</h1>
              <p className="lobby subtitle"> The Meme Creation Game</p>
            </Col>
          </Container>
          <BaseContainer className="lobby container">
            { currentLobby.lobbySetting ?
            <Row>
              <Col>
                <h2 className="lobby player-title">Players</h2>
                <ActivePlayersList lobby={currentLobby} players={currentLobby.players}/>
              </Col>

              <Col
                  xs={1}
                  className="d-flex align-items-center justify-content-center"
              >
                <div className="vertical-line"></div>
              </Col>
              <Col>
                <h2 className="lobby player-title">Settings</h2>
                    <LobbySettings Lobby={currentLobby} isAdmin={isAdmin}/>
                <div className="lobby-code-container">
                  <h2 className="lobby-code-heading">Lobby Code:</h2>
                  <div className="lobby-code">
                    <span className="lobby-code-text">{currentLobby.code}</span>
                    <OverlayTrigger
                        placement="left"
                        delay={{ show: 250, hide: 400 }}
                        overlay={
                          <Tooltip id="button-tooltip">Copy to clipboard</Tooltip>
                        }
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
                <Button
                    width="200px"
                    onClick={() => leaveLobby("Disconnected")}
                    className="back-to-login-button"
                >
                  Leave Lobby
                </Button>
              </Col>
            </Row>
          </BaseContainer>
          <Row className={"d-flex align-items-center justify-content-center"}>
            <Button
                onClick={() =>{
                  localStorage.setItem("started", "true")
                  history.push("/game/1")
                }
                }
                className="lobby btn start"
            >
              Start Game
            </Button>
          </Row>
        </Stack>
      </Container>
  )
};

export default Lobby;
