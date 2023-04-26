import React, {useContext, useEffect, useMemo, useState} from "react";
import Draggable from "react-draggable";
import {Carousel, Stack} from "react-bootstrap";
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
    const {gameData, loadedGameData, preLoadedMemesForVoting} = useContext(AppContext);

    const [reaction, setReaction] = useState("");
    const [currentGameData, setCurrentGameData] = useState(preLoadedMemesForVoting);

    const [currentRound, setCurrentRound] = useState(null);
    const [maxRound, setMaxRound] = useState(null);

    const [now, setNow] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isSynchronizing, setIsSynchronizing] = useState(false)

    useEffect(async () => {
        if (preLoadedMemesForVoting === undefined || preLoadedMemesForVoting.length === 0) {
            const votingMemeData = await api.get(`${gameEndpoint}/${id}/meme`, {headers: {'Authorization': 'Bearer ' + cookies.get("token")}});
            setCurrentGameData(votingMemeData);
        } else {
            setCurrentGameData(preLoadedMemesForVoting);
        }
        setNow(0);
        setIsPlaying(true);
        setCurrentRound(loadedGameData?.currentRound);
        setMaxRound(loadedGameData?.totalRounds);
        //history.push("/");
    }, [preLoadedMemesForVoting]);

    const handleNextRound = () => {
        if (now < loadedGameData?.votingDuration * 1000) {
            setNow(now + 1000);
        } else if (!isSynchronizing) {
            const started = new Date(loadedGameData?.startedAt);
            const ended = new Date(started.getTime() + loadedGameData?.votingDuration * 1000);
            const pushNextPage = new Date(ended.getTime() + 5 * 1000);
            executeForAllPlayersAtSameTime(ended, () => {
                submitVotesAtSameTime();
            });
            executeForAllPlayersAtSameTime(pushNextPage, () => {
                pushToLeaderboard();
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
        //TODO: freeze voting.
        const cgd = currentGameData.filter(meme => meme?.vote);
        await cgd.forEach(memeWithVote => api.post(`${gameEndpoint}/${id}/rating/${memeWithVote.id}`, {rating: memeWithVote.vote}, {headers: {'Authorization': 'Bearer ' + cookies.get("token")}}));
    }
    const pushToLeaderboard = async () => {
        //TODO: history.push("/game-rating/" + id); push result page
    }

    const executeForAllPlayersAtSameTime = async (time, callback) => {
        const delay = time - Date.now();
        if (delay <= 0) {
            callback();
        } else {
            setTimeout(callback, delay);
        }
    };

    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    const handleReaction = (userReaction) => {
        if(!isSynchronizing){
            const cgd = [...currentGameData];
            const voted = {...currentGameData[index], vote: userReaction};
            cgd[index] = voted;
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
                <BaseContainer className="game">
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
                </BaseContainer>
            </div>
        </div>
    );
};

export default GameRating;
