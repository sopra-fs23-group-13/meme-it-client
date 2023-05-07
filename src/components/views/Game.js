import React, {useContext, useEffect, useMemo, useState} from "react";
import Draggable from "react-draggable";
import {Stack, Button, Row, Col, InputGroup} from "react-bootstrap";
import {v4 as uuid} from "uuid";
import {useParams, useHistory} from "react-router-dom";
import {Spinner} from "components/ui/Spinner";
import "styles/views/Game.scss";
import MockData from "../../mockData/menuScreenDataMock.json";
import BaseContainer from "../ui/BaseContainer";
import {findGame} from "helpers/functions";
import {AppContext} from "context";
import TimerProgressBar from "components/ui/TimerProgressBar";
import {api} from "../../helpers/api";
import {game as gameEndpoint} from "../../helpers/endpoints"
import Chat from "../ui/Chat";
import Cookies from "universal-cookie";
import getMeme from "../../mockData/getMeme.json"
import Form from "react-bootstrap/Form";

const Game = () => {
    const delay = 1000;
    const history = useHistory();
    const {id} = useParams();
    const {setGameData, loadedGameData, setLoadedGameData,  setPreLoadedMemesForVoting} = useContext(AppContext);
    const game = findGame(MockData, id);
    const gameRounds = useMemo(() => game?.rounds, [game]);
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
        /*
        if(!loadedGameData === undefined || loadedGameData.length === 0){
            const preLoadedGameData = await api.get(`${game}/${response.data.gameId}`,{headers: {'Authorization': 'Bearer ' + cookies.get("token")}});
            const preLoadedMemeTemplate = await api.get(`${game}/${response.data.gameId}/template`,{headers: {'Authorization': 'Bearer ' + cookies.get("token")}});
            const memeData = {
                ...preLoadedGameData.data,
                meme: {...preLoadedMemeTemplate.data}
            }
            console.log(memeData);
            setLoadedGameData(memeData);
        }*/
        console.log(loadedGameData)
        setGameData([]);
        setCurrentRound(loadedGameData?.currentRound);
        setCurrentMeme(loadedGameData?.meme?.imageUrl);
        setMaxRound(loadedGameData?.totalRounds);
        setNow(0);
        setIsPlaying(true);
    }, [gameRounds]);

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
    const handleNextRound = () => {
        if (now < loadedGameData?.roundDuration * 1000) {
            setNow(now + 1000);
        } else if (!isSynchronizing){
            const started = new Date(loadedGameData.startedAt);
            const ended = new Date(started.getTime() + loadedGameData?.roundDuration * 1000);
            const loadDataAfterSubmitting = new Date(ended.getTime() + 5 * 1000);
            const pushNextPage = new Date(loadDataAfterSubmitting.getTime() + 5 * 1000);
            executeForAllPlayersAtSameTime(ended, () => {
                submitMemesAtSameTime();
            });
            executeForAllPlayersAtSameTime(loadDataAfterSubmitting, () => {
                preloadVotingRound();
            });
            executeForAllPlayersAtSameTime(pushNextPage, () => {
                startVotingAtSameTime();
            });
            setIsSynchronizing(!isSynchronizing);
            //history.push("/game-rating/" + id);
        }
        if (currentRound < 0 && isPlaying) {
            setNow(null);
            setCurrentRound(null);
            setIsPlaying(false);
            /*history.push("/game-rating/" + id);*/
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
        console.log(`${gameEndpoint}/${id}/template`);
        const response = await api.get(`${gameEndpoint}/${id}/template`,{headers: {'Authorization': 'Bearer ' + cookies.get("token")}});
        const copyObject = {...loadedGameData};
        copyObject.meme = response.data;
        setLoadedGameData(copyObject);
        setCurrentMeme(response.data);
    };

    const leaveGame = async () => {
        //const leaveResponse = await api.delete('/' + localStorage.getItem("code") + '/players', {name: JSON.stringify(localStorage.getItem("username"))});
        localStorage.clear()
        sessionStorage.clear()
        sessionStorage.setItem("alert", "Disconnected")
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
        console.log("submitting memes")
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
        console.log(meme)
        api.post(`${gameEndpoint}/${id}/meme/${loadedGameData?.meme?.id}`, meme, {headers: {'Authorization': 'Bearer ' + cookies.get("token")}});
    }

    const preloadVotingRound = async () => {
        // get all memes from this round
        const preLoadedMemesForVoting = await api.get(`${gameEndpoint}/${id}/meme`, {headers: {'Authorization': 'Bearer ' + cookies.get("token")}});
        //setPreLoadedMemesForVoting(preLoadedMemesForVoting.data);
        console.log(preLoadedMemesForVoting.data)
        setPreLoadedMemesForVoting(getMeme);
    }

    const startVotingAtSameTime= () =>{
        // reset time and push next page
        // load page from context
        setNow(null);
        /*history.push("/game-rating/" + id);*/
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
            </BaseContainer>
          </div>
        </div>
    );
};

export default Game;
