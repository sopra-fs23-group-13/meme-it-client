import React, { useEffect, useState } from "react";
import {ListGroup, Images, Col, Row, Stack, Table, Button, Badge} from "react-bootstrap";
import "styles/views/Leaderboard.scss";
import { FaMedal } from 'react-icons/fa';
import PropTypes from "prop-types";
import Meme from "../../models/Meme";
import {api} from "../../helpers/api";
import {lobby} from "../../helpers/endpoints";
import Player from "../../models/Player";
import {Spinner} from "../ui/Spinner";
import TimerProgressBar from "../ui/TimerProgressBar";
import Modal from "react-bootstrap/Modal";
import Cookies from "universal-cookie";

const Leaderboard = ({ roundMemes, roundRatings, gameRatings}) => {
    const cookies = new Cookies();
    const [roundPlayers, setRoundPlayers] = useState([]); //All players and their score throughout all rounds
    const [memes, setMemes] = useState([]); // All memes of this round and their rating
    const [showMeme, setShowMeme] = useState(false );
    const [enlargedMeme, setEnlargedMeme] = useState(null);

    const leaveGame = async () => {
        //const leaveResponse = await api.delete('/' + localStorage.getItem("code") + '/players', {name: JSON.stringify(localStorage.getItem("username"))});
        localStorage.clear()
        sessionStorage.clear()
        sessionStorage.setItem("alert", "Disconnected")
        cookies.remove("token")
        history.push("/")
    }

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
                <Modal.Header closeButton>
                </Modal.Header>
                {enlargedMeme ? (<img src={enlargedMeme.imageUrl}/>) : <div><Spinner/></div>}
            </Modal>
        );
    }


    const clickableMeme = (meme) => {
        return (
            <div>
                <img  style={{width:60, cursor:"pointer"}} src={meme.imageUrl} onClick={()=> {
                    setEnlargedMeme(meme)
                    setShowMeme(true)
                }}/>
            </div>

        )

    }
    console.log(enlargedMeme)
    console.log(showMeme)


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
            return <Badge pill bg={"success"}>
                + {meme.rating}
            </Badge>
        }
        else if (meme.rating<0) {
            return <Badge pill bg={"danger"}>
               - {-1*meme.rating}
            </Badge>
        }
        else {
            return <Badge pill bg={"secondary"}>
                + 0
            </Badge>
        }

    }
    const leaderboard = () => {
        return (
            <Table className={"leaderboard table"}>
                <thead>
                <tr>
                    <th>Place</th>
                    <th>Name</th>
                    <th>Score</th>
                    <th>Meme</th>
                </tr>
                </thead>
                <tbody>
                {roundPlayers.map((player, index) => {
                    return (
                        <tr key={index}>
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
        const getRoundMemeData = async () => {
            let currentMemes = []
            let players = []
            for (let meme of roundMemes) {
                let m = new Meme(meme);
                let p = new Player(meme.user);
                p.score = 0;
                m.rating = 0;
                for (let rating of roundRatings) {
                    if (rating.meme.id === meme.id) {
                        m.rating += rating.rating;
                    }
                }
                players.push(p);
                currentMemes.push(m);
            }
            for (let rating of gameRatings) {
                let p = findPlayerById(players, rating.meme.user.id);
                if (p === undefined) {
                    p = new Player(rating.meme.user);
                    p.score = 0;
                    players.push(p);
                }
                p.score += rating.rating;
            }
            players.sort((a, b) => {
                return b.score - a.score
            });
            currentMemes.sort((a, b) => {
                return b.rating - a.rating
            });
            setRoundPlayers(players);
            setMemes(currentMemes);
        }
        if (memes.length === 0 || roundPlayers.length === 0) {
            getRoundMemeData();
        }
        const interval = setInterval(() => {
            getRoundMemeData();
        }, 10000);
        return () => clearInterval(interval);
    })



    if (memes.length > 0 && roundPlayers.length > 0) {
        return (
            <div className="leaderboard content">
                <div className={"leaderboard card"}>
                    <Button
                        width="200px"
                        onClick={leaveGame}
                        className="lobby leave-btn game">
                        Leave Game
                    </Button>
                    <Stack gap={2}>
                        <h1 className="fw-bolder fs-3 text-start text-black">
                            {`Round 1/3 `}
                        </h1>
                        <TimerProgressBar
                            delay={1}
                            now={50}
                            max={100}
                            callbackFunc={() => {}}
                            isPlaying={true}
                        />
                    </Stack>
                    <div className={"leaderboard card"}>
                        <h2 style={{textAlign:"center"}}> Meme of the Round </h2>
                        <img src={memes[0].imageUrl} style={{cursor:"pointer"}} className={"leaderboard best-meme-image"} onClick={() => {
                            setEnlargedMeme(memes[0])
                            setShowMeme(true)}}>
                        </img>
                        <h5 style={{textAlign:"center"}}>
                            by {memes[0].user.name} with {memes[0].rating} points
                        </h5>
                    </div>
                    <Row style={{marginTop:"1em"}}>
                        <div className={"leaderboard card"}>
                            <h2 style={{textAlign:"center"}}> Leaderboard </h2>
                            {leaderboard()}
                        </div>
                    </Row>
                    {enlargedMeme && showMeme && <EnlargedMeme/>}
                </div>
            </div>
        )
    }
    else {
        return (
            <div className="leaderboard content">
                <Row> <Col> <Spinner/> </Col> </Row>
            </div>)
    }
}

export default Leaderboard;
