import React, {useState} from 'react';
import "styles/views/Home.scss";
import LobbyList from "./LobbyList";
import {Col, Container, Row, Button, Stack} from "react-bootstrap";
import {FormField} from "../../helpers/formField";
import UsernameModal from "./UsernameModal";
import {useHistory} from "react-router-dom";
import {Notification} from "../ui/Notification";
import {AnimatedBackground} from "styles/images/AnimatedBackground"


const TutorialButton = ({startTutorialMode}) => {
    return (
      <>
        <Button variant="primary" className="tutorial-btn" onClick={startTutorialMode}>
          Tutorial
        </Button>
  
        <div className="tutorial-container">
          <div className="tutorial-modal">
            <h1 className="tutorial-title">Welcome to the Meme-It tutorial!</h1>
            <p className="tutorial-text">In this tutorial, you will learn how to play Meme-It and create hilarious memes with your friends.</p>
            <div className="tutorial-buttons">
              <Button className="tutorial-next" variant="primary" onClick={showNextElement}>Next</Button>
              <Button className="tutorial-end" variant="secondary" onClick={endTutorialMode}>End Tutorial</Button>
            </div>
          </div>
        </div>
      </>
    );
  };
  
  
  const Home = () => {
    const history = useHistory();
    const [gameCode, setGameCode] = useState("");
    const [showAlert, setShowAlert] = useState(sessionStorage.getItem("alert") === null ? false : true);
    const [show, setShow] = useState(false);
  
    // state to keep track of tutorial mode
    const [highlightIndex, setHighlightIndex] = useState(0);
    const [showTutorial, setShowTutorial] = useState(false);
  
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
    };
  
    const handleChange = (event) => {
      setGameCode(event.target.value);
    };
  
    const createNewGame = (lobbyValues) => {
      console.log(lobbyValues);
    };

    const joinExistingGame = async () => {
        if (gameCode != null) {
            localStorage.setItem("code", gameCode);
            //const joinResponse = await api.post('/' + gameValues.code + '/players', {name: JSON.stringify(localStorage.getItem("username"))});
        }
        history.push("/lobby");
    }

    // data for tutorial mode
    const tutorialData = [
        {
          element: ".home.join-btn input",
          message: "With this field you are able to join an existing lobby."
        },
        {
          element: ".home.buttons.join.username-modal-btn",
          message: "Click here to create a new lobby."
        }
        // add more tutorial data as needed (coming soon)
      ];

    // function to start the tutorial mode
    const startTutorialMode = () => {
        setShowTutorial(true);
        setHighlightIndex(0);
    };

    // function to show the next highlighted element in the tutorial mode
    const showNextElement = () => {
        if (highlightIndex < tutorialData.length - 1) {
          setHighlightIndex(highlightIndex => highlightIndex + 1);
          showTutorialElement();
        } else {
          endTutorialMode();
        }
      };


    // function to show tutorial message and highlight element
    const showTutorialElement = () => {
        // get current tutorial data
        const currentTutorialData = tutorialData[highlightIndex];
        // get highlighted element
        const elementToHighlight = document.querySelector(currentTutorialData.element);
        // create highlight box
        const highlightBox = document.createElement("div");
        highlightBox.classList.add("tutorial-element-highlight-box");
        // set highlight box size and position
        const elementRect = elementToHighlight.getBoundingClientRect();
        highlightBox.style.width = elementRect.width + "px";
        highlightBox.style.height = elementRect.height + "px";
        highlightBox.style.top = elementRect.top + window.pageYOffset + "px";
        highlightBox.style.left = elementRect.left + window.pageXOffset + "px";
        // create message box
        const messageBox = document.createElement("div");
        messageBox.classList.add("tutorial-message-box");
        // set message box text
        const messageText = document.createTextNode(currentTutorialData.message);
        messageBox.appendChild(messageText);
        // add highlight box and message box to tutorial container
        const tutorialContainer = document.querySelector(".tutorial-container");
        tutorialContainer.appendChild(highlightBox);
        tutorialContainer.appendChild(messageBox);
        // add click event listener to next button
        const nextButton = document.querySelector(".tutorial-next");
        nextButton.addEventListener("click", () => {
          // remove highlight box and message box
          highlightBox.remove();
          messageBox.remove();
          // show next tutorial element
          showNextElement();
        });
      };
      


    // function to end the tutorial mode
    const endTutorialMode = () => {
        setShowTutorial(false);
        setHighlightIndex(0);
      };
      


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
                                            {/* add tutorial button */}
                                            <Row>
                                                <Col>
                                                <TutorialButton startTutorialMode={startTutorialMode} />
                                                </Col>
                                            </Row>
                                        </Stack>
                                    </Col>
                                </Row>
                            </Container>
                        </Row>
                    </Stack>
                    {/* add lobby list */}
                    {show ? lobbyList() : null}
                </div>
            </Container>
            {/* add tutorial mode */}
            {showTutorial && (
    <div className="tutorial-mode">
        <div className="tutorial-overlay" onClick={() => endTutorialMode()}></div>
        <div className="tutorial-container">
            <div className="tutorial-message">{tutorialData[highlightIndex].message}</div>
            <div className="tutorial-element-highlight" data-tutorial-index={highlightIndex}
                data-tutorial-element={tutorialData[highlightIndex].element}></div>
            <div className="tutorial-next" onClick={() => showNextElement()}>
                {highlightIndex < tutorialData.length - 1 ? "Next..." : "End tutorial"}
            </div>
        </div>
    </div>
    )}
            
    </div>
    );
    
    };
    
    export default Home;
