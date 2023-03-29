import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import {FormField} from "../../helpers/formField";
import "styles/views/Home.scss";
import {Button} from "react-bootstrap";


const LobbyCreationModal = props => {
    const [show, setShow] = useState(false);
    const [lobbyValues, setLobbyValues] = useState({ username: props.username, lobby_name: "", player_limit: "", number_of_rounds: "", meme_change_limit: "", creation_time_limit: "", super_like_limit: "", voting_phase_time: "", lobby_code: ""});
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setLobbyValues((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const submit = () => {
        props.submit(lobbyValues);
        handleClose();
    }

    return (
        <>
            <Button className={"home buttons"} onClick={handleShow}>Create Lobby</Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create new lobby</Modal.Title>
                </Modal.Header>
                <Modal.Body className={"customModal customContainer"} >
                    <Form>
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
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={submit}>
                        Create new lobby
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}; export default LobbyCreationModal;