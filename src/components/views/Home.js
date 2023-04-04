import React, {useState} from 'react';
import "styles/views/Home.scss";
//import {useHistory} from "react-router-dom";
import LobbyList from "./LobbyList";
import {Col, Container, Row, Button, Stack} from "react-bootstrap";
import {FormField} from "../../helpers/formField";
import UsernameModal from "./UsernameModal";

const Home = () => {
    //const history = useHistory();
    const [gameValues, setGameValues] = useState({ hash: "", username: ""});

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
        const { name, value } = event.target;
        setGameValues((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const createNewGame = (lobbyValues) => {
        console.log(lobbyValues);
    }

    const joinExistingGame = (userValues) => {
        console.log(userValues);
        if(!gameValues.username){
            //return;
        }
        //do SetHash with the Hash of the Public Lobby
        //Do joinHash()
    }

    return (

        <Container className={"home content"}>
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
                                        placeholder="Game Hash"
                                        value={gameValues.hash}
                                        name="hash"
                                        label="Game Hash"
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