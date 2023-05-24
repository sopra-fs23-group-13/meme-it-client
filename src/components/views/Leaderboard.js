import React, {useContext, useEffect, useRef, useState} from "react";
import {Col, Row, Stack, Table, Button, Badge, Container, Carousel} from "react-bootstrap";
import "styles/views/Leaderboard.scss";
import "styles/views/Game.scss";
import {FaMedal} from 'react-icons/fa';
import Meme from "../../models/Meme";
import {api} from "../../helpers/api";
import {game as gameEndpoint} from "../../helpers/endpoints";
import Player from "../../models/Player";
import {Spinner} from "../ui/Spinner";
import TimerProgressBar from "../ui/TimerProgressBar";
import Cookies from "universal-cookie";
import {useHistory, useParams} from "react-router-dom";
import AnimatedBarChart from "../ui/AnimatedBarChart";
import Confetti from "react-confetti";
import {useWindowSize} from "react-use";
import {AppContext} from "../../context";
import Chat from "../ui/Chat";
import ClickableMeme from "../ui/ClickableMeme";
import Home from "../../images/home.png";
import DraggableResizableInput from "../ui/DraggableInput";
import CarouselItemContent from "../ui/CarouselItemContent";

const LeaderboardTable = ({players, memes}) => {
    function getPlayerMeme(player) {
        if (memes.length > 0) {
            return memes.find((meme) => {
                return meme.user.id === player.id;
            })
        }

    }
    const getRankSymbol = (index) => {
        if (index === 0) {
            return <FaMedal size={24} color="#d7b912"/>
        }
        if (index === 1) {
            return <FaMedal size={24} color="#a1a1a1"/>
        }
        if (index === 2) {
            return <FaMedal size={24} color="#cd7f32"/>
        }
        return <p style={{marginLeft: "4px"}}>{"#" + (index + 1)}</p>
    }

    const pointDifference = (player) => {
        const meme = getPlayerMeme(player);
        if (meme?.rating > 0) {
            return <Badge pill bg={"success"} style={{fontSize: "14px"}}>
                + {meme.rating}
            </Badge>
        } else if (meme?.rating < 0) {
            return <Badge pill bg={"danger"} style={{fontSize: "14px"}}>
                - {-1 * meme.rating}
            </Badge>
        } else {
            return <Badge pill bg={"secondary"} style={{fontSize: "14px"}}>
                + 0
            </Badge>
        }
    }
    return (
        <Container className={"leaderboard table-container"}>
            <Table responsive className={"leaderboard table"}>
                <thead>
                <tr style={{fontSize: '16px'}}>
                    <th>Place</th>
                    <th>Name</th>
                    <th>Score</th>
                    <th width={1}>Meme</th>
                </tr>
                </thead>
                <tbody>
                {players.map((player, index) => {
                    return (
                        <tr style={{fontSize: '18px'}} key={index}>
                            <td>{getRankSymbol(index)}</td>
                            <td>{player.name}</td>
                            <td>{player.score} Points {pointDifference(player)} </td>
                            <td><ClickableMeme meme={getPlayerMeme(player)} size={"small"} disableModal={false}/></td>
                        </tr>
                    )
                })
                }
                </tbody>
            </Table>
        </Container>

    )

}
const Leaderboard = () => {
    const {width, height} = useWindowSize()
    const {id} = useParams();
    const history = useHistory();
    const cookies = new Cookies();
    const [roundMemesData, setRoundMemesData] = useState([]);
    const [roundRatingsData, setRoundRatingsData] = useState([]);
    const [gameRatingsData, setGameRatingsData] = useState([]);

    const [roundPlayers, setRoundPlayers] = useState([]); //All players and their score throughout all rounds
    const [memes, setMemes] = useState([]); // All memes of this round and their rating
    const [bestMeme, setBestMeme] = useState(null);
    const [isFinalRound, setIsFinalRound] = useState(null);
    const {loadedGameData} = useContext(AppContext);
    const [currentGameData, setCurrentGameData] = useState(loadedGameData);
    const [memeCarousel, setMemeCarousel] = useState(null);
    function getPlayerMeme(player) {
        return memes.find((meme) => {
            return meme.user.id === player.id;
        })
    }

    const leaveGame = async () => {
        localStorage.clear()
        localStorage.setItem("alert", "Disconnected")
        cookies.remove("token")
        history.replace("/")
    }

    function findPlayerById(playerList, id) {
        return playerList.find((player) => {
            return player.id === id;
        })
    }

    function findMemeById(memeList, memeId) {
        return memeList.find((meme) => {
            return meme.id === memeId;
        })
    }

    const handleNextRound = async () => {
        history.replace("/game/" + id);
    };

    useEffect(() => {
        const updateGameData = async () => {
            try {
                const gameDataResponse = await api.get(`${gameEndpoint}/${id}`, {headers: {'Authorization': `Bearer ${cookies.get("token")}`}});

                if (gameDataResponse.data.gameState != "ROUND_RESULTS" && gameDataResponse.data.gameState != "GAME_RESULTS") {
                    await handleNextRound();
                } else if (gameDataResponse.data.gameState == "GAME_RESULTS") {
                    setIsFinalRound(true);
                } else {
                    setIsFinalRound(false);
                }
                setCurrentGameData(gameDataResponse.data);

            } catch (e) {
                console.log(e)
            }
        }
        const interval = setInterval(async () => {
            await updateGameData();
        }, 1000);
        return () => clearInterval(interval);
    })

    const [dimensions, setDimensions] = useState({ width: 'auto', height: 'auto' });
    const style = {color: "#000000", backgroundColor: "#F47A7799", borderRadius: "10px", width: dimensions.width, margin: "auto"}

    const imageRef = useRef();
    const handleImageLoad = () => {
        setDimensions({
            width: imageRef?.current?.offsetWidth,
            height: imageRef?.current?.offsetHeight
        });
        console.log({
            width: imageRef?.current?.offsetWidth,
            height: imageRef?.current?.offsetHeight
        })
        console.log(imageRef
        )
        console.log("here")
    };
    useEffect(() => {
        console.log("entered")
        handleImageLoad();
    }, [memeCarousel])

    useEffect(() => {
        const getLeaderboardData = async () => {
            // Wait so data is fully prepared on backend (otherwise some ratings might be missing)
            await new Promise(resolve => setTimeout(resolve, 500));
            try {
                // Memes of the round (get players)
                const roundMemesResponse = await api.get(`${gameEndpoint}/${id}/meme`, {headers: {'Authorization': `Bearer ${cookies.get("token")}`}});
                setRoundMemesData(roundMemesResponse.data);
                // Ratings of the round (get current memes and ratings)
                const roundRatingsResponse = await api.get(`${gameEndpoint}/${id}/results/round`, {headers: {'Authorization': `Bearer ${cookies.get("token")}`}});
                setRoundRatingsData(roundRatingsResponse.data)
                // All ratings of the game (get total score tc.)
                const gameRatingsResponse = await api.get(`${gameEndpoint}/${id}/results/game`, {headers: {'Authorization': `Bearer ${cookies.get("token")}`}});
                setGameRatingsData(gameRatingsResponse.data)

                if (isFinalRound) {
                    let allMemes = []
                    for (let rating of gameRatingsResponse.data) {
                        let m = findMemeById(allMemes, rating.meme.id)
                        if (m === undefined) {
                            m = new Meme(rating.meme)
                            m.rating = rating.rating
                            allMemes.push(m)
                        } else {
                            m.rating += rating.rating
                        }
                    }
                    allMemes.sort((a, b) => {
                        return b.rating - a.rating
                    });
                    setBestMeme(allMemes[0])
                }
            } catch (e) {
                console.log(e)
            }

            let currentRoundMemes = []
            let players = []
            for (let meme of roundMemesData) {
                let m = new Meme(meme);
                let p = new Player(meme.user);
                p.score = 0;
                m.rating = 0;
                for (let rating of roundRatingsData) {
                    if (rating.meme.id === meme.id) {
                        m.rating += rating.rating;
                    }
                }
                if (findPlayerById(players, p.id) === undefined) {
                    players.push(p);
                }
                currentRoundMemes.push(m);
            }
            for (let rating of gameRatingsData) {
                let p = findPlayerById(players, rating.meme.user.id);
                if (p === undefined) {
                    p = new Player(rating.meme.user);
                    p.score = 0;
                    players.push(p);
                }
                p.score += rating.rating;
            }
            //Sort Player List so first index is highest score
            players.sort((a, b) => {
                return b.score - a.score
            });
            //Sort Round meme list so first index is highest rated meme
            currentRoundMemes.sort((a, b) => {
                return b.rating - a.rating
            });
            setRoundPlayers(players);
            setMemes(currentRoundMemes);
            isFinalRound ? setMemeCarousel([currentRoundMemes[0], currentRoundMemes[currentRoundMemes.length-1]]) : setMemeCarousel([currentRoundMemes[0], currentRoundMemes[currentRoundMemes.length-1]]);
        }
        const interval = setInterval(async () => {
            await getLeaderboardData();
        }, 1000);
        return () => clearInterval(interval);
    })

    //If not final round and there is data for the players and memes
    if (isFinalRound == false && memes.length && roundPlayers.length) {
        const memeCarousel = [memes[0], memes[memes.length-1]];
        return (
            <div className="leaderboard content">
                <Container>
                    <div className={"leaderboard card"}>
                        <Button
                            width="200px"
                            onClick={leaveGame}
                            className="lobby leave-btn game">
                            Leave Game
                        </Button>
                        <Stack gap={1}>
                            <h1 className="fw-bolder fs-3 text-start text-black">
                                {`Round ${currentGameData.currentRound}/${currentGameData.totalRounds}`}
                            </h1>
                            <h5>
                                Next round is starting soon...
                            </h5>
                            <Row style={{marginBottom: "1em"}}>
                                <Col>
                                    <Carousel style={{height:'400px'}}>
                                        {[memes[0],memes[memes.length-1]]?.map((currentMeme, i) => {
                                            return (
                                                <Carousel.Item key={currentMeme?.id + i}>
                                                    <CarouselItemContent currentMeme={currentMeme} />
                                                    <Carousel.Caption>
                                                        {i === 1 && <h3 style={style}>Best Meme of the Round</h3>}
                                                        {i === 0 && <h3 style={style}>Best Meme of the Game</h3>}
                                                        {i === 2 && <h3 style={style}>Worst Meme of the Round</h3>}
                                                        <p style={style}>by {currentMeme.user.name} with {currentMeme.rating} points</p>
                                                    </Carousel.Caption>
                                                </Carousel.Item>
                                            )
                                        })}
                                    </Carousel>
                                </Col>
                            </Row>
                            <div className={"leaderboard card"}>
                                <h2 style={{textAlign: "center"}}> Leaderboard </h2>
                                <LeaderboardTable memes={memes} players={roundPlayers}/>
                            </div>
                        </Stack>
                    </div>
                    <Chat currentLobby={currentGameData}/>
                </Container>
            </div>
        )
    }
    //If final round and there is data for the players and memes
    else if (isFinalRound && memes.length && roundPlayers.length && bestMeme) {

        return (
            <div className={"leaderboard content"}>
                <Container>
                    <div className={"leaderboard card"}>
                        <Button
                            width="200px"
                            onClick={leaveGame}
                            className="lobby leave-btn game">
                            Leave
                        </Button>
                        <h2 style={{textAlign: "center", marginTop: "1em"}}> The Game has ended </h2>
                        <h5 style={{textAlign: "center", marginTop: "-0.5em"}}> {roundPlayers[0].name} wins! </h5>
                        <Stack direction={"horizontal"} style={{alignItems: "center", justifyContent: "center"}}>
                            {roundPlayers[1] ?
                                <AnimatedBarChart player={roundPlayers[1]} highScore={roundPlayers[0].score} rank={2}
                                                  meme={getPlayerMeme(roundPlayers[1])}/>
                                : null}
                            {roundPlayers[0] ?
                                <AnimatedBarChart player={roundPlayers[0]} highScore={roundPlayers[0].score} rank={1}
                                                  meme={getPlayerMeme(roundPlayers[0])}/>
                                : null}
                            {roundPlayers[2] ?
                                <AnimatedBarChart player={roundPlayers[2]} highScore={roundPlayers[0].score} rank={3}
                                                  meme={getPlayerMeme(roundPlayers[2])}/>
                                : null}

                        </Stack>
                    </div>
                    <div className={"leaderboard card"}>
                        <Row style={{marginBottom: "1em"}}>
                            <Col>

                                <Carousel style={{height:'400px'}}>
                                    {[bestMeme, memes[0], memes[memes.length-1]]?.map((currentMeme, i) => {

                                        return (
                                            <Carousel.Item key={currentMeme?.id + i}>
                                                <CarouselItemContent currentMeme={currentMeme} />

                                                <Carousel.Caption>
                                                    {i === 1 && <h3 style={style}>Best Meme of the Round</h3>}
                                                    {i === 0 && <h3 style={style}>Best Meme of the Game</h3>}
                                                    {i === 2 && <h3 style={style}>Worst Meme of the Round</h3>}
                                                    <p style={style}>by {currentMeme.user.name} with {currentMeme.rating} points</p>
                                                </Carousel.Caption>
                                            </Carousel.Item>
                                        )
                                    })}
                                </Carousel>
                            </Col>
                        </Row>
                    </div>
                    <div className={"leaderboard card"}>
                        <h2 style={{textAlign: "center"}}> Leaderboard </h2>
                        <LeaderboardTable memes={memes} players={roundPlayers}/>
                    </div>
                    <Chat currentLobby={currentGameData}/>
                </Container>
                {/*To disable it for testing, change to false*/}
                {true ? <Confetti width={width} height={1.4 * height} numberOfPieces={100}/> : null}
            </div>
        )
    } else {
        return (
            <div className="leaderboard content">
                <Button
                    width="200px"
                    onClick={leaveGame}
                    className="lobby leave-btn game">
                    Leave Game
                </Button>
                <Row> <Col> <Spinner/> </Col> </Row>
            </div>)
    }
}

export default Leaderboard;
