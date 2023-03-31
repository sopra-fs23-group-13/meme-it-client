import {Col, Container, Row, Stack} from "react-bootstrap";
import "styles/views/Lobby.scss";
import BaseContainer from "../ui/BaseContainer";
import {Button} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import ActivePlayersList from '../ui/ActivePlayersList';
import LobbyHeader from '../ui/LobbyHeader';
import LobbyCodeContainer from "../ui/LobbyCodeContainer";
import {FiCopy} from "react-icons/fi";


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
                    
                    </div>
                </div>
                    <h1 className="lobby title">Waiting for Game to Start</h1>
                </Container>
                <BaseContainer className="lobby container">
                    <div className="game-lobby"> <h2 className="lobby player-title">Players</h2> </div>
                    <Row>
                        <Col>
                            <ActivePlayersList players={activePlayers} />
                        </Col>
                        <Col xs={4}>
                            <Container className="lobby settings-container">
                                <Row> <h3 className="lobby settings-title">Settings</h3></Row>
                                <Row>
                                    Lobby Name: Test Lobby
                                </Row>
                                <Row>
                                    Number of Rounds: 5
                                </Row>
                                <Row>
                                    Number of Players: 8
                                </Row>
                                <Row>
                                    Voting Phase Time Limit: 180 seconds
                                </Row>
                            </Container>
                            <LobbyCodeContainer/>
                            <Button className="lobby btn copy"> <FiCopy/> Copy Lobby URL </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
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