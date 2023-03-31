import {Col, Container, Row, Stack} from "react-bootstrap";
import "styles/views/Lobby.scss";
import BaseContainer from "../ui/BaseContainer";
import {Button, OverlayTrigger, Tooltip} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import ActivePlayersList from '../ui/ActivePlayersList';
import LobbySettings from '../ui/LobbySettings';


const Lobby = () => {
    const activePlayers = [
    { id: 1, name: 'Alice', color: 'red' },
    { id: 2, name: 'Bob', color: 'green' },
    { id: 3, name: 'Charlie', color: 'blue' },
    { id: 4, name: 'Daniel', color: 'red' },
    { id: 5, name: 'Pablo', color: 'green' },
    { id: 6, name: 'Linda', color: 'pink' },
    ];
    const history = useHistory();
    const lobbyCode = "lobbytestcode";
    
    const copyToClipboard = () => {
        navigator.clipboard.writeText(lobbyCode);
    };
    
    return(
        <Container>
            <Stack gap={3}>
                <Container>

                <div class="text text-1">m</div><div 
                class="text text-2">e</div><div 
                class="text text-3">m</div><div 
                class="text text-4">e</div><div 
                class="text text-2">.</div><div 
                class="text text-1">i</div><div
                class="text text-3">t</div>
               
                </Container>
                <BaseContainer className="lobby container">
                    <Row>
                        <Col>
                            <h2 className="lobby player-title">Players</h2>
                            <ActivePlayersList players={activePlayers} />
                        </Col>
                        <Col xs={1} className="d-flex align-items-center justify-content-center">
                            <div className="vertical-line"></div>
                        </Col>
                        <Col>
                            <h2 className="lobby player-title">Settings</h2>
                            <LobbySettings />
                            <div className="lobby-code-container">
                                <div className="lobby-code-header">Lobby Code:</div>
                                <div className="d-flex align-items-center">
                                    <div className="lobby-code">{lobbyCode}</div>
                                    <OverlayTrigger
                                        placement="right"
                                        overlay={
                                            <Tooltip id="tooltip-copy">
                                                Copy to clipboard
                                            </Tooltip>
                                        }
                                    >
                                        <Button variant="light" onClick={copyToClipboard}>
                                            <i className="far fa-clipboard"></i>
                                        </Button>
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
                            className="leave-lobby-button"
                            >
                                Back to Login-Screen
                            </Button>
                        </Col>
                    </Row>
                </BaseContainer>
                <Row>
                    <Col xs={4}>
                    </Col>
                    <Col>
                        <Button
                            onClick={() => history.push(`/`)}
                            className="lobby btn start">
                            Start Game
                        </Button>
                        <Button
                            width="20%"
                            onClick={() => history.push(`/`)}
                            className="lobby btn leave">
                            Leave Lobby
                        </Button>
                    </Col>
                </Row>
            </Stack>
        </Container>
    )
}

export default Lobby;
