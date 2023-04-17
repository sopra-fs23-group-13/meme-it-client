import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import {FormField} from "../../helpers/formField";
import "styles/views/Home.scss";
import {Button, Container, Row} from "react-bootstrap";
import PropTypes from "prop-types";
import {api} from "../../helpers/api";


const LobbySettings = ({Lobby, isAdmin}) => {
    const [lobbyValues, setLobbyValues] = useState({
        name: "",
        maxPlayers: "",
        maxRounds: "",
        memeChangeLimit: "",
        timeRoundLimit: "",
        timeVoteLimit: "",
        superLikeLimit: "",
        superDislikeLimit: "",
        isPublic: ""
    });

    LobbySettings.propTypes = {
        Lobby: PropTypes.object,
        isAdmin: PropTypes.bool
    }
    const updateSettings = async () => {
        console.log(lobbyValues.isPublic)
        try {
            await api.put('/lobby/' + Lobby.id, JSON.stringify(lobbyValues));
        }
        catch (error){
            console.log(error);
        }
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        if(name === "isPublic"){
            console.log(lobbyValues.isPublic)
            setLobbyValues({
                ...lobbyValues,
                [name]: !Lobby.lobbySetting.isPublic,
            });
        }
        else if(name == "name"){
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

    //This is required because on page refresh the Lobby is undefined for the first render and stops page from loading properly
    if(Lobby.lobbySetting === undefined){
        return (
            <div> Loading ...</div>
        )
    }

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
                    />

                    <Form.Label><b>Player Limit:</b> {lobbyValues.maxPlayers === "" ? Lobby.lobbySetting.maxPlayers : lobbyValues.maxPlayers} </Form.Label>
                    <Form.Range defaultValue={Lobby.lobbySetting.maxPlayers} min={2} max={8} name="maxPlayers" onChange={handleChange}/>

                    <Form.Label><b>Number of Rounds:</b> {lobbyValues.maxRounds === "" ? Lobby.lobbySetting.maxRounds : lobbyValues.maxRounds} </Form.Label>
                    <Form.Range defaultValue={Lobby.lobbySetting.maxRounds} min={1} max={6} name="maxRounds" onChange={handleChange}/>

                    <Form.Label><b>Meme Change Limit</b></Form.Label>
                    <Form.Select style={{marginBottom:'1em'}} value={lobbyValues.memeChangeLimit} name="memeChangeLimit" onChange={handleChange}>
                        <option>0</option>
                        <option>3</option>
                        <option>5</option>
                        <option>10</option>
                    </Form.Select>

                    <Form.Label><b>Meme Creation Time Limit:</b> {lobbyValues.timeRoundLimit === '' ? Lobby.lobbySetting.timeRoundLimit : lobbyValues.timeRoundLimit} seconds</Form.Label>
                    <Form.Range defaultValue={Lobby.lobbySetting.timeRoundLimit} min={15} max={180} name="timeRoundLimit" onChange={handleChange}/>

                    <Form.Label><b>Voting Phase Time Limit:</b> {lobbyValues.timeVoteLimit === '' ? Lobby.lobbySetting.timeVoteLimit : lobbyValues.timeVoteLimit} seconds</Form.Label>
                    <Form.Range defaultValue={Lobby.lobbySetting.timeVoteLimit} min={15} max={180} name="timeVoteLimit" onChange={handleChange}/>

                    <Form.Label><b>Super Likes:</b> {lobbyValues.superLikeLimit === '' ? Lobby.lobbySetting.superLikeLimit : lobbyValues.superLikeLimit}</Form.Label>
                    <Form.Range defaultValue={Lobby.lobbySetting.superLikeLimit} min={0} max={10} name="superLikeLimit" onChange={handleChange}/>
                    <Form.Label><b>Super Dislikes:</b> {lobbyValues.superDislikeLimit === '' ? Lobby.lobbySetting.superDislikeLimit : lobbyValues.superDislikeLimit}</Form.Label>
                    <Form.Range defaultValue={Lobby.lobbySetting.superDislikeLimit} min={0} max={10} name="superDislikeLimit" onChange={handleChange}/>

                </Form>
                <Button onClick={updateSettings}>Update Settings</Button>
            </Container>
        );
    }
    else {
        return (
            <Container className={"lobby settings-container"}>
                <p className={"lobby settings-text"}><b>Lobby Name:</b> {Lobby.name}</p>
                <p className={"lobby settings-text"}><b>Player Limit:</b> {Lobby.lobbySetting.maxPlayers}</p>
                <p className={"lobby settings-text"}><b>Number of Rounds:</b> {Lobby.lobbySetting.maxRounds}</p>
                <p className={"lobby settings-text"}><b>Meme Creation Time Limit:</b> {Lobby.lobbySetting.timeRoundLimit}s</p>
                <p className={"lobby settings-text"}><b>Voting Phase Time Limit:</b> {Lobby.lobbySetting.timeVoteLimit}s</p>
                <p className={"lobby settings-text"}><b>Meme Change Limit:</b> {Lobby.lobbySetting.memeChangeLimit}</p>
                <p className={"lobby settings-text"}><b>Super Likes:</b> {Lobby.lobbySetting.superLikeLimit}</p>
                <p className={"lobby settings-text"}><b>Super Dislikes:</b> {Lobby.lobbySetting.superDislikeLimit}</p>
            </Container>
        )
    }

}

export default LobbySettings;