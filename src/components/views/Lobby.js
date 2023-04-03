import { Col, Container, Row, Stack } from "react-bootstrap";
import "styles/views/Lobby.scss";
import "styles/ui/LobbyCode.scss"; //Copyfield of LobbyCode
import "styles/ui/Button.scss";
import BaseContainer from "../ui/BaseContainer";
import {Button, OverlayTrigger, Tooltip, Accordion, Card} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import ActivePlayersList from "../ui/ActivePlayersList";
import LobbySettings from "../ui/LobbySettings";
import { FaCopy } from "react-icons/fa"; 

import MockData from '../../mockData/lobbyScreenDataMock.json'

const Lobby = () => {
  const activePlayers = MockData
  const history = useHistory();
  const lobbyCode = "lobbytestcode";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(lobbyCode);
  };

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
              <LobbySettings />
              <div className="lobby-code-container">
                <h2 className="lobby-code-heading">Lobby Code:</h2>
                <div className="lobby-code">
                  <span className="lobby-code-text">{lobbyCode}</span>
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
                onClick={() => history.push(`/login`)}
                className="back-to-login-button"
              >
                Back to Login-Screen
              </Button>
            </Col>
          </Row>
        </BaseContainer>
        <Row>
          <Col xs={4}></Col>
          <Col>
            <Button
              onClick={() => history.push(`/`)}
              className="lobby btn start"
            >
              Start Game
            </Button>
            <Button
              width="20%"
              onClick={() => history.push(`/`)}
              className="lobby btn leave"
            >
              Leave Lobby
            </Button>
          </Col>
        </Row>
      </Stack>
    </Container>
  );
};

export default Lobby;
