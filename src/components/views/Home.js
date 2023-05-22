import React, {useState} from 'react';
import "styles/views/Home.scss";
import LobbyList from "./LobbyList";
import {Col, Container, Row, Button, Stack} from "react-bootstrap";
import {FormField} from "../../helpers/formField";
import UsernameModal from "./UsernameModal";
import {useHistory} from "react-router-dom";
import {Notification} from "../ui/Notification";
import {AnimatedBackground} from "styles/images/AnimatedBackground"
import Cookies from "universal-cookie";
import Tutorial from "../ui/Tutorial";


const Home = () => {
    const history = useHistory();
    const [gameCode, setGameCode] = useState("");
    const [showAlert, setShowAlert] = useState(localStorage.getItem("alert") !== null);
    const [show, setShow] = useState(false);
    const cookies = new Cookies();
    cookies.remove("token");

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
        if (localStorage.getItem("code") !== null) {
            history.replace("/lobby");
        }
        setGameCode(event.target.value);
    };

    const joinExistingGame = async () => {
        if (gameCode != null) {
            localStorage.setItem("code", gameCode);
            //const joinResponse = await api.post('/' + gameValues.code + '/players', {name: JSON.stringify(localStorage.getItem("username"))});
        }
        history.replace("/lobby");
    }

    const checkShowGames = () =>{
        if(localStorage.getItem("code") !== null) {
            localStorage.setItem("alert", "You were forwarded to your lobby");
            history.replace("/lobby");
        } else {
            setShow(!show);
        }
    }

    return (
        <div className={"animationContentProperties"}>
            <AnimatedBackground/>
            <div className={"home alert"}>
                <Notification reason={localStorage.getItem("alert")}
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
                                                    <UsernameModal c_names={"home buttons join"} title={"Create Lobby"} />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <Button className={"home buttons join"}
                                                            onClick={checkShowGames}>{show ? "Close List" : "Show Games"}</Button>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <Tutorial />
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
                            </Col>
                        </Row>
                    </Stack>
                </div>
            </Container>
        </div>
    )
}

export default Home;