import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import "styles/views/Home.scss";
import "styles/views/LobbySettings.scss";
import {Button, Col, Container, Row} from "react-bootstrap";
import PropTypes from "prop-types";
import {api} from "../../helpers/api";
import Cookies from "universal-cookie";
import {lobby} from "../../helpers/endpoints";
import {BsFillPersonFill, BsArrowRepeat} from "react-icons/bs";
import {FaExchangeAlt} from "react-icons/fa";
import {AiOutlineClockCircle, AiFillLock} from "react-icons/ai";
import {MdModeEdit} from "react-icons/md";
import {GiCardJoker} from "react-icons/gi";
import RangeSlider from 'react-bootstrap-range-slider';


const LobbySettings = ({Lobby, isAdmin, isEditable}) => {
    const cookies = new Cookies();
    const [lobbyValues, setLobbyValues] = useState(Lobby.lobbySetting);

    if(!isAdmin && Lobby.lobbySetting !== lobbyValues) setLobbyValues(Lobby.lobbySetting);

    LobbySettings.propTypes = {
        Lobby: PropTypes.object,
        isAdmin: PropTypes.bool
    }
    const updateSettings = async () => {
        try {
            await api.put(`${lobby}/${Lobby.code}`, JSON.stringify(lobbyValues), {headers: {'Authorization': 'Bearer ' + cookies.get("token")}});
        }
        catch (error){
            console.log(error);
        }
    }

    const handleChange = async (event) => {
        const { name, value } = event.target;
        if(name === "isPublic"){
            setLobbyValues({
                ...lobbyValues,
                [name]: value,
            });
            await updateSettings();
        }
        else if(name === "name"){
            setLobbyValues({
                ...lobbyValues,
                [name]: value,
            });
        }
        else {
            setLobbyValues({
                ...lobbyValues,
                [name]: Number(value),
            });
            await updateSettings();
        }
    };

    return (
        <Container className={"lobby card settings"}>
            <Row>
                <Col xs={6} className={"lobbySettings label"}>
                    <AiFillLock/> Visibility
                </Col>
                <Col>
                    <Form.Select style={{marginBottom:'1em'}} value={lobbyValues.isPublic} onClick={handleChange} name="isPublic" onChange={handleChange} disabled={isEditable || !isAdmin}>
                        <option value={true}>Public</option>
                        <option value={false}>Private</option>
                    </Form.Select>
                </Col>
            </Row>
            <Row>
                <Col xs={6} className={"lobbySettings label"}>
                    <MdModeEdit/> Lobby Name
                </Col>
                <Col>
                    <Form.Control
                        type={"text"}
                        placeholder={"Enter lobby name..."}
                        name={"name"}
                        className={"lobbySettings input"}
                        onChange={handleChange}
                        disabled={isEditable || !isAdmin}
                    />
                </Col>
                {isAdmin ?
                    (
                        <Col style={{alignContent:"right"}} md={"auto"}>
                            <Button variant={"dark"} onClick={updateSettings} disabled={lobbyValues.name === '' || lobbyValues.name === Lobby.name}>
                                Set
                            </Button>
                        </Col>
                    )
                    : (<></>)
                }

            </Row>
            <Row>
                <Col xs={6} className={"lobbySettings label"}>
                    <BsFillPersonFill/> Players
                </Col>
                <Col>

                    <RangeSlider value={lobbyValues.maxPlayers} min={2} max={8} name="maxPlayers" onChange={handleChange} onAfterChange={handleChange} tooltipPlacement={"top"} tooltip={"auto"} variant={"dark"} disabled={isEditable || !isAdmin}/>
                </Col>
            </Row>
            <Row>
                <Col xs={6} className={"lobbySettings label"}>
                    <BsArrowRepeat/> Rounds
                </Col>
                <Col>
                    <Form.Select style={{marginBottom:'1em'}} value={lobbyValues.maxRounds} onClick={handleChange} name="maxRounds" onChange={handleChange} disabled={isEditable || !isAdmin}>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={5}>5</option>
                    </Form.Select>
                </Col>
            </Row>
            <Row>
                <Col style={{marginBottom:"0.5em"}} xs={6} className={"lobbySettings label"}>
                    <FaExchangeAlt/> Meme Changes per Game
                </Col>
                <Col>
                    <Form.Select style={{marginBottom:'0.25em'}} value={lobbyValues.memeChangeLimit} onClick={handleChange} name="memeChangeLimit" onChange={handleChange} disabled={isEditable || !isAdmin}>
                        <option value={0}>0</option>
                        <option value={3}>3</option>
                        <option value={5}>5</option>
                    </Form.Select>
                </Col>
            </Row>
            <Row>
                <Col xs={6} className={"lobbySettings label"}>
                    <AiOutlineClockCircle/> Creation Time
                </Col>
                <Col>
                    <RangeSlider value={lobbyValues.roundDuration} min={15} max={180} name="roundDuration" onChange={handleChange} onAfterChange={handleChange} tooltipPlacement={"top"} tooltipLabel={currentValue => `${currentValue} seconds`} tooltip={"auto"} variant={"dark"} disabled={isEditable || !isAdmin}/>
                </Col>
            </Row>
            <Row style={{marginBottom:"1em"}}>
                <Col xs={6} className={"lobbySettings label"}>
                    <AiOutlineClockCircle/> Voting Time
                </Col>
                <Col>
                    <RangeSlider value={lobbyValues.ratingDuration} min={15} max={180} name="ratingDuration" onChange={handleChange} onAfterChange={handleChange} tooltip={"auto"} tooltipLabel={currentValue => `${currentValue} seconds`} variant={"dark"} disabled={isEditable || !isAdmin}/>
                </Col>
            </Row>
            <Row>
                <hr className={"lobby line"}/>
            </Row>
            <Row>
                <Col md={"auto"}>
                    <GiCardJoker className={"lobbySettings special-icon"}/>
                </Col>
                <Col>
                    <Row>
                        <Col xs={5} className={"lobbySettings label"}>
                            Super Likes per Round
                        </Col>
                        <Col>
                            <Form.Select style={{marginBottom:'0.25em'}} value={lobbyValues.superLikeLimit} onClick={handleChange} name="superLikeLimit" onChange={handleChange} disabled={isEditable || !isAdmin}>
                                <option value={0}>Disabled</option>
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                            </Form.Select>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={5} className={"lobbySettings label"}>
                            Super Dislikes per Round
                        </Col>
                        <Col>
                            <Form.Select style={{marginTop:'0.25em'}} value={lobbyValues.superDislikeLimit} onClick={handleChange} name="superDislikeLimit" onChange={handleChange} disabled={isEditable || !isAdmin}>
                                <option value={0}>Disabled</option>
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                            </Form.Select>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    )

}

export default LobbySettings;