import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {Carousel} from "react-bootstrap";
import Home from '../../images/home.png';
import ShowGames from '../../images/ShowGames.png';
import JoinGame from '../../images/JoinGame.png';
import AdminView from '../../images/AdminView.png';
import MemeCreation from '../../images/MemeCreation.png';
import MemeRating from '../../images/MemeRating.png';
import GameResults from '../../images/GameResults.png';
import GameWinner from '../../images/GameWinner.png';
const Tutorial = () => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const style = {color: "#000000", backgroundColor: "#F47A7799", borderRadius: "10px"}

    return (
        <>
            <Button variant="primary" className={"home buttons join"} onClick={handleShow}>
                How To Play
            </Button>

            <Modal show={show} onHide={handleClose} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>How To Play</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{padding: "0px"}}>

                    <Carousel>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src={Home}
                                alt="First slide"
                            />
                            <Carousel.Caption>
                                <h3>Welcome to the Tutorial</h3>
                                <p style={style}>The following slides will inform you about the game and the how to play</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src={ShowGames}
                                alt="Second slide"
                            />

                            <Carousel.Caption>
                                <p style={style}>By clicking onto "Show Games" you are able to see the currently public games, to join one. It is also possible to you a game directly with a valid lobby-code or even to create a lobby yourself.</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src={JoinGame}
                                alt="Third slide"
                            />

                            <Carousel.Caption>
                                <p style={style}>
                                    Once you try to enter a game, you will have to enter your username to join.
                                </p>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src={AdminView}
                                alt="Third slide"
                            />

                            <Carousel.Caption>
                                <p style={style}>
                                    If you are creating a new game you will see the Admin View, where you can adjust the game settings to your preferences. As a user you will only see the middle values as read only. But of course you can chat with your lobby mates and ask them to change some settings.
                                </p>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src={MemeCreation}
                                alt="Fourth slide"
                            />

                            <Carousel.Caption>
                                <p style={style}>
                                    Once the game starts you are in the Game Creation View where you can modify your assigned meme to your preferences. You can enter text, drag it to the correct location, adjust the font color or the background. Once the time is up, the meme is automatically submitted and you are redirected to the rating phase. The borders indicate the textbox, but will disappear once the meme is submitted.
                                </p>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src={MemeRating}
                                alt="Fifth slide"
                            />

                            <Carousel.Caption>
                                <p style={style}>
                                    The meme rating shows a carousel with all the submitted memes. The voting happens individually and the votes will in the end of the round be added up.
                                </p>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src={GameResults}
                                alt="Sixth slide"
                            />

                            <Carousel.Caption>
                                <p style={style}>
                                    The Results will be shown per round. It shows the performance of the memes, all the submitted memes and how made which one. The very best meme of the round is also shown again. After a short period of time, the next round will start.
                                </p>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src={GameWinner}
                                alt="Seventh slide"
                            />

                            <Carousel.Caption>
                                <p style={style}>
                                    Once the game is completed the final results are shown and celebrated by confetti. From this view you can leave the game and will get back to the main page.
                                </p>
                            </Carousel.Caption>
                        </Carousel.Item>
                    </Carousel>

                </Modal.Body>
            </Modal>
        </>
    );
};

export default Tutorial;
