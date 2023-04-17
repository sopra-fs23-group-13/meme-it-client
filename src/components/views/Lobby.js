import { Col, Container, Row, Stack } from "react-bootstrap";
import "styles/views/Lobby.scss";
import "styles/ui/LobbyCode.scss"; //Copyfield of LobbyCode
import "styles/ui/Button.scss";
import BaseContainer from "../ui/BaseContainer";
import {Button, OverlayTrigger, Tooltip, Accordion, Card} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import React, {useEffect, useState} from "react";
import ActivePlayersList from "../ui/ActivePlayersList";
import LobbySettings from "../ui/LobbySettings";
import { FaCopy } from "react-icons/fa"; 

import MockData from '../../mockData/lobbyScreenDataMock.json'
import {api} from "../../helpers/api";
import PropTypes from "prop-types";

const Lobby = () => {
  const activePlayers = MockData
  const history = useHistory();
  const [showChat, setShowChat] = useState(false);
  const [currentLobby, setCurrentLobby] = useState({});

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentLobby.code);
  };


  useEffect( () => {
    const getLobbyData = async () => {
      let validCode = false;
      try {
        const response = await api.get('/lobby');
        for(let i = 0; i < response.data.length; i++){
          if(response.data[i].code === localStorage.getItem("hash")){
            setCurrentLobby(response.data[i]);
            validCode = true;

          }
        }
        if(!validCode){
          leaveLobby();
        }
      }
      catch (error){
        console.log(error);
      }
    }
    const interval = setInterval(() => {
      getLobbyData();
    }, 500);
    return () => clearInterval(interval);
  })
  const leaveLobby = async () => {
    //const leaveResponse = await api.delete('/' + localStorage.getItem("hash") + '/players', {name: JSON.stringify(localStorage.getItem("username"))});
    localStorage.clear();
    history.push("/");
  }


  let isAdmin = currentLobby.owner === localStorage.getItem("username")? true : false;

  if (isAdmin){
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
              <Row>
                <Col>
                  <h2 className="lobby player-title">Players</h2>
                  <ActivePlayersList players={activePlayers} />
                </Col>

                <Col
                    xs={1}
                    className="d-flex align-items-center justify-content-center"
                >
                  <div className="vertical-line"></div>
                </Col>
                <Col>
                  <h2 className="lobby player-title">Settings</h2>
                  <LobbySettings Lobby={currentLobby} isAdmin={true}/>
                  <div className="lobby-code-container">
                    <h2 className="lobby-code-heading">Lobby Code:</h2>
                    <div className="lobby-code">
                      <span className="lobby-code-text">{currentLobby.code}</span>
                      <OverlayTrigger
                          placement="left"
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
              <Row>
                <Col>
                  <Button
                      width="200px"
                      onClick={leaveLobby}
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
  }
    else {
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
                  <Row>
                    <Col>
                      <h2 className="lobby player-title">Players</h2>
                      <ActivePlayersList players={activePlayers} />
                    </Col>

                    <Col
                        xs={1}
                        className="d-flex align-items-center justify-content-center"
                    >
                      <div className="vertical-line"></div>
                    </Col>
                    <Col>
                      <h2 className="lobby player-title">Settings</h2>
                      <LobbySettings Lobby={currentLobby} isAdmin={false}/>
                      <div className="lobby-code-container">
                        <h2 className="lobby-code-heading">Lobby Code:</h2>
                        <div className="lobby-code">
                          <span className="lobby-code-text">{currentLobby.code}</span>
                          <OverlayTrigger
                              placement="left"
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
                  <Row>
                    <Col>
                      <Button
                          width="200px"
                          onClick={leaveLobby}
                          className="back-to-login-button"
                      >
                        Leave Lobby
                      </Button>
                    </Col>
                  </Row>
                </BaseContainer>
              </Stack>
            </Container>
        )
    }

};

export default Lobby;
