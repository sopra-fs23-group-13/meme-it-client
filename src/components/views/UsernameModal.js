import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import {FormField} from "../../helpers/formField";
import "styles/views/Home.scss";
import {Button} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import {api} from "../../helpers/api";
import Cookies from "universal-cookie"
const LOBBY_CREATION = "Create Lobby";
const LOBBY_JOIN = "Join Game";

const UsernameModal = props => {
    const cookies = new Cookies();
    const history = useHistory();
    const [show, setShow] = useState(false);
    const [username, setUsername] = useState("");
    const handleClose = () => {
        setUsername("");
        setShow(false);
    }
    const handleShow = () => setShow(true);
    const handleChange = (event) => {
        setUsername(event.target.value);
    };
    const submitAndJoin = async () => {
        const response = await api.post('/users', {name: username});
        localStorage.setItem("username", username)
        cookies.set("token", response.data.uuid)
        localStorage.setItem("code", props.code);
        console.log(localStorage.getItem("code"))
        try {
            await api.post('/lobbies/' + props.code + '/players', {name: response.data.name}, {headers: {'Authorization': 'Bearer ' + cookies.get("token")}});
        }
        catch{
            sessionStorage.setItem("alert", "Lobby Not Found")
            localStorage.clear();
            history.push("/lobby");
            handleClose();
            return;
        }
        history.push("/lobby");
        handleClose();
    }

    const createLobby = async () => {
        const response = await api.post('/users', {name: username});
        localStorage.setItem("username", username)
        cookies.set("token", response.data.uuid)
        try {
            let {name, isPublic, maxPlayers, maxRounds, memeChangeLimit, superLikeLimit, superDislikeLimit, timeRoundLimit, timeVoteLimit} = {name: "Lobby of " + localStorage.getItem("username"), isPublic:true, maxPlayers:4,maxRounds:3, memeChangeLimit:0, superLikeLimit:1, superDislikeLimit:1, timeRoundLimit:60,timeVoteLimit:30  }
            const requestBody = JSON.stringify({name, isPublic, maxPlayers, maxRounds, memeChangeLimit, superLikeLimit, superDislikeLimit, timeRoundLimit, timeVoteLimit});
            const response = await api.post('/lobbies', requestBody, {headers: {'Authorization': 'Bearer ' + cookies.get("token")}});
            localStorage.setItem("code", response.data.code)
            await api.post('/lobbies/' + response.data.code + '/players', {name: username}, {headers: {'Authorization': 'Bearer ' + cookies.get("token")}});
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
                            value={username}
                            onChange={handleChange}
                        />
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    {props.title === LOBBY_CREATION &&
                        <Button disabled={username===''} className="home join-btn"  onClick={createLobby}>
                            Set Username
                        </Button>                    }
                    {props.title === LOBBY_JOIN &&
                        <Button disabled={username===''} className="home join-btn"  onClick={submitAndJoin}>
                            Set Username
                        </Button>
                    }
                </Modal.Footer>
            </Modal>
        </>
    );
}; export default UsernameModal;