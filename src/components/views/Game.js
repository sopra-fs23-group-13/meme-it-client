import React, { useContext, useEffect, useMemo, useState } from "react";
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
  const { setGameData, gameData } = useContext(AppContext);
  const game = findGame(MockData, id);
  const gameRounds = useMemo(() => game?.rounds, [game]);

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
  useEffect(() => {
    setGameData([]);
    setCurrentRound(gameRounds[gameData?.currentRound?.id ?? 0]);
    setCurrentMeme(gameRounds?.[0]?.memes?.[0]);
    setMaxRound(3);
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

  const currentMemes = useMemo(() => currentRound?.memes, [currentRound]);
  useEffect(() => {
    setCurrentMeme(currentRound?.memes?.[0]);
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
      history.push("/game-rating/" + id);
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

  const leaveGame = async () => {
    //const leaveResponse = await api.delete('/' + localStorage.getItem("code") + '/players', {name: JSON.stringify(localStorage.getItem("username"))});
    localStorage.clear();
    history.push("/");
  }
  const handleFontSizeChange = (event) => {
    setFontSize(event.target.value);
  };

  const handleColorChange = (event) => {
    setColor(event.target.value);
  };

  return (
      <BaseContainer className="game">
        <Button
            width="200px"
            onClick={leaveGame}
            className="back-to-login-button"
        >
          Leave Game
        </Button>
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
                    style={{ fontSize: `${fontSize}px`, color: color }}
                  />
                </Draggable>
              ))}
            </div>
            <div>
              <label htmlFor="fontSize">Font size: </label>
              <input
                  type="number"
                  value={fontSize}
                  min="10"
                  max="48"
                  step="1"
                  onChange={handleFontSizeChange}
                  style={{ marginRight: "10px" }}
              />
              <label htmlFor="color">Color: </label>
              <input
                  type="color"
                  value={color}
                  onChange={handleColorChange}
                  style={{ marginRight: "10px" }}
              />
            </div>
            <Button
              className="home join-btn"
              onClick={handleGetDifferentTemplate}
            >
              Get different template
            </Button>

            <Button onClick={addMemeTextNode}>
              Add new Text Node
            </Button>
            <Button onClick={removeMemeTextNode}>
              Remove the most recent Text Node
            </Button>
          </>
        ) : (
          <Spinner />
        )}
      </Stack>
    </BaseContainer>
  );
};

export default Game;
