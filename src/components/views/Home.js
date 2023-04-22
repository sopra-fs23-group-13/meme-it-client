import React, {useState} from 'react';
import "styles/views/Home.scss";
import LobbyList from "./LobbyList";
import {Col, Container, Row, Button, Stack, Toast} from "react-bootstrap";
import {FormField} from "../../helpers/formField";
import UsernameModal from "./UsernameModal";
import {useHistory} from "react-router-dom";
import {IoMdAlert} from "react-icons/io";
import {Notification} from "../ui/Notification";


const Home = () => {
    const history = useHistory();
    const [gameCode, setGameCode] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [show, setShow] = useState(false);

    const toggleShowAlert = () => setShowAlert(!showAlert);

    const lobbyList  = () => {
        return(
            <Container>
                <Row>
                    <Col>
                        <LobbyList action={joinExistingGame} />
                    </Col>
                </Row>
            </Container>
        )
    }

    const handleChange = (event) => {
        setGameCode(event.target.value);
    };

    const createNewGame = (lobbyValues) => {
        console.log(lobbyValues);
    }

    const joinExistingGame = async () => {
        if (gameCode != null) {
            localStorage.setItem("code", gameCode);
            //const joinResponse = await api.post('/' + gameValues.code + '/players', {name: JSON.stringify(localStorage.getItem("username"))});
        }
        history.push("/lobby");
    }
    return (
        <Container className={"home content"}>
            <div className={"home alert"}>
            <Notification reason={sessionStorage.getItem("alert")}
                          showAlert={showAlert}
                          toggleShowAlert={toggleShowAlert}
            />
            </div>
            <Stack gap={3}>
            <Row>
                <Container>
                    <Row>
                        <Col sm>{/*placeholder*/}</Col>
                        <Col sm>
                            <Stack gap={3}>
                            <Row>
                                <Col>
                                    <h1 className="home title">Meme-It</h1>
                                    <p className="home subtitle"> The Meme Creation Game</p>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <FormField
                                        placeholder="Game Code"
                                        code={gameCode}
                                        name="code"
                                        label="Game Code"
                                        action={joinExistingGame}
                                        onChange={handleChange}
                                        c_names="home join-btn"
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <UsernameModal c_names={"home buttons"} title={"Create Lobby"} submit={createNewGame} />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Button className={"home buttons"} onClick={() => setShow(!show)} >{show ? "Close List" : "Show Games"}</Button>
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