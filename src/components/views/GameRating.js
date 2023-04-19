import { useContext, useEffect, useMemo, useState } from "react";
import Draggable from "react-draggable";
import { Stack } from "react-bootstrap";
import { MdHeartBroken } from "react-icons/md";
import { TbHeartFilled } from "react-icons/tb";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { Spinner } from "components/ui/Spinner";

import {useHistory, useParams} from "react-router-dom";
import "styles/views/Game.scss";
import BaseContainer from "../ui/BaseContainer";
import { AppContext } from "context";

import TimerProgressBar from "components/ui/TimerProgressBar";

const GameRating = () => {
  const delay = 1000;
  const ratingTimeout = 10000;
  const { id }  = useParams();
  const history = useHistory();
  const {  gameData } = useContext(AppContext);

  const [reaction, setReaction] = useState("");
  const [currentGameData, setCurrentGameData] = useState(null);

  const [now, setNow] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (gameData) {
      setCurrentGameData(gameData);
      setNow(0);
      setIsPlaying(true);
    } else {
      history.push("/");
    }
  }, [gameData]);

  const currentGameIndex = useMemo(
    () => gameData?.currentRound?.id,
    [currentGameData]
  );

  useEffect(() => {
    if (gameData) {
      setCurrentGameData(gameData);
      setNow(0);
      setIsPlaying(true);
    } else {
      history.push(`/`);
    }
  }, [gameData]);



  const handleNextRound = () => {
    if (now < ratingTimeout) {
      setNow(now + 1000);
    } else {
      setNow(null);
      if (gameData.currentRound.id < gameData.maxRound && isPlaying){
        history.push(`/game/${id}`);
      } else {
        setNow(null);
        setCurrentGameData(null);
        setIsPlaying(false);
        history.push("/"); //push to final leaderboard
      }
    }
  };

  const reactions = useMemo(
    () => [
      {
        name: "heart_break",
        icon: <MdHeartBroken size={40} />,
      },
      {
        name: "dislike",
        icon: <AiFillDislike size={40} />,
      },
      {
        name: "like",
        icon: <AiFillLike size={40} />,
      },
      {
        name: "heart",
        icon: <TbHeartFilled size={40} />,
      },
    ],
    [reaction]
  );

  return (
    <BaseContainer className="game">
      <Stack gap={3} className="pt-5 container ">
        <Stack gap={3} className={`pt-5  `}>
          {currentGameIndex + 1 && (
            <h1 className="fw-bolder fs-3 text-start text-black">
              {`Round ${currentGameIndex}/${gameData?.maxRound} `}
            </h1>
          )}
          <p className="fs-6 text-start text-black">Vote for memes</p>
          <TimerProgressBar
            delay={delay}
            now={now}
            max={ratingTimeout}
            callbackFunc={() => handleNextRound()}
            isPlaying={isPlaying}
          />
        </Stack>
        {currentGameData?.currentMeme?.image ? (
          <>
            <div className="meme-content">
              <img src={currentGameData?.currentMeme?.image} alt={"Meme"} />

              {currentGameData?.currentTextNodePositions?.map((item, i) => (
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
                    value={currentGameData?.currentTextNodeValues[i]}
                    disabled
                    style={{ fontSize: `${currentGameData?.fontSize}px`, color: currentGameData?.color }}
                  />
                </Draggable>
              ))}
            </div>
            <div className="reactions-container">
              {reactions.map(({ name, icon }, i) => (
                <span
                  key={i}
                  onClick={() => setReaction(name)}
                  className={`icon-container ${
                    name === reaction && "selected"
                  }`}
                >
                  {icon}

                  <p className="text-start text-black">{i}</p>
                </span>
              ))}
            </div>
          </>
        ) : (
          <Spinner />
        )}
      </Stack>
    </BaseContainer>
  );
};

export default GameRating;
