import { Col, Container, Row, Stack } from "react-bootstrap";
import "styles/views/Lobby.scss";
import "styles/ui/LobbyCode.scss";
import "styles/ui/Button.scss";
import BaseContainer from "../ui/BaseContainer";
import { Button, OverlayTrigger, Tooltip, Accordion, Card } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import ActivePlayersList from "../ui/ActivePlayersList";
import LobbySettings from "../ui/LobbySettings";
import { FaCopy } from "react-icons/fa"; //symbol für kopieren einbinden

const Lobby = () => {
  const activePlayers = [
    { id: 1, name: "Alice", color: "red" },
    { id: 2, name: "Bob", color: "green" },
    { id: 3, name: "Charlie", color: "blue" },
    { id: 4, name: "Daniel", color: "red" },
    { id: 5, name: "Pablo", color: "green" },
    { id: 6, name: "Linda", color: "pink" },
  ];
  const history = useHistory();
  const lobbyCode = "lobbytestcode";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(lobbyCode);
  };

  return (
    <Container>
      <Stack gap={3}>
        <Container>
          <div className="text text-1">m</div>
          <div className="text text-2">e</div>
          <div className="text text-3">m</div>
          <div className="text text-4">e</div>
          <div className="text text-2">.</div>
          <div className="text text-1">i</div>
          <div className="text text-3">t</div>
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
                    overlay={<Tooltip id="button-tooltip">Copy to clipboard</Tooltip>}
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