import React, {useEffect, useRef, useState} from "react";
import {ListGroup, Images, Col, Row, Stack, Table, Button, Badge, Container} from "react-bootstrap";
import "styles/views/Leaderboard.scss";
import { FaMedal } from 'react-icons/fa';
import PropTypes from "prop-types";
import Meme from "../../models/Meme";
import {api} from "../../helpers/api";
import {game as gameEndpoint, lobby} from "../../helpers/endpoints";
import Player from "../../models/Player";
import {Spinner} from "../ui/Spinner";
import TimerProgressBar from "../ui/TimerProgressBar";
import Modal from "react-bootstrap/Modal";
import Cookies from "universal-cookie";
import {useHistory, useParams} from "react-router-dom";
import AnimatedBarChart from "../ui/AnimatedBarChart";
import Confetti from "react-confetti";
import {useWindowSize} from "react-use";

const Leaderboard = () => {
    const delay = 1000;
    const { width, height } = useWindowSize()
    const {id} = useParams();
    const history = useHistory();
    const cookies = new Cookies();
    const [roundPlayers, setRoundPlayers] = useState([]); //All players and their score throughout all rounds
    const [memes, setMemes] = useState([]); // All memes of this round and their rating
    const [showMeme, setShowMeme] = useState(false );
    const [enlargedMeme, setEnlargedMeme] = useState(null);
    const [bestMeme, setBestMeme] = useState(null);
    const [isFinalRound, setIsFinalRound] = useState(false);
    const [gameData, setGameData] = useState(null);
    const [now, setNow] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const leaveGame = async () => {
        //const leaveResponse = await api.delete('/' + localStorage.getItem("code") + '/players', {name: JSON.stringify(localStorage.getItem("username"))});
        localStorage.clear()
        sessionStorage.clear()
        sessionStorage.setItem("alert", "Disconnected")
        cookies.remove("token")
        history.push("/")
    }

    const handleNextRound = async () => {
        setIsPlaying(false);
        history.push("/game/" + id);
    };

    function findPlayerById(playerList, id) {
        return playerList.find((player) => {
            return player.id === id;
        })
    }

    function getPlayerMeme(player) {
        return memes.find((meme) => {
            return meme.user.id === player.id;
        })
    }

    const handleClose = () => setShowMeme(false);
    function EnlargedMeme() {
        return (
            <Modal
                show={showMeme}
                onHide={handleClose}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                {enlargedMeme ? (<img src={enlargedMeme.imageUrl}/>) : <div><Spinner/></div>}
            </Modal>
        );
    }


    const clickableMeme = (meme) => {
        return (
            <div>
                <img  style={{width:100, cursor:"pointer"}} src={meme.imageUrl} onClick={()=> {
                    setEnlargedMeme(meme)
                    setShowMeme(true)
                }}/>
            </div>
        )
    }


    const getRankSymbol = (index) => {
        if(index === 0) {
            return <FaMedal size={24} color="#d7b912" />
        }
        if(index === 1) {
            return <FaMedal size={24} color="#a1a1a1" />
        }
        if(index === 2) {
            return <FaMedal size={24} color="#cd7f32" />
        }
        return <p style={{marginLeft:"4px"}}>{"#" + (index + 1)}</p>
    }

    const pointDifference = (player) => {
        const meme = getPlayerMeme(player);
        if(meme.rating>0) {
            return <Badge pill bg={"success"} style={{fontSize:"14px"}}>
                + {meme.rating}
            </Badge>
        }
        else if (meme.rating<0) {
            return <Badge pill bg={"danger"} style={{fontSize:"14px"}}>
               - {-1*meme.rating}
            </Badge>
        }
        else {
            return <Badge pill bg={"secondary"} style={{fontSize:"14px"}}>
                + 0
            </Badge>
        }

    }
    const Leaderboard = () => {
        return (
            <Table responsive className={"leaderboard table"}>
                <thead>
                <tr style={{fontSize:'16px'}}>
                    <th>Place</th>
                    <th>Name</th>
                    <th>Score</th>
                    <th width={1}>Meme</th>
                </tr>
                </thead>
                <tbody>
                {roundPlayers.map((player, index) => {
                    return (
                        <tr style={{fontSize:'18px'}} key={index}>
                            <td>{getRankSymbol(index)}</td>
                            <td>{player.name}</td>
                            <td>{player.score} Points {pointDifference(player)} </td>
                            <td>{clickableMeme(getPlayerMeme(player))}</td>
                        </tr>
                    )
                })
                }
                </tbody>
            </Table>
        )
    }

    useEffect(() => {
        const getLeaderboardData = async () => {
            /*
            if(!startTime){
                setStartTime(Date.now())
            }
            setNow(Date.now() - startTime)

             */

            let currentMemes = []
            let players = []
            try {
                // Game Data to know if final results state
                const gameDataResponse = await api.get(`${gameEndpoint}/${id}`, { headers: { 'Authorization': `Bearer ${cookies.get("token")}` }});
                setGameData(gameDataResponse.data);

                if(gameData.gameState != "ROUND_RESULTS" && gameData.gameState != "GAME_RESULTS"){
                    await handleNextRound();
                }

                // Memes of the round (get players)
                const roundMemesResponse = await api.get(`${gameEndpoint}/${id}/meme`, { headers: { 'Authorization': `Bearer ${cookies.get("token")}` }});
                // Ratings of the round (get current memes and ratings)
                const roundRatingsResponse = await api.get(`${gameEndpoint}/${id}/rating`, { headers: { 'Authorization': `Bearer ${cookies.get("token")}` }});
                // All ratings of the game (get total score tc.)
                const gameRatingsResponse = await api.get(`${gameEndpoint}/${id}/winner`, { headers: { 'Authorization': `Bearer ${cookies.get("token")}` }});

                for (let meme of roundMemesResponse.data) {
                    let m = new Meme(meme);
                    let p = new Player(meme.user);
                    p.score = 0;
                    m.rating = 0;
                    for (let rating of roundRatingsResponse.data) {
                        if (rating.meme.id === meme.id) {
                            m.rating += rating.rating;
                        }
                    }
                    players.push(p);
                    currentMemes.push(m);
                }
                for (let rating of gameRatingsResponse.data) {
                    let p = findPlayerById(players, rating.meme.user.id);
                    if (p === undefined) {
                        p = new Player(rating.meme.user);
                        p.score = 0;
                        players.push(p);
                    }
                    p.score += rating.rating;
                }
                if(gameDataResponse.data.gameState == "GAME_RESULTS"){
                    setIsFinalRound(true);
                }
            }
            catch (error){
                console.log(error)
            }
            players.sort((a, b) => {
                return b.score - a.score
            });
            currentMemes.sort((a, b) => {
                return b.rating - a.rating
            });
            setRoundPlayers(players);
            setMemes(currentMemes);
            if(!bestMeme || bestMeme.rating < currentMemes[0].rating) {
                setBestMeme(currentMemes[0])
            }
            setIsPlaying(true)
        }
        if (memes.length && roundPlayers.length && gameData) {
            getLeaderboardData().then();
        }
        const interval = setInterval(async () => {
            await getLeaderboardData();
        }, 1000);
        return () => clearInterval(interval);
    })


    //If final round and there is data for the players and memes
    if (isFinalRound && memes.length && roundPlayers.length) {
        return (
            <div className={"leaderboard content"} style={{marginTop:"1em"}}>
                <Container>
                    <div className={"leaderboard card"} >
                        <Button
                            width="200px"
                            onClick={leaveGame}
                            className="lobby leave-btn game">
                            Leave
                        </Button>
                        <h2 style={{textAlign:"center",marginTop:"1em"}}> The Game has ended </h2>
                        <h5 style={{textAlign:"center", marginTop:"-0.5em"}}> {roundPlayers[0].name} wins! </h5>
                        <Stack direction={"horizontal"} style={{alignItems:"center", justifyContent:"center"}}>
                                <AnimatedBarChart player={roundPlayers[1]} highScore={roundPlayers[0].score} rank={2} meme={getPlayerMeme(roundPlayers[1])}/>
                                <AnimatedBarChart player={roundPlayers[0]} highScore={roundPlayers[0].score} rank={1} meme={getPlayerMeme(roundPlayers[0])}/>
                                {roundPlayers[2] ?
                                    <AnimatedBarChart player={roundPlayers[2]} highScore={roundPlayers[0].score} rank={3} meme={getPlayerMeme(roundPlayers[2])}/>
                                    : null }

                        </Stack>
                    </div>
                    <div className={"leaderboard card"}>
                        <Row style={{marginBottom:"1em"}}>
                            <Col >
                                <div className={"leaderboard card meme"} style={{height:"100%", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:"0"}}>
                                    <h2 style={{textAlign:"center"}}> Meme of the Game</h2>
                                    <img src={bestMeme.imageUrl} style={{cursor:"pointer",border:"solid white 5px"}} className={"leaderboard best-meme-image"} onClick={() => {
                                        setEnlargedMeme(bestMeme)
                                        setShowMeme(true)}}>
                                    </img>
                                    <h5 style={{textAlign:"center"}}>
                                        by {bestMeme.user.name} with {bestMeme.rating} points
                                    </h5>
                                </div>
                            </Col>
                            <Col md={"auto"} style={{marginBottom:"0.5em",marginTop:"0.5em"}}>
                            </Col>
                            <Col >
                                <div className={"leaderboard card meme"} style={{height:"100%", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:"0"}}>
                                    <h2 style={{textAlign:"center"}}> Meme of the Round</h2>
                                    <img src={memes[0].imageUrl} style={{cursor:"pointer",border:"solid white 5px"}} className={"leaderboard best-meme-image"} onClick={() => {
                                        setEnlargedMeme(memes[0])
                                        setShowMeme(true)}}>
                                    </img>
                                    <h5 style={{textAlign:"center"}}>
                                        by {memes[0].user.name} with {memes[0].rating} points
                                    </h5>
                                </div>
                            </Col>
                        </Row>


                    </div>
                    <div className={"leaderboard card"}>
                        <h2 style={{textAlign:"center"}}> Leaderboard </h2>
                        <Leaderboard/>
                    </div>
                </Container>
                {/*To disable it for testing, change to false*/ }
                {true ? <Confetti width={width} height={1.4*height} numberOfPieces={100}/> : null }
                {enlargedMeme && showMeme && <EnlargedMeme/>}
            </div>
        )
    }
    //If not final round and there is data for the players and memes
    if (memes.length && roundPlayers.length) {
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
                                {`Round 1/3 `}
                            </h1>
                            <Row style={{marginBottom:"1em"}}>
                                <Col >
                                    <div className={"leaderboard card"} style={{height:"100%", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:"0"}}>
                                        <h2 style={{textAlign:"center"}}> Best Meme </h2>
                                        <img src={memes[0].imageUrl} style={{cursor:"pointer",border:"solid white 5px"}} className={"leaderboard best-meme-image"} onClick={() => {
                                            setEnlargedMeme(memes[0])
                                            setShowMeme(true)}}>
                                        </img>
                                        <h5 style={{textAlign:"center"}}>
                                            by {memes[0].user.name} with {memes[0].rating} points
                                        </h5>
                                    </div>
                                </Col>
                                <Col md={"auto"} style={{marginBottom:"0.5em",marginTop:"0.5em"}}>
                                </Col>
                                <Col >
                                    <div className={"leaderboard card"} style={{height:"100%", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:"0"}}>
                                        <h2 style={{textAlign:"center"}}> Worst Meme </h2>
                                        <img src={memes[memes.length-1].imageUrl} style={{cursor:"pointer",border:"solid white 5px"}} className={"leaderboard best-meme-image"} onClick={() => {
                                            setEnlargedMeme(memes[memes.length-1])
                                            setShowMeme(true)}}>
                                        </img>
                                        <h5 style={{textAlign:"center"}}>
                                            by {memes[memes.length-1].user.name} with {memes[memes.length-1].rating} points
                                        </h5>
                                    </div>
                                </Col>
                            </Row>
                            <div className={"leaderboard card"}>
                                <h2 style={{textAlign:"center"}}> Leaderboard </h2>
                                <Leaderboard/>
                            </div>
                            {enlargedMeme && showMeme && <EnlargedMeme/>}
                        </Stack>
                    </div>
                </Container>

            </div>
        )
    }
    else {
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
