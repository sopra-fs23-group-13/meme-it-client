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
    const {setGameData, loadedGameData, setLoadedGameData,  setPreLoadedMemesForVoting} = useContext(AppContext);
    const cookies = new Cookies();

    const [isSynchronizing, setIsSynchronizing] = useState(false)
    const [fontSize, setFontSize] = useState(14);
    const [color, setColor] = useState("#ffffff");
    const [currentRound, setCurrentRound] = useState(null);
    const [maxRound, setMaxRound] = useState(null);
    const [currentMeme, setCurrentMeme] = useState(null);
    const [now, setNow] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTextNodePositions, setCurrentTextNodePositions] = useState([
        {
            xRate: 150,
            yRate: 150,
        },
    ]);
    const [currentTextNodeValues, setCurrentTextNodeValues] = useState([]);
    useEffect(async () => {
        let memeData;
        if (loadedGameData === undefined || loadedGameData.length === 0) {
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
            let roundedTimeLeft = Math.round((endTime-currentTime) / 1000) * 1000
            setNow((memeData?.roundDuration * 1000)-(roundedTimeLeft));
            console.log(new Date(memeData.roundStartedAt));
            console.log(new Date(memeData.roundStartedAt).getTime());
            if(new Date() > new Date(endTime.getTime() + 10 * 1000)){
                startVotingAtSameTime(true);
            }
        } else {
            memeData = loadedGameData;
            setNow(0);
        }
        setLoadedGameData(memeData);
        setGameData([]);
        setCurrentRound(memeData.currentRound);
        setCurrentMeme(memeData.meme?.imageUrl);
        setMaxRound(memeData.totalRounds);
        setIsPlaying(true);
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
    const handleNextRound = async () => {
        if (now < loadedGameData?.roundDuration * 1000) {
            setNow(now + 1000);
        } else if (!isSynchronizing) {
            const started = new Date(loadedGameData.startedAt);
            const ended = new Date(started.getTime() + loadedGameData?.roundDuration * 1000);

            // due to security
            const randomBuffer = new Uint32Array(1);
            window.crypto.getRandomValues(randomBuffer);
            let randomNumber = randomBuffer[0] / (0xffffffff + 1);
            const loadDelay = new Date(ended.getTime() + (5 + randomNumber) * 1000);

            const loadDataAfterSubmitting = new Date(ended.getTime() + 5 * 1000);
            const pushNextPage = new Date(loadDataAfterSubmitting.getTime() + 5 * 1000);
            await executeForAllPlayersAtSameTime(ended, () => {
                submitMemesAtSameTime();
            });
            await executeForAllPlayersAtSameTime(loadDelay, async () => {
                await preloadVotingRound();
            });
            await executeForAllPlayersAtSameTime(pushNextPage, () => {
                startVotingAtSameTime();
            });
            setIsSynchronizing(!isSynchronizing);
        }
        if (currentRound < 0 && isPlaying) {
            setNow(null);
            setCurrentRound(null);
            setIsPlaying(false);
        }
    };
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
        const response = await api.get(`${gameEndpoint}/${id}/template`,{headers: {'Authorization': 'Bearer ' + cookies.get("token")}});
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

    const submitMemesAtSameTime = () => {
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
        api.post(`${gameEndpoint}/${id}/meme/${loadedGameData?.meme?.id}`, meme, {headers: {'Authorization': 'Bearer ' + cookies.get("token")}});
    }

    const preloadVotingRound = async () => {
        // get all memes from this round
        const preLoadedMemesForVoting = await api.get(`${gameEndpoint}/${id}/meme`, {headers: {'Authorization': 'Bearer ' + cookies.get("token")}});
        setPreLoadedMemesForVoting(preLoadedMemesForVoting.data);
        console.log(preLoadedMemesForVoting.data);
    }

    const startVotingAtSameTime= (props) =>{
        // reset time and push next page
        // load page from context
        setNow(null);
        props ? localStorage.setItem("alert", "There was an issue with your meme submission!") : localStorage.removeItem("alert");
        history.push("/game-rating/" + id);
    }

    const executeForAllPlayersAtSameTime = async (time, callback) => {
        const delay = time - Date.now();
        if (delay <= 0) {
            callback();
        } else {
            setTimeout(callback, delay);
        }
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
                            callbackFunc={() => handleNextRound()}
                            isPlaying={isPlaying}
                        />
                    </Stack>
                    {currentMeme?.imageUrl ? (
                        <>
                            <div className="meme-content">
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
                      style={{fontSize: `${fontSize}px`, color: color}}
                      disabled={isSynchronizing}
                  />
                                    </Draggable>
                                ))}
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
                                <div className={"game game-options options-row"}>
                                    <Button
                                        className="game game-options-btn"
                                        onClick={handleGetDifferentTemplate}
                                        disabled={isSynchronizing}
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
