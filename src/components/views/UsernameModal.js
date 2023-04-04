import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import {FormField} from "../../helpers/formField";
import "styles/views/Home.scss";
import {Button} from "react-bootstrap";
import LobbyCreationModal from "./LobbyCreationModal";
import {useHistory} from "react-router-dom";
import {api} from "../../helpers/api";
import User from "../../models/User";
const LOBBY_CREATION = "Create Lobby";
const LOBBY_JOIN = "Join Game";

const UsernameModal = props => {
    const history = useHistory();
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
            username: usernameValues.username,
        }
        // check if the key exists, then return the complete lobby to home else just the username
        if("lobby_name" in childValues)
            values = {
                ...childValues,
                username: usernameValues.username
            }
        localStorage.setItem("username", usernameValues.username)
        props.submit(values);
        // Temporary Lobby Join (Through List)
        history.push("/lobby");
        handleClose();
        localStorage.setItem("hash", props.hash);
    }

    const createLobby = async (childValues) => {
        submit(childValues);
        try {
            let {name, owner, isPublic, maxPlayers, maxRounds, memeChangeLimit, superLikeLimit, superDislikeLimit, timeRoundLimit, timeVoteLimit} = {name: "Lobby of " + localStorage.getItem("username") , owner: localStorage.getItem("username"), isPublic:true, maxPlayers:4,maxRounds:3, memeChangeLimit:0, superLikeLimit:1, superDislikeLimit:1, timeRoundLimit:60,timeVoteLimit:30  }
            const requestBody = JSON.stringify({name, owner, isPublic, maxPlayers, maxRounds, memeChangeLimit, superLikeLimit, superDislikeLimit, timeRoundLimit, timeVoteLimit});
            const response = await api.post('/lobby', requestBody);
            localStorage.setItem("hash", response.data.code)
            /*
            Get Lobby Code from Response, then add player to lobby (doesn't work atm)
            let data = JSON.stringify(response.data);
            let lobbyCode = JSON.parse(data).code;
            console.log(JSON.parse(data).code)
            const response2 = await api.post('/' + lobbyCode + '/players', JSON.stringify({name: localStorage.getItem("username")}));
             */
        } catch {
            alert("Couldn't create lobby")
        }
        history.push("/lobby");
    }

    return (
        <>
            <Button disabled={props.joiningAllowed} className={props.c_names} onClick={handleShow}>{props.title}</Button>

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
                        <Button disabled={usernameValues.username===''} className="home join-btn"  onClick={createLobby}>
                            Set Username
                        </Button>                    }
                    {props.title === LOBBY_JOIN &&
                        <Button disabled={usernameValues.username===''} className="home join-btn"  onClick={submit}>
                            Set Username
                        </Button>
                    }
                </Modal.Footer>
            </Modal>
        </>
    );
}; export default UsernameModal;