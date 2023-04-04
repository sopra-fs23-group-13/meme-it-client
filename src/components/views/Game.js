import { useContext, useEffect, useMemo, useState } from "react";
import Draggable from "react-draggable";
import { Stack, Button } from "react-bootstrap";
import { v4 as uuid } from "uuid";
import { useParams, useHistory } from "react-router-dom";
import { Spinner } from "components/ui/Spinner";
import "styles/views/Game.scss";
import MockData from "../../mockData/menuScreenDataMock.json";
import BaseContainer from "../ui/BaseContainer";
import { findGame } from "helpers/functions";
import { AppContext } from "context";
import TimerProgressBar from "components/ui/TimerProgressBar";

const Game = () => {
  const delay = 1000;
  const history = useHistory();
  const { id } = useParams();
  const { setFinalGameData } = useContext(AppContext);
  const game = findGame(MockData, id);
  const gameRounds = useMemo(() => game?.rounds, [game]);

  const [currentRound, setCurrentRound] = useState(null);
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
  useEffect(() => {
    setFinalGameData([]);
    setCurrentRound(gameRounds[0]);
    setCurrentMeme(gameRounds?.[0]?.memes?.[0]);
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
    return memeTextNodes.map((item) => "");
  }, [memeTextNodes]);

  const currentMemes = useMemo(() => currentRound?.memes, [currentRound]);
  useEffect(() => {
    setCurrentMeme(currentRound?.memes?.[0]);
  }, [currentRound]);

  useEffect(() => {
    setCurrentTextNodePositions(memeTextNodes);
    setCurrentTextNodeValues(memeTextNodesDefaultValues);
  }, [currentMeme]);

  const currentRoundIndex = useMemo(
    () => gameRounds?.findIndex(({ id }) => id === currentRound?.id),
    [currentRound]
  );

  const handleNextRound = () => {
    if (now < currentRound?.timeout) {
      setNow(now + 1000);
    } else {
      setNow(null);
      setCurrentRound(gameRounds[currentRoundIndex + 1]);
      currentMeme &&
        setFinalGameData((prev) => [
          ...prev,
          {
            id: uuid(),
            currentTextNodeValues,
            currentTextNodePositions,
            currentMeme,
          },
        ]);
    }

    if (currentRoundIndex < 0 && isPlaying) {
      setNow(null);
      setCurrentRound(null);
      setIsPlaying(false);
      history.push("/game-rating/" + id);
    }
  };
  const onTextNodeDrag = (e, data, i) => {
    let prevPositions = [...currentTextNodePositions];
    prevPositions[i] = { xRate: data.lastX, yRate: data.lastY };
    setCurrentTextNodePositions(prevPositions);
  };

  const onTextNodeChange = (e, i) => {
    let prevValues = [...currentTextNodeValues];
    prevValues[i] = e.target.value;
    setCurrentTextNodeValues(prevValues);
  };

  const memeChangesLeft = useMemo(
    () => currentTextNodeValues?.filter((item) => !item).length,
    [currentTextNodeValues]
  );

  const currentMemeIndex = useMemo(
    () => currentMemes?.findIndex(({ id }) => id === currentMeme?.id),
    [currentMeme]
  );

  const handleGetDifferentTemplate = () => {
    const newMemeIndex = currentMemeIndex + 1;
    setCurrentMeme(
      currentMemes[newMemeIndex === currentMemes?.length ? 0 : newMemeIndex]
    );
  };

  return (
    <BaseContainer className="game">
      <Stack gap={3} className="pt-5 container ">
        <Stack gap={3} className={`pt-5  `}>
          {currentRoundIndex + 1 && (
            <h1 className="fw-bolder fs-3 text-start text-black">
              {`Round ${currentRoundIndex + 1}/${gameRounds?.length} `}
            </h1>
          )}
          <p className="fs-6 text-start text-black">
            Drag the text nodes over the image
          </p>
          <TimerProgressBar
            delay={delay}
            now={now}
            max={currentRound?.timeout}
            callbackFunc={() => handleNextRound()}
            isPlaying={isPlaying}
          />
        </Stack>
        {currentMeme?.image ? (
          <>
            <div className="meme-content">
              <img src={currentMeme?.image} />

              {memeTextNodes?.map((item, i) => (
                <Draggable
                  key={i}
                  bounds="parent"
                  position={{
                    x: currentTextNodePositions?.[i]?.xRate,
                    y: currentTextNodePositions?.[i]?.yRate,
                  }}
                  onDrag={(e, data) => onTextNodeDrag(e, data, i)}
                >
                  <textarea
                    placeholder="TEXT HERE"
                    value={currentTextNodeValues[i]}
                    onChange={(e) => onTextNodeChange(e, i)}
                  />
                </Draggable>
              ))}
            </div>
            <Button
              className="home join-btn"
              onClick={handleGetDifferentTemplate}
            >
              Get different template
            </Button>
            <p>{memeChangesLeft} Meme Changes Left</p>
          </>
        ) : (
          <Spinner />
        )}
      </Stack>
    </BaseContainer>
  );
};

export default Game;
