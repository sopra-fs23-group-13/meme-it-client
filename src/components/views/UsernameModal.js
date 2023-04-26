import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import {FormField} from "../../helpers/formField";
import "styles/views/Home.scss";
import {Button} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import {api} from "../../helpers/api";
import Cookies from "universal-cookie"
import {lobby, users} from "../../helpers/endpoints";
import {LoadingButton} from "../ui/LoadingButton";
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
        const response = await api.post(users, {name: username});
        localStorage.setItem("username", username)
        cookies.set("token", response.data.id)
        localStorage.setItem("code", props.code);
        console.log(localStorage.getItem("code"))
        try {
            await api.post(`${lobby}/${props.code}/players`, {name: response.data.name}, {headers: {'Authorization': 'Bearer ' + cookies.get("token")}});
        }
        catch (error){
            if (error.response !== undefined && error.response.status === 404){
                sessionStorage.setItem("alert", "Lobby Not Found")
            }
            //409 can also be caused by Full Lobby, so need to add possibility to differentiate in backend
            else if (error.response !== undefined && error.response.status === 423 ){
                sessionStorage.setItem("alert", "Game has already started")
            }
            else if (error.response !== undefined && error.response.status === 409 ){
                sessionStorage.setItem("alert", "Lobby is full")
            }
            else {
                sessionStorage.setItem("alert", "Something went wrong")
            }
            localStorage.clear();
            history.push("/lobby");
            handleClose();
            return;
        }
        history.push("/lobby");
        handleClose();
    }

    const createLobby = async () => {
        const response = await api.post(users, {name: username});
        localStorage.setItem("username", username)
        cookies.set("token", response.data.id)
        try {
            let {name, isPublic, maxPlayers, maxRounds, memeChangeLimit, superLikeLimit, superDislikeLimit, roundDuration, ratingDuration} = {name: "Lobby of " + localStorage.getItem("username"), isPublic:true, maxPlayers:4,maxRounds:3, memeChangeLimit:0, superLikeLimit:1, superDislikeLimit:1, roundDuration:60,ratingDuration:30  }
            const requestBody = JSON.stringify({name, isPublic, maxPlayers, maxRounds, memeChangeLimit, superLikeLimit, superDislikeLimit, roundDuration, ratingDuration});
            const createdLobby = await api.post(lobby, requestBody, {headers: {'Authorization': 'Bearer ' + cookies.get("token")}});
            localStorage.setItem("code", createdLobby.data.code);
            // Removed: Admin automatically added to player list on lobby creation
            // await api.post(`${lobby}/${createdLobby.data.code}/players`, {name: username},{headers: {'Authorization': 'Bearer ' + cookies.get("token")}});
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
                        <LoadingButton onClick={createLobby} loadingText={"Creating Lobby..."} buttonText={"Create Lobby"} disabledIf={username === ""}/>}
                    {props.title === LOBBY_JOIN &&
                        <LoadingButton onClick={submitAndJoin} loadingText={"Joining..."} buttonText={"Join Game"} disabledIf={username === ""}/>
                    }
                </Modal.Footer>
            </Modal>
        </>
    );
}; export default UsernameModal;