import React, {useContext, useEffect, useMemo, useState} from "react";
import Draggable from "react-draggable";
import {Stack, Button, InputGroup} from "react-bootstrap";
import {v4 as uuid} from "uuid";
import {useParams, useHistory} from "react-router-dom";
import {Spinner} from "components/ui/Spinner";
import "styles/views/Game.scss";
import BaseContainer from "../ui/BaseContainer";
import {AppContext} from "context";
import TimerProgressBar from "components/ui/TimerProgressBar";
import {api} from "../../helpers/api";
import {game as gameEndpoint} from "../../helpers/endpoints"
import Chat from "../ui/Chat";
import Cookies from "universal-cookie";
import Form from "react-bootstrap/Form";

const Game = () => {
    const delay = 1000;
    const history = useHistory();
    const {id} = useParams();
    const {setGameData, loadedGameData, setLoadedGameData} = useContext(AppContext);
    const cookies = new Cookies();

    const [isSynchronizing, setIsSynchronizing] = useState(false)
    const [fontSize, setFontSize] = useState(14);
    const [color, setColor] = useState("#ffffff");
    const [backgroundColor, setBackgroundColor] = useState("#ffffff");
    const [opacity, setOpacity] = useState(1);
    const [currentRound, setCurrentRound] = useState(null);
    const [maxRound, setMaxRound] = useState(null);
    const [currentMeme, setCurrentMeme] = useState(null);
    const [now, setNow] = useState(null);
    const [currentTextNodePositions, setCurrentTextNodePositions] = useState([
        {
            xRate: 150,
            yRate: 150,
        },
    ]);
    const [currentTextNodeValues, setCurrentTextNodeValues] = useState([]);
    useEffect(async () => {
        let memeData;
        const [gameRes, templateRes] = await Promise.all([
            api.get(`${gameEndpoint}/${id}`, {
                headers: { 'Authorization': `Bearer ${cookies.get("token")}` },
            }),
            api.get(`${gameEndpoint}/${id}/template`, {
                headers: { 'Authorization': `Bearer ${cookies.get("token")}` },
            }),
        ]);
        memeData = {
            ...gameRes.data,
            meme: { ...templateRes.data }
        };

        let currentTime = new Date();
        let endTime = new Date(new Date(memeData.roundStartedAt).getTime() + memeData?.roundDuration * 1000);
        let roundedTimeLeft = Math.round((endTime-currentTime) / 1000) * 1000;

        if((memeData?.roundDuration * 1000)-(roundedTimeLeft) >= 0){
            setIsSynchronizing(false);
            setNow((memeData?.roundDuration * 1000)-(roundedTimeLeft))
        }else{
            setIsSynchronizing(true);
            setNow(memeData?.roundDuration * 1000)
        }

        setLoadedGameData(memeData);
        setGameData([]);
        setCurrentRound(memeData.currentRound);
        setCurrentMeme(memeData.meme?.imageUrl);
        setMaxRound(memeData.totalRounds);
    }, []);

    const memeTextNodes = useMemo(() => {
        return [...Array(currentMeme?.number_of_text_nodes).keys()].map(
            (item, i) => {
                return {
                    xRate: 0,
                    yRate: (i + 1) * 50,
                };
            }
        );
    }, [currentMeme]);

    const memeTextNodesDefaultValues = useMemo(() => {
        return memeTextNodes.map(() => "");
    }, [memeTextNodes]);

    useEffect(() => {
        setCurrentMeme(loadedGameData?.meme);
    }, [currentRound]);

    useEffect(() => {
        setCurrentTextNodePositions(memeTextNodes);
        setCurrentTextNodeValues(memeTextNodesDefaultValues);
    }, [currentMeme]);


    const addMemeTextNode = () => {
        const newNode = {xRate: 0, yRate: 100}
        const currentNodePositions = [...currentTextNodePositions];
        memeTextNodes.push(newNode);
        currentNodePositions.push(newNode);
        setCurrentTextNodePositions(currentNodePositions);
    }

    const removeMemeTextNode = () => {
        memeTextNodes.pop();
        const currentNodePositions = [...currentTextNodePositions];
        currentNodePositions.pop();
        setCurrentTextNodePositions(currentNodePositions);
    }

    useEffect( () => {
        const handleNextRound = async () => {
            const gameState = await api.get(`${gameEndpoint}/${id}`, {
                headers: { 'Authorization': `Bearer ${cookies.get("token")}` },
            });
            if(gameState.data.gameState !== "CREATION"){
                setNow(null);
                setCurrentRound(null);
                await submitMemesAtSameTime();
                await startVotingAtSameTime();
            } else {
                setIsSynchronizing(false);
            }
        };

        const interval = setInterval(async () => {
            await handleNextRound();
        }, 1000);
        return () => clearInterval(interval);
    });

    const handleTimer = () => {
        if (now < loadedGameData?.roundDuration * 1000) {
            setIsSynchronizing(false);
            setNow(now + 1000);
        }
    }

    const onTextNodeDrag = (e, data, i) => {
        let prevPositions = [...currentTextNodePositions];
        prevPositions[i] = {xRate: data.lastX, yRate: data.lastY};
        setCurrentTextNodePositions(prevPositions);
    };

    const onTextNodeChange = (e, i) => {
        let prevValues = [...currentTextNodeValues];
        prevValues[i] = e.target.value;
        setCurrentTextNodeValues(prevValues);
    };

    const handleGetDifferentTemplate = async () => {
        const response = await api.put(`${gameEndpoint}/${id}/template`,{}, {headers: {'Authorization': 'Bearer ' + cookies.get("token")}});
        localStorage.setItem("swap", localStorage.getItem("swap")-1);
        const copyObject = {...loadedGameData};
        copyObject.meme = response.data;
        setLoadedGameData(copyObject);
        setCurrentMeme(response.data);
    };

    const leaveGame = async () => {
        //const leaveResponse = await api.delete('/' + localStorage.getItem("code") + '/players', {name: JSON.stringify(localStorage.getItem("username"))});
        localStorage.clear()
        localStorage.clear()
        localStorage.setItem("alert", "Disconnected")
        cookies.remove("token")
        history.push("/")
    }
    const handleFontSizeChange = (event) => {
        setFontSize(event.target.value);
    };

    const handleColorChange = (event) => {
        setColor(event.target.value);
    };

    const handleBackgroundColorChange = (event) => {
        opacity === 100 ? setBackgroundColor(event.target.value) : setBackgroundColor(event.target.value+opacity);
    };

    const handleOpacityChange = (event) => {
        const newOpacity = parseFloat(event.target.value);
        setOpacity(newOpacity);

        let hashColor = backgroundColor.substring(0, 7); // Remove previous alpha value
        if(newOpacity === 0){
            hashColor += "00";
        }else if(newOpacity !== 100){
            hashColor += newOpacity;
        }
        setBackgroundColor(hashColor);
    };
    const submitMemesAtSameTime = async () => {
        //setIsSynchronizing(!isSynchronizing);
        // freeze all elements, no edits possible
        // submit all elements via api
        currentMeme && setGameData(
            {
                id: uuid(),
                currentTextNodeValues,
                currentTextNodePositions,
                currentMeme,
                currentRound,
                color,
                fontSize,
                maxRound
            }
        );
        const textBoxes = currentTextNodePositions.map((position, index) => ({
            ...position,
            text: currentTextNodeValues[index]
        }));
        const meme = {
            id: uuid(),
            textBoxes,
            currentMeme,
            color,
            fontSize,
        };
        const randomBuffer = new Uint32Array(1);
        window.crypto.getRandomValues(randomBuffer);
        let randomNumber = randomBuffer[0] / (0xffffffff + 1);
        //const loadDelay = new Date(ended.getTime() + (5 + randomNumber) * 1000);
        setTimeout(randomNumber * 100);
        await api.post(`${gameEndpoint}/${id}/meme/${loadedGameData?.meme?.id}`, meme, {headers: {'Authorization': 'Bearer ' + cookies.get("token")}});
    }

    const startVotingAtSameTime= (props) =>{
        setNow(null);
        props ? localStorage.setItem("alert", "There was an issue with your meme submission!") : localStorage.removeItem("alert");
        history.push("/game-rating/" + id);
    }

    return (
        <div className={"game content"}>
          <div className={"game card"}>
              {(loadedGameData !== null && loadedGameData !== undefined && currentRound !== null) ? (
            <BaseContainer className="game">
                <Button
                    width="200px"
                    onClick={leaveGame}
                    className="lobby leave-btn game"
                >
                    Leave Game
                </Button>
                <Stack gap={3} className="pt-5 container ">
                    <Stack gap={3} className={`pt-5  `}>
                        <h1 className="fw-bolder fs-3 text-start text-black">
                            {`Round ${currentRound}/${maxRound} `}
                        </h1>
                        <p className="fs-6 text-start text-black">
                            Drag the text nodes over the image
                        </p>
                        <TimerProgressBar
                            delay={delay}
                            now={now}
                            max={loadedGameData?.roundDuration * 1000}
                            callbackFunc={() => handleTimer()}
                            isPlaying={!isSynchronizing}
                        />
                    </Stack>
                    {currentMeme?.imageUrl ? (
                        <>
                            <div className="meme-content">
                                <div className={"drag-content"}>
                                    <img src={currentMeme?.imageUrl} alt={"meme lmao"}/>
                                    {memeTextNodes?.map((item, i) => (
                                            <Draggable
                                                key={i}
                                                bounds="parent"
                                                position={{
                                                    x: currentTextNodePositions?.[i]?.xRate,
                                                    y: currentTextNodePositions?.[i]?.yRate,
                                                }}
                                                onDrag={(e, data) => onTextNodeDrag(e, data, i)}
                                                disabled={isSynchronizing}
                                            >
                                          <textarea
                                              placeholder="TEXT HERE"
                                              value={currentTextNodeValues[i]}
                                              onChange={(e) => onTextNodeChange(e, i)}
                                              style={{fontSize: `${fontSize}px`, color: color, backgroundColor:backgroundColor}}
                                              disabled={isSynchronizing}
                                          />
                                        </Draggable>
                                    ))}
                                </div>

                            </div>
                            <div className={"game game-options"}>
                                <div className={"game game-options options-multirow"}>
                                    <InputGroup>
                                        <InputGroup.Text>Font size</InputGroup.Text>
                                        <Form.Control
                                            type={"number"}
                                            value={fontSize}
                                            min="10"
                                            max="48"
                                            step="1"
                                            onChange={handleFontSizeChange}
                                            disabled={isSynchronizing}
                                        />
                                    </InputGroup>
                                    <Button onClick={addMemeTextNode} disabled={isSynchronizing} className="game game-options-btn">
                                        Add new Text Node
                                    </Button>
                                </div>
                                <div className={"game game-options options-multirow"}>
                                    <InputGroup>
                                        <InputGroup.Text>Font color</InputGroup.Text>
                                        <Form.Control
                                            type="color"
                                            value={color}
                                            onChange={handleColorChange}
                                            disabled={isSynchronizing}
                                        />
                                    </InputGroup>
                                    <Button onClick={removeMemeTextNode} disabled={isSynchronizing} className="game game-options-btn" >
                                        Remove a Text Node
                                    </Button>
                                </div>
                                <div>
                                    <InputGroup>
                                        <InputGroup.Text>Background color</InputGroup.Text>
                                        <Form.Control
                                            type="color"
                                            value={backgroundColor}
                                            onChange={handleBackgroundColorChange}
                                            disabled={isSynchronizing}
                                        />
                                    </InputGroup>
                                    <InputGroup className={"game game-options options-row"}>
                                        <InputGroup.Text>Opacity</InputGroup.Text>
                                        <Form.Control
                                            type="range"
                                            min="0"
                                            max="100"
                                            step="10"
                                            value={opacity}
                                            onChange={handleOpacityChange}
                                            disabled={isSynchronizing}
                                        />
                                    </InputGroup>
                                </div>
                                <div className={"game game-options options-row"}>
                                    <Button
                                        className="game game-options-btn"
                                        onClick={handleGetDifferentTemplate}
                                        disabled={isSynchronizing || localStorage.getItem("swap") <= 0}
                                    >
                                        Get different template
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <Spinner/>
                    )}
                </Stack>
                <Chat currentLobby={loadedGameData} />
            </BaseContainer> ) : (<Spinner />)}
          </div>
        </div>
    );
};

export default Game;
