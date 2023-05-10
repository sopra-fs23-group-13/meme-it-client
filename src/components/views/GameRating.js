import React, {useContext, useEffect, useMemo, useState} from "react";
import Draggable from "react-draggable";
import {Button, Carousel, Stack} from "react-bootstrap";
import {MdHeartBroken} from "react-icons/md";
import {TbHeartFilled} from "react-icons/tb";
import {AiFillDislike, AiFillLike} from "react-icons/ai";
import {Spinner} from "components/ui/Spinner";

import {useHistory, useParams} from "react-router-dom";
import "styles/views/Game.scss";
import BaseContainer from "../ui/BaseContainer";
import {AppContext} from "context";

import TimerProgressBar from "components/ui/TimerProgressBar";
import {api} from "../../helpers/api";
import {game as gameEndpoint} from "../../helpers/endpoints";
import Cookies from "universal-cookie";
import Chat from "../ui/Chat";


const GameRating = () => {
    const delay = 1000;
    const {id} = useParams();
    const cookies = new Cookies();
    const history = useHistory();
    const {loadedGameData, setLoadedGameData, preLoadedMemesForVoting} = useContext(AppContext);

    const [reaction] = useState("");
    const [currentGameData, setCurrentGameData] = useState(preLoadedMemesForVoting);

    const [currentRound, setCurrentRound] = useState(null);
    const [maxRound, setMaxRound] = useState(null);

    const [now, setNow] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isSynchronizing, setIsSynchronizing] = useState(false)

    useEffect(async () => {
        let votingData;
        let gameData;
        if (preLoadedMemesForVoting === undefined || preLoadedMemesForVoting.length === 0) {
            const votingRes = await api.get(`${gameEndpoint}/${id}/meme`, {headers: {'Authorization': 'Bearer ' + cookies.get("token")}});
            const [gameRes, templateRes] = await Promise.all([
                api.get(`${gameEndpoint}/${id}`, {
                    headers: { 'Authorization': `Bearer ${cookies.get("token")}` },
                }),
                api.get(`${gameEndpoint}/${id}/template`, {
                    headers: { 'Authorization': `Bearer ${cookies.get("token")}` },
                }),
            ]);
            gameData = {
                ...gameRes.data,
                meme: { ...templateRes.data }
            };
            votingData = votingRes.data;
            let currentTime = new Date();
            let endTime = new Date(new Date(new Date(gameData.roundStartedAt).getTime() + gameData?.roundDuration * 1000).getTime() + 15000 + gameData?.votingDuration * 1000);
            let roundedTimeLeft = Math.round((endTime-currentTime) / 1000) * 1000;
            setNow((gameData?.votingDuration * 1000)-(roundedTimeLeft));
            if(new Date() > new Date(endTime.getTime() + 10 * 1000)){
                await pushToLeaderboard(true);
            }
        } else {
            votingData = preLoadedMemesForVoting;
            console.log(votingData)
            gameData = loadedGameData;
            setNow(0);
        }
        setLoadedGameData(gameData);
        setCurrentGameData(votingData);
        setIsPlaying(true);
        setCurrentRound(gameData?.currentRound);
        setMaxRound(gameData?.totalRounds);
        console.log(votingData)
    }, [preLoadedMemesForVoting]);

    const handleNextRound = async () => {
        if (now < loadedGameData?.votingDuration * 1000) {
            setNow(now + 1000);
        } else if (!isSynchronizing) {
            const ended = new Date(new Date(new Date(loadedGameData.roundStartedAt).getTime() + loadedGameData?.roundDuration * 1000).getTime() + 15000 + loadedGameData?.votingDuration * 1000);
            const pushNextPage = new Date(ended.getTime() + 5 * 1000);
            await executeForAllPlayersAtSameTime(ended, async () => {
                await submitVotesAtSameTime();
            });
            await executeForAllPlayersAtSameTime(pushNextPage, async () => {
                await pushToLeaderboard();
            });
            setIsSynchronizing(!isSynchronizing);
        }
        if (currentRound < 0 && isPlaying) {
            setNow(null);
            setCurrentRound(null);
            setIsPlaying(false);
            history.push("/game-rating/" + id);
        }
    };

    const submitVotesAtSameTime = async () => {
        const cgd = currentGameData.filter(meme => meme?.vote);
        await cgd.forEach(memeWithVote => api.post(`${gameEndpoint}/${id}/rating/${memeWithVote.id}`, {rating: memeWithVote.vote}, {headers: {'Authorization': 'Bearer ' + cookies.get("token")}}));
    }
    const pushToLeaderboard = async (props) => {
        props ? localStorage.setItem("alert", "There was an issue with your meme submission!") : localStorage.removeItem("alert");
        history.push("/leaderboard");
    }

    const executeForAllPlayersAtSameTime = async (time, callback) => {
        const delay = time - Date.now();
        if (delay <= 0) {
            callback();
        } else {
            setTimeout(callback, delay);
        }
    };

    const leaveGame = async () => {
        //const leaveResponse = await api.delete('/' + localStorage.getItem("code") + '/players', {name: JSON.stringify(localStorage.getItem("username"))});
        localStorage.clear();
        localStorage.clear();
        localStorage.setItem("alert", "Disconnected");
        cookies.remove("token");
        history.push("/");
    }

    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    const handleReaction = (userReaction) => {
        if(!isSynchronizing){
            const cgd = [...currentGameData];
            cgd[index] = {...currentGameData[index], vote: userReaction};
            setCurrentGameData(cgd);
        }
    }

    const reactions = useMemo(
        () => [
            {
                name: "heart_break",
                icon: <MdHeartBroken size={40}/>,
            },
            {
                name: "dislike",
                icon: <AiFillDislike size={40}/>,
            },
            {
                name: "like",
                icon: <AiFillLike size={40}/>,
            },
            {
                name: "heart",
                icon: <TbHeartFilled size={40}/>,
            },
        ],
        [reaction]
    );

    return (
        <div className={"game content"}>
            <div className={"game card"}>
                {(currentGameData !== null && currentGameData?.length > 0 && currentGameData !== undefined) ? (
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
                            <p className="fs-6 text-start text-black">Vote for memes</p>
                            <TimerProgressBar
                                delay={delay}
                                now={now}
                                max={loadedGameData?.votingDuration * 1000}
                                callbackFunc={() => handleNextRound()}
                                isPlaying={isPlaying}
                            />
                        </Stack>
                        {(currentGameData !== null && currentGameData?.length > 0 && currentGameData !== undefined) ? (
                        <Carousel activeIndex={index} onSelect={handleSelect}>
                            {currentGameData?.map(currentMeme => {
                                return (

                                    <Carousel.Item key={currentMeme?.id}>
                                        <div className="meme-content">
                                        <img src={currentMeme?.imageUrl} alt={"Meme"}/>
                                        {currentMeme?.textBoxes?.map((item, i) => (
                                            <Draggable
                                                key={i}
                                                bounds="parent"
                                                position={{
                                                    x: item?.xRate,
                                                    y: item?.yRate,
                                                }}
                                                disabled
                                            >
                                              <textarea
                                                  placeholder="TEXT HERE"
                                                  value={item.text}
                                                  disabled
                                                  style={{fontSize: `${currentMeme?.fontSize}px`, color: currentMeme?.color}}
                                              />
                                            </Draggable>
                                        ))}
                                        </div>
                                    </Carousel.Item>

                                )
                            })}
                        </Carousel>
                        ) : (<Spinner />)
                        }
                        {(currentGameData !== null && currentGameData?.length > 0 && currentGameData !== undefined) ? (
                            <div className="reactions-container">
                                {reactions.map(({name, icon}, i) => (
                                    <span
                                        key={i}
                                        onClick={() => handleReaction(i)}
                                        className={`icon-container ${
                                            currentGameData[index]?.vote === i && "selected"
                                        }`}
                                    >{icon}
                                    </span>
                                ))}
                            </div>
                        ) : (<></>)}
                    </Stack>
                    <Chat currentLobby={loadedGameData}/>
                </BaseContainer> ) : (<Spinner />)}
            </div>
        </div>
    );
};

export default GameRating;
