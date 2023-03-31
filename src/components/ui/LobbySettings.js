import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import {FormField} from "../../helpers/formField";
import "styles/views/Home.scss";



const LobbySettings = () => {

    const [lobbyValues, setLobbyValues] = useState({
        lobby_name: "",
        player_limit: "",
        number_of_rounds: "",
        meme_change_limit: "",
        creation_time_limit: "",
        super_like_limit: "",
        voting_phase_time: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setLobbyValues({
            ...lobbyValues,
            [name]: value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault(); //noch anpassen
        console.log("Form submitted with values:", lobbyValues);
    };

    return (
        <Form onSubmit={handleSubmit}>
            <FormField
                label="Lobby Name"
                type="text"
                placeholder={"Lobby Name"}
                name="lobby_name"
                value={lobbyValues.lobby_name}
                onChange={handleChange}
            />
            <FormField
                label="Player Limit"
                placeholder="Player Limit"
                type="number"
                name="player_limit"
                value={lobbyValues.player_limit}
                onChange={handleChange}
            />
            <FormField
                label="Number of Rounds"
                placeholder="Number of Rounds"
                type="number"
                name="number_of_rounds"
                value={lobbyValues.number_of_rounds}
                onChange={handleChange}
            />
            <FormField
                label="Meme change limit"
                placeholder="Meme change limit"
                type="number"
                name="meme_change_limit"
                value={lobbyValues.meme_change_limit}
                onChange={handleChange}
            />
            <FormField
                label="Creation time limit (in seconds)"
                placeholder="Creation time limit (in seconds)"
                type="text"
                name="creation_time_limit"
                value={lobbyValues.creation_time_limit}
                onChange={handleChange}
            />
            <FormField
                label="Super like limit"
                placeholder="Super like limit"
                type="number"
                name="super_like_limit"
                value={lobbyValues.super_like_limit}
                onChange={handleChange}
            />
            <FormField
                label="Voting phase time (in seconds)"
                placeholder="Voting phase time (in seconds)"
                type="number"
                name="voting_phase_time"
                value={lobbyValues.voting_phase_time}
                onChange={handleChange}
            />
        </Form>
    );
}

export default LobbySettings;