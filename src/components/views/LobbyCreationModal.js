import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import {FormField} from "../../helpers/formField";
import "styles/views/Home.scss";
import {Button} from "react-bootstrap";


const LobbyCreationModal = props => {
    const [show, setShow] = useState(false);
    const [lobbyValues, setLobbyValues] = useState({ username: props.username, lobby_name: "", player_limit: "", number_of_rounds: "", meme_change_limit: "", creation_time_limit: "", super_like_limit: "", voting_phase_time: "", lobby_code: ""});
    const handleClose = () => {setShow(false); props.close()};
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

            <Button className="home join-btn" disabled={false} onClick={handleShow}>Create Lobby</Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Lobby</Modal.Title>
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

                        <Form.Label>Player Limit: {lobbyValues.player_limit === "" ? 4 : lobbyValues.player_limit} </Form.Label>
                        <Form.Range defaultValue={4} min={2} max={8} name="player_limit" onChange={handleChange}/>

                        <Form.Label>Meme Change Limit</Form.Label>
                        <Form.Select style={{marginBottom:'1em'}} value={lobbyValues.meme_change_limit} name="meme_change_limit" onChange={handleChange}>
                            <option>0</option>
                            <option>3</option>
                            <option>5</option>
                            <option>10</option>
                        </Form.Select>

                        <Form.Label>Creation Time Limit: {lobbyValues.creation_time_limit === '' ? 60 : lobbyValues.creation_time_limit} seconds</Form.Label>
                        <Form.Range defaultValue={60} min={15} max={180} name="creation_time_limit" onChange={handleChange}/>

                        <Form.Label>Voting Phase Limit: {lobbyValues.voting_phase_time === '' ? 30 : lobbyValues.voting_phase_time} seconds</Form.Label>
                        <Form.Range defaultValue={30} min={15} max={180} name="voting_phase_time" onChange={handleChange}/>

                        <Form.Label>Super Like Limit: {lobbyValues.super_like_limit === '' ? 1 : lobbyValues.super_like_limit}</Form.Label>
                        <Form.Range defaultValue={1} min={0} max={10} name="super_like_limit" onChange={handleChange}/>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button className="home join-btn" onClick={submit}>
                        Create Lobby
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}; export default LobbyCreationModal;