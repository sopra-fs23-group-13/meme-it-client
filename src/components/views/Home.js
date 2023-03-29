import {useState} from 'react';
import "styles/views/Home.scss";
//import {useHistory} from "react-router-dom";
import LobbyList from "./LobbyList";
import {Col, Container, Row, Button, InputGroup, Form, Stack} from "react-bootstrap";

const Home = () => {
    //const history = useHistory();
    const [hash, setHash] = useState(null);
    const [username, setUsername] = useState(null);
    const [show, setShow] = useState(false);

    // Idea: Regardless of whether user joins using a Public Lobby Join button or a specific hash, if they press the
    // join button it always joins using the join hash method but in case of public lobby it just gets the lobby's hash
    // first.
    // Check if user has a name set in joinGame method.
    /*const joinHash = () => {
        if(!hash){
            //Popup: You need to enter a hash (should only happen if they try to join using hash code)
            return;
        }
        //Check if hash valid, otherwise show alert.
        history.push("/" + hash);
    }*/

    /*const joinGame = () => {
        if(!username){
            //Popup: You need to set a name
            return;
        }
        //do SetHash with the Hash of the Public Lobby
        //Do joinHash()
    }*/
    const lobbyList  = () => {
        return(
            <Container>
                <Row>
                    <Col>
                        <LobbyList />
                    </Col>
                </Row>
            </Container>

        )
    }
    const lobbyListText = () => {
        if(show){
            return "Close List"
        }
        return "View Games"
    }

    return (

        <Container>
            <Stack gap={3}>
            <Row>

                <Container>
                    <Row>
                        <Col sm>{/*placeholder*/}</Col>
                        <Col sm>
                            <Stack gap={3}>
                            <Row>
                                <Col>
                                    <h1>Meme-It</h1>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <InputGroup className="mb-3">
                                        <Form.Control
                                            aria-label="Username"
                                            aria-describedby="basic-addon2"
                                            placeholder="Enter Username"
                                            value={username}
                                            onChange={n => setUsername(n.target.value)}
                                        />
                                    </InputGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <InputGroup className="mb-3">
                                        <Form.Control
                                            placeholder="Game Hash"
                                            aria-label="Recipient's username"
                                            aria-describedby="basic-addon2"
                                            value={hash}
                                            onChange={n => setHash(n.target.value)}
                                        />
                                        <Button variant="outline-secondary" onClick={() => joinGame()}>
                                            Join Game
                                        </Button>
                                    </InputGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Button className={"home buttons"}> Create Lobby</Button>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Button className={"home buttons"} onClick={() => setShow(!show)} >{lobbyListText()}</Button>
                                </Col>
                            </Row>
                            </Stack>
                        </Col>
                        <Col sm>{/*placeholder*/}</Col>
                    </Row>
                </Container>
            </Row>
            <Row>
                <Col>
                    {show && lobbyList()}
                </Col>
            </Row>
            <Row>
                <Col>
                    <p className = "home tutorial-title">How To Play</p>
                    <div className ="home tutorial-text">
                        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
                    </div>
                </Col>
            </Row>
            </Stack>
        </Container>
    )
}

export default Home;