import React, {useContext, useRef, useEffect, useMemo, useState} from "react";
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
import DraggableResizableInput from "../ui/DraggableInput";
import LoadingScreen from "../ui/LoadingScreen";

const Game = () => {
    const delay = 1000;
    const history = useHistory();
    const {id} = useParams();
    const {setGameData, loadedGameData, setLoadedGameData} = useContext(AppContext);
    const cookies = new Cookies();

    const [isSynchronizing, setIsSynchronizing] = useState(false)
    const [color, setColor] = useState("#ffffff");
    const [backgroundColor, setBackgroundColor] = useState("#ffffff");
    const [opacity, setOpacity] = useState(100);
    const [currentRound, setCurrentRound] = useState(null);
    const [maxRound, setMaxRound] = useState(null);
    const [currentMeme, setCurrentMeme] = useState(null);
    const [now, setNow] = useState(null);
    const [dimensions, setDimensions] = useState({ width: 'auto', height: 'auto' });
    const imageRef = useRef();
    const [currentTextNodePositions, setCurrentTextNodePositions] = useState([
        {
            xRate: 0,
            yRate: 100,
            dimension: {width: 200, height: 50}
        },
    ]);
    const [currentTextNodeValues, setCurrentTextNodeValues] = useState([""]);
    useEffect(async () => {
        let memeData;
        const [gameRes, templateRes] = await Promise.all([
            api.get(`${gameEndpoint}/${id}`, {
                headers: {'Authorization': `Bearer ${cookies.get("token")}`},
            }),
            api.get(`${gameEndpoint}/${id}/template`, {
                headers: {'Authorization': `Bearer ${cookies.get("token")}`},
            }),
        ]);
        if (localStorage.getItem("memeData") !== undefined && localStorage.getItem("memeData") !== null) {
            memeData = {
                ...gameRes.data,
                meme: {...JSON.parse(localStorage.getItem("memeData"))}
            };
        } else {
            memeData = {
                ...gameRes.data,
                meme: {...templateRes.data}
            };
            localStorage.setItem("memeData", JSON.stringify(templateRes.data));
            console.log(templateRes.data)
            console.log(gameRes.data)
        }

        let currentTime = new Date();
        let endTime = new Date(new Date(memeData.roundStartedAt).getTime() + memeData?.roundDuration * 1000);
        let roundedTimeLeft = Math.round((endTime - currentTime) / 1000) * 1000;

        if ((memeData?.roundDuration * 1000) - (roundedTimeLeft) >= 0) {
            setIsSynchronizing(false);
            setNow((memeData?.roundDuration * 1000) - (roundedTimeLeft))
        } else {
            setIsSynchronizing(true);
            setNow(memeData?.roundDuration * 1000)
        }

        setLoadedGameData(memeData);
        setGameData([]);
        setCurrentRound(memeData.currentRound);
        setCurrentMeme(memeData.meme);
        setMaxRound(memeData.totalRounds);
    }, []);



    useEffect(() => {
        setCurrentMeme(loadedGameData?.meme);
    }, [currentRound]);


    const addMemeTextNode = () => {
        const newNode = {xRate: 0, yRate: 0, dimension: {width: 200, height: 50}}
        const currentNodeValues = [...currentTextNodeValues]
        const currentNodePositions = [...currentTextNodePositions];
        currentNodeValues.push('');
        currentNodePositions.push(newNode);
        setCurrentTextNodePositions(currentNodePositions);
        setCurrentTextNodeValues(currentNodeValues);
    }

    const removeMemeTextNode = () => {
        const currentNodeValues = [...currentTextNodeValues];
        const currentNodePositions = [...currentTextNodePositions];
        currentNodePositions.pop();
        currentNodeValues.pop();
        console.log(currentNodeValues)
        console.log(currentNodePositions)
        setCurrentTextNodeValues(currentNodeValues)
        setCurrentTextNodePositions(currentNodePositions);
    }

    useEffect(() => {
        const handleNextRound = async () => {
            const gameState = await api.get(`${gameEndpoint}/${id}`, {
                headers: {'Authorization': `Bearer ${cookies.get("token")}`},
            });
            if (gameState.data.gameState !== "CREATION") {
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
        prevPositions[i].xRate = data.lastX
        prevPositions[i].yRate = data.lastY;
        setCurrentTextNodePositions(prevPositions);
    };

    const onTextNodeChange = (e, i) => {
        let prevValues = [...currentTextNodeValues];
        prevValues[i] = e.target.value;
        setCurrentTextNodeValues(prevValues);
    };

    const onTextNodeDimensionChange = (e, i, data) => {
        let prevPositions = [...currentTextNodePositions];
        prevPositions[i.id].dimension = {width: data.width, height: data.height};
        setCurrentTextNodePositions(prevPositions);
    }

    const handleGetDifferentTemplate = async () => {
        const response = await api.put(`${gameEndpoint}/${id}/template`, {}, {headers: {'Authorization': 'Bearer ' + cookies.get("token")}});
        localStorage.setItem("swap", localStorage.getItem("swap") - 1);
        localStorage.setItem("memeData", JSON.stringify(response.data));
        const copyObject = {...loadedGameData};
        copyObject.meme = response.data;
        setLoadedGameData(copyObject);
        setCurrentMeme(response.data);
        handleImageLoad();
    };

    const leaveGame = async () => {
        //const leaveResponse = await api.delete('/' + localStorage.getItem("code") + '/players', {name: JSON.stringify(localStorage.getItem("username"))});
        localStorage.clear()
        localStorage.setItem("alert", "Disconnected")
        cookies.remove("token")
        history.replace("/")
    }
    const handleFontSizeChange = (e, i, data) => {
        let prevPositions = [...currentTextNodePositions];
        prevPositions[i.id].fontSize = data;
        setCurrentTextNodePositions(prevPositions);
    };

    const handleColorChange = (event) => {
        setColor(event.target.value);
    };

    const handleBackgroundColorChange = (event) => {
        opacity === 100 ? setBackgroundColor(event.target.value) : setBackgroundColor(event.target.value + opacity);
    };

    const handleOpacityChange = (event) => {
        const newOpacity = parseFloat(event.target.value);
        setOpacity(newOpacity);

        let hashColor = backgroundColor.substring(0, 7); // Remove previous alpha value
        if (newOpacity === 0) {
            hashColor += "00";
        } else if (newOpacity !== 100) {
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
                backgroundColor,
                maxRound
            }
        );
        const textBoxes = currentTextNodePositions.map((position, index) => ({
            ...position,
            width: position.dimension ? position.dimension.width : 200,
            height: position.dimension ? position.dimension.height : 50,
            fontSize: position.fontSize ? position.fontSize : 16,
            text: currentTextNodeValues[index]
        }));
        const meme = {
            id: uuid(),
            textBoxes,
            currentMeme,
            color,
            backgroundColor,
        };
        const randomBuffer = new Uint32Array(1);
        window.crypto.getRandomValues(randomBuffer);
        let randomNumber = randomBuffer[0] / (0xffffffff + 1);
        //const loadDelay = new Date(ended.getTime() + (5 + randomNumber) * 1000);
        setTimeout(randomNumber * 100);
        console.log(meme)
        await api.post(`${gameEndpoint}/${id}/meme/${loadedGameData?.meme?.id}`, meme, {headers: {'Authorization': 'Bearer ' + cookies.get("token")}});
    }

    const startVotingAtSameTime = (props) => {
        setNow(null);
        props ? localStorage.setItem("alert", "There was an issue with your meme submission!") : localStorage.removeItem("alert");
        localStorage.removeItem("memeData");
        history.replace("/game-rating/" + id);
    }
    const handleImageLoad = () => {
        setDimensions({
            width: imageRef.current.offsetWidth,
            height: imageRef.current.offsetHeight
        });
    };

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
                                        <div className={"drag-content"}  style={dimensions}>
                                            <img src={currentMeme?.imageUrl} alt={"meme lmao"} ref={imageRef} onLoad={handleImageLoad}/>
                                            {currentTextNodeValues?.map((item, i) => (
                                                <DraggableResizableInput
                                                    key={i}
                                                    index={i}
                                                    inputValue={currentTextNodeValues[i]}
                                                    handleFontSizeChange={handleFontSizeChange}
                                                    onInputChange={(e) => onTextNodeChange(e, i)}
                                                    onTextNodeDrag={(e, data) => onTextNodeDrag(e, data, i)}
                                                    setPropDim={onTextNodeDimensionChange}
                                                    color={color}
                                                    backgroundColor={backgroundColor}
                                                    maxDimension={400}
                                                    imageWidth={dimensions.width}
                                                    position={{
                                                        x: currentTextNodePositions?.[i]?.xRate,
                                                        y: currentTextNodePositions?.[i]?.yRate,
                                                    }}
                                                    isSynchronizing={isSynchronizing}
                                                />
                                            ))}
                                        </div>

                                    </div>
                                    <div className={"game game-options"}>
                                        <div className={"game game-options options-multirow"}>
                                            <Button onClick={addMemeTextNode} disabled={isSynchronizing}
                                                    className="game game-options-btn">
                                                Add new Text Node
                                            </Button>
                                            <Button onClick={removeMemeTextNode} disabled={isSynchronizing}
                                                    className="game game-options-btn">
                                                Remove a Text Node
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
                                            <InputGroup>
                                                <InputGroup.Text>Background color</InputGroup.Text>
                                                <Form.Control
                                                    type="color"
                                                    value={backgroundColor}
                                                    onChange={handleBackgroundColorChange}
                                                    disabled={isSynchronizing}
                                                />
                                            </InputGroup>
                                        </div>
                                        <div className={"game game-options options-multirow"}>
                                            <InputGroup>
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
                        <Chat currentLobby={loadedGameData}/>
                    </BaseContainer>) : (<LoadingScreen/>)}
            </div>
        </div>
    );
};

export default Game;
