import {Col, Container, Row, Stack} from "react-bootstrap";
import "styles/views/Lobby.scss";
import BaseContainer from "../ui/BaseContainer";
import {Button} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import ActivePlayersList from '../ui/ActivePlayersList';
import LobbyHeader from '../ui/LobbyHeader';


const Lobby = () => {


    const activePlayers = [
        { id: 1, name: 'Alice', color: 'red' },
        { id: 2, name: 'Bob', color: 'green' },
        { id: 3, name: 'Charlie', color: 'blue' },
        { id: 1, name: 'Alice', color: 'red' },
        { id: 2, name: 'Bob', color: 'green' },
        { id: 3, name: 'Charlie', color: 'blue' },
      ];
    const history = useHistory();

    return(
        <Container>
            <Stack gap={3}>
                <Container>
                <div className="lobby-container">
                    <div className="header">
                    <LobbyHeader lobbyName="My Awesome Lobby" />
                    </div>
                </div>

                    <h1 className="lobby title">Waiting for Game to Start</h1>
                </Container>
                <BaseContainer className="lobby container">
                    <Row>
                    </Row>
                    <div className="game-lobby">
                    <h2 className="lobby player-title">Players</h2>
                    <ActivePlayersList players={activePlayers} />
                    </div>
                    <Row>
                        <Col>
                            <Button
                            width="100%"
                            onClick={() => history.push(`/login`)}
                            className="leave-lobby-button"
            >
                            Back to Login-Screen
                            </Button>
                        </Col>
                        <Col xs={4}>
                            <Container className="lobby settings-container">
                                <Row> <h3 className="lobby settings-title">Settings</h3></Row>
                                <Row>
                                    Lobby Name: Test etc
                                </Row>
                            </Container>
                        </Col>
                    </Row>
                </BaseContainer>
            </Stack>
        </Container>

    )
}

export default Lobby;