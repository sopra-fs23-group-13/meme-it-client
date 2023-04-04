import { useContext, useEffect, useMemo, useState } from "react";
import Draggable from "react-draggable";
import { Stack } from "react-bootstrap";
import { MdHeartBroken } from "react-icons/md";
import { TbHeartFilled } from "react-icons/tb";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { Spinner } from "components/ui/Spinner";

import { useHistory } from "react-router-dom";
import "styles/views/Game.scss";
import BaseContainer from "../ui/BaseContainer";
import { AppContext } from "context";

import TimerProgressBar from "components/ui/TimerProgressBar";

const GameRating = () => {
  const delay = 1000;
  const ratingTimeout = 10000;
  const history = useHistory();
  const { finalGameData } = useContext(AppContext);

  const [reaction, setReaction] = useState("");
  const [currentGameData, setCurrentGameData] = useState(null);

  const [now, setNow] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (finalGameData) {
      setCurrentGameData(finalGameData[0]);
      setNow(0);
      setIsPlaying(true);
    } else {
      history.push("/");
    }
  }, [finalGameData]);

  const currentGameIndex = useMemo(
    () => finalGameData?.findIndex(({ id }) => id === currentGameData?.id),
    [currentGameData]
  );

  const handleNextRound = () => {
    if (now < ratingTimeout) {
      setNow(now + 1000);
    } else {
      setNow(null);
      setCurrentGameData(finalGameData[currentGameIndex + 1]);
    }

    if (currentGameIndex < 0 && isPlaying) {
      setNow(null);
      setCurrentGameData(null);
      setIsPlaying(false);
      history.push("/");
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
              {`Round ${currentGameIndex + 1}/${finalGameData?.length} `}
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
              <img src={currentGameData?.currentMeme?.image} />

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
