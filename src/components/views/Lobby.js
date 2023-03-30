import {Col, Container, Row, Stack} from "react-bootstrap";
import "styles/views/Lobby.scss";
import BaseContainer from "../ui/BaseContainer";

const Lobby = () => {

    return(
        <Container>
            <Stack gap={3}>
                <Container>
                    <h1 className="lobby title">Waiting for Game to Start</h1>
                </Container>
                <BaseContainer className="lobby container">
                    <Row>
                        <h2 className="lobby player-title">Players</h2>
                    </Row>
                    <Row>
                        <Col>
                            Player List Here (With players as PlayerList items)
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