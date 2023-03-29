import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import {FormField} from "../../helpers/formField";
import "styles/views/Home.scss";
import {Button} from "react-bootstrap";
import LobbyCreationModal from "./LobbyCreationModal";
const LOBBY_CREATION = "Create Lobby";
const LOBBY_JOIN = "Join Game";

const UsernameModal = props => {
    const [show, setShow] = useState(false);
    const [usernameValues, setUsernameValues] = useState({ username: ""});
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUsernameValues((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const submit = (childValues) => {
        let values = {
            username: usernameValues.username
        }
        // check if the key exists, then return the complete lobby to home else just the username
        if("lobby_name" in childValues)
            values = {
                ...childValues,
                username: usernameValues.username
            }
        props.submit(values);
        handleClose();
    }

    return (
        <>
            <Button onClick={handleShow}>{props.title}</Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Enter your username</Modal.Title>
                </Modal.Header>
                <Modal.Body className={"customModal customContainer"} >
                    <Form>
                        <FormField
                            label="Username"
                            type="text"
                            placeholder={"Username"}
                            name="username"
                            value={usernameValues.username}
                            onChange={handleChange}
                        />
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    {props.title === LOBBY_CREATION &&
                        <LobbyCreationModal username={usernameValues.username} submit={submit} close={handleClose} />
                    }
                    {props.title === LOBBY_JOIN &&
                        <Button variant="primary" onClick={submit}>
                            Set username
                        </Button>
                    }
                </Modal.Footer>
            </Modal>
        </>
    );
}; export default UsernameModal;