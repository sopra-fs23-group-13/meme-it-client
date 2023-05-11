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
    const [superLikes, setSuperLikes] = useState(Number(localStorage.getItem("superlike")));
    const [superDislikes, setSuperDislikes] = useState(Number(localStorage.getItem("superlike")));

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
            let endTime = new Date(new Date(new Date(gameData.roundStartedAt).getTime() + gameData?.roundDuration * 1000).getTime() + gameData?.votingDuration * 1000);
            let roundedTimeLeft = Math.round((endTime-currentTime) / 1000) * 1000;
            setNow((gameData?.votingDuration * 1000)-(roundedTimeLeft));
            console.log(gameData)
            console.log(currentTime);
            console.log(endTime);
            console.log(roundedTimeLeft);
        } else {
            votingData = preLoadedMemesForVoting;
            gameData = loadedGameData;
            setNow(0);
        }
        console.log(gameData)
        setLoadedGameData(gameData);
        setCurrentGameData(votingData);
        setIsPlaying(true);
        setCurrentRound(gameData?.currentRound);
        setMaxRound(gameData?.totalRounds);
    }, [preLoadedMemesForVoting]);

    const handleNextRound = async () => {
        const votingRes = await api.get(`${gameEndpoint}/${id}/meme`, {headers: {'Authorization': 'Bearer ' + cookies.get("token")}});

        const mergedArray = currentGameData.map((gameDataItem) => {
            const votingDataItem = votingRes.data.find((votingItem) => votingItem.id === gameDataItem.id);
            if (votingDataItem) {
                return {
                    ...gameDataItem,
                    voting: votingDataItem.voting
                }
            }
            return gameDataItem;
        }).concat(votingRes.data.filter((votingItem) => !currentGameData.some((gameDataItem) => gameDataItem.id === votingItem.id)));

        setCurrentGameData(mergedArray);

        if (now < loadedGameData?.votingDuration * 1000) {
            setIsSynchronizing(false);
            setNow(now + 1000);
        }
    };

    useEffect( () => {
        const continueToNextRound = async () => {
            const gameState = await api.get(`${gameEndpoint}/${id}`, {
                headers: { 'Authorization': `Bearer ${cookies.get("token")}` },
            });

            console.log(gameState);
            if(gameState.data.gameState !== "RATING"){
                setNow(null);
                setCurrentRound(null);
                setIsPlaying(false);
                await submitVotesAtSameTime();
                await pushToLeaderboard();
            } else {
                setIsSynchronizing(true);
            }
        };

        const interval = setInterval(async () => {
            await continueToNextRound();
        }, 1000);
        return () => clearInterval(interval);
    });

    const submitVotesAtSameTime = async () => {
        const cgd = currentGameData.filter(meme => meme?.vote);
        await cgd.forEach(memeWithVote => api.post(`${gameEndpoint}/${id}/rating/${memeWithVote.id}`, {rating: memeWithVote.vote}, {headers: {'Authorization': 'Bearer ' + cookies.get("token")}}));
    }
    const pushToLeaderboard = async (props) => {
        props ? localStorage.setItem("alert", "There was an issue with your meme submission!") : localStorage.removeItem("alert");
        history.push("/leaderboard");
    }

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

            if(cgd[index]?.vote !== userReaction){

                //give user back his superlike / -dislike when changing his decision
                if (cgd[index]?.vote === 3){setSuperLikes(superLikes+1);}
                else if (userReaction === 3){setSuperLikes(superLikes-1);}

                if (cgd[index]?.vote === 0){setSuperDislikes(superDislikes+1);}
                else if (userReaction === 0){setSuperDislikes(superDislikes-1);}

                cgd[index] = {...currentGameData[index], vote: userReaction};
                setCurrentGameData(cgd);
            }
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
                                        }
                                        ${(superLikes === 0 && name === "heart") && "disableVoting"}
                                        ${(superDislikes === 0 && name === "heart_break") && "disableVoting"}
                                        `}
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
