import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import {FormField} from "../../helpers/formField";
import "styles/views/Home.scss";
import {Button, Container} from "react-bootstrap";
import PropTypes from "prop-types";
import {api} from "../../helpers/api";
import Cookies from "universal-cookie";
import {lobby} from "../../helpers/endpoints";
import {LoadingButton} from "./LoadingButton";

/**
 * TODO: start game -> remove it from public lobby list (as it is in progress)
 *
 * TODO: leaderboard?
 */

const LobbySettings = ({Lobby, isAdmin, isEditable}) => {
    const cookies = new Cookies();
    const [lobbyValues, setLobbyValues] = useState({
        name: Lobby.name,
        maxPlayers: Lobby.lobbySetting.maxPlayers,
        maxRounds: Lobby.lobbySetting.maxRounds,
        memeChangeLimit: Lobby.lobbySetting.memeChangeLimit,
        roundDuration: Lobby.lobbySetting.roundDuration,
        ratingDuration: Lobby.lobbySetting.ratingDuration,
        superLikeLimit: Lobby.lobbySetting.superLikeLimit,
        superDislikeLimit: Lobby.lobbySetting.superDislikeLimit,
        isPublic: Lobby.lobbySetting.isPublic
    });

    LobbySettings.propTypes = {
        Lobby: PropTypes.object,
        isAdmin: PropTypes.bool
    }
    const updateSettings = async () => {
        try {
            console.log(lobbyValues)
            await api.put(`${lobby}/${Lobby.code}`, JSON.stringify(lobbyValues), {headers: {'Authorization': 'Bearer ' + cookies.get("token")}});
        }
        catch (error){
            console.log(error);
        }
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        if(name === "isPublic"){
            setLobbyValues({
                ...lobbyValues,
                [name]: !Lobby.lobbySetting.isPublic,
            });
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
        }

    };

    const handleSubmit = (event) => {
        event.preventDefault(); //noch anpassen
        console.log("Form submitted with values:", lobbyValues);
    };

    if(isAdmin){
        return (
            <Container className={"lobby settings-container"}>
                <Form.Check
                    type="switch"
                    id="custom-switch"
                    label="Private"
                    reverse={true}
                    name="isPublic"
                    defaultChecked={!Lobby.lobbySetting.isPublic}
                    onChange={handleChange}
                    disabled={isEditable}
                />


                <Form onSubmit={handleSubmit}>
                    <Form.Label><b>Lobby Name</b></Form.Label>
                    <FormField
                        label="Lobby Name"
                        type="text"
                        placeholder={Lobby.name}
                        name="name"
                        value={lobbyValues.name}
                        onChange={handleChange}
                        disabled={isEditable}
                    />

                    <Form.Label><b>Player Limit:</b> {lobbyValues.maxPlayers === "" ? Lobby.lobbySetting.maxPlayers : lobbyValues.maxPlayers} </Form.Label>
                    <Form.Range defaultValue={Lobby.lobbySetting.maxPlayers} min={2} max={8} name="maxPlayers" onChange={handleChange} disabled={isEditable}/>

                    <Form.Label><b>Number of Rounds:</b> {lobbyValues.maxRounds === "" ? Lobby.lobbySetting.maxRounds : lobbyValues.maxRounds} </Form.Label>
                    <Form.Range defaultValue={Lobby.lobbySetting.maxRounds} min={1} max={6} name="maxRounds" onChange={handleChange} disabled={isEditable}/>

                    <Form.Label><b>Meme Change Limit</b></Form.Label>
                    <Form.Select style={{marginBottom:'1em'}} value={lobbyValues.memeChangeLimit} name="memeChangeLimit" onChange={handleChange} disabled={isEditable}>
                        <option>0</option>
                        <option>3</option>
                        <option>5</option>
                        <option>10</option>
                    </Form.Select>

                    <Form.Label><b>Meme Creation Time Limit:</b> {lobbyValues.roundDuration === '' ? Lobby.lobbySetting.roundDuration : lobbyValues.roundDuration} seconds</Form.Label>
                    <Form.Range defaultValue={Lobby.lobbySetting.roundDuration} min={15} max={180} name="roundDuration" onChange={handleChange} disabled={isEditable}/>

                    <Form.Label><b>Voting Phase Time Limit:</b> {lobbyValues.ratingDuration === '' ? Lobby.lobbySetting.ratingDuration : lobbyValues.ratingDuration} seconds</Form.Label>
                    <Form.Range defaultValue={Lobby.lobbySetting.ratingDuration} min={15} max={180} name="ratingDuration" onChange={handleChange} disabled={isEditable}/>

                    <Form.Label><b>Super Likes:</b> {lobbyValues.superLikeLimit === '' ? Lobby.lobbySetting.superLikeLimit : lobbyValues.superLikeLimit}</Form.Label>
                    <Form.Range defaultValue={Lobby.lobbySetting.superLikeLimit} min={0} max={10} name="superLikeLimit" onChange={handleChange} disabled={isEditable}/>
                    <Form.Label><b>Super Dislikes:</b> {lobbyValues.superDislikeLimit === '' ? Lobby.lobbySetting.superDislikeLimit : lobbyValues.superDislikeLimit}</Form.Label>
                    <Form.Range defaultValue={Lobby.lobbySetting.superDislikeLimit} min={0} max={10} name="superDislikeLimit" onChange={handleChange} disabled={isEditable}/>

                </Form>
                <LoadingButton onClick={updateSettings} buttonText={"Update Settings"} loadingText={"Updating..."} c_name={"primary"} disabledIf={isEditable}/>
            </Container>
        );
    }
    else {
        return (
            <Container className={"lobby settings-container"}>
                <p className={"lobby settings-text"}><b>Lobby Name:</b> {Lobby.name}</p>
                <p className={"lobby settings-text"}><b>Player Limit:</b> {Lobby.lobbySetting.maxPlayers}</p>
                <p className={"lobby settings-text"}><b>Number of Rounds:</b> {Lobby.lobbySetting.maxRounds}</p>
                <p className={"lobby settings-text"}><b>Meme Creation Time Limit:</b> {Lobby.lobbySetting.roundDuration}s</p>
                <p className={"lobby settings-text"}><b>Voting Phase Time Limit:</b> {Lobby.lobbySetting.ratingDuration}s</p>
                <p className={"lobby settings-text"}><b>Meme Change Limit:</b> {Lobby.lobbySetting.memeChangeLimit}</p>
                <p className={"lobby settings-text"}><b>Super Likes:</b> {Lobby.lobbySetting.superLikeLimit}</p>
                <p className={"lobby settings-text"}><b>Super Dislikes:</b> {Lobby.lobbySetting.superDislikeLimit}</p>
            </Container>
        )
    }

}

export default LobbySettings;