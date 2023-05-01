import React, {useState} from 'react';
import "styles/views/Home.scss";
import LobbyList from "./LobbyList";
import {Col, Container, Row, Button, Stack} from "react-bootstrap";
import {FormField} from "../../helpers/formField";
import UsernameModal from "./UsernameModal";
import {useHistory} from "react-router-dom";
import {Notification} from "../ui/Notification";
import {AnimatedBackground} from "styles/images/AnimatedBackground"


const Home = () => {
    const history = useHistory();
    const [gameCode, setGameCode] = useState("");
    const [showAlert, setShowAlert] = useState(sessionStorage.getItem("alert") === null ? false : true);
    const [show, setShow] = useState(false);

    const toggleShowAlert = () => setShowAlert(!showAlert);

    const lobbyList = () => {
        return (
            <Container>
                <Row>
                    <Col>
                        <LobbyList action={joinExistingGame}/>
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
        <div className={"animationContentProperties"}>
            <AnimatedBackground/>
            <div className={"home alert"}>
                <Notification reason={sessionStorage.getItem("alert")}
                              showAlert={showAlert}
                              toggleShowAlert={toggleShowAlert}
                />
            </div>
            <Container className={"home content"}>
                <div className={"home card"}>
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
                                                    <UsernameModal c_names={"home buttons join"} title={"Create Lobby"}
                                                                   submit={createNewGame}/>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <Button className={"home buttons join"}
                                                            onClick={() => setShow(!show)}>{show ? "Close List" : "Show Games"}</Button>
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
                                <p className="home tutorial-title">How To Play</p>
                                <div className="home tutorial-text">
                                In Meme-it, players are given a random meme image and must come up with a 
                                funny caption or text for it within a set time. After everyone shares 
                                their memes, players vote for their favorite and the player with the 
                                most votes wins. The game rules require that captions must be appropriate 
                                and original, and voting should be fair. To be successful, players should keep
                                 it funny and use current events or pop culture references to make their memes 
                                 more relatable. Have fun and may the funniest player win!
                                </div>
                            </Col>
                        </Row>
                    </Stack>
                </div>
            </Container>
        </div>
    )
}

export default Home;