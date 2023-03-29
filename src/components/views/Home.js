import {api, handleError} from 'helpers/api';
import Modal from 'react-modal';
import { CgEnter } from 'react-icons/cg';

import React, {useEffect, useState} from 'react';
import {Button} from 'components/ui/Button';
import BaseContainer from "../ui/BaseContainer";
import "styles/views/Home.scss";
import PropTypes from "prop-types";
import {useHistory} from "react-router-dom";


const FormField = props => {
    return (
        <div>
            <input
                type={props.type}
                placeholder={props.placeholder}
                value={props.value}
                className={props.className}
                onChange={e => props.onChange(e.target.value)}
            />
        </div>
    );
};

FormField.propTypes = {
    className: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func
};

const lobbyItem = (lobby) => {
}



const Home = () => {
    const history = useHistory();
    const [hash, setHash] = useState(null);
    const [username, setUsername] = useState(null);
    const [showLobbyList, setShowLobbyList] = useState(false);


    const usernamePopupStyle = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '50%',
            paddingRight: '50px',
            paddingLeft: '50px',
            paddingBottom:'20px',
            paddingTop:'10px',
            transform: 'translate(-50%, -50%)',
            textAlign:'center',
            background: "rgba(255, 255, 255, 0.85)"
        },
    };

    const [userPopupIsOpen, setIsOpen] = React.useState(false);
    function openModal() {
        setIsOpen(true);
    }
    function closeUserPopup() {
        setIsOpen(false);
    }

    // Idea: Regardless of whether user joins using a Public Lobby Join button or a specific hash, if they press the
    // join button it always joins using the join hash method but in case of public lobby it just gets the lobby's hash
    // first.
    // Check if user has a name set in joinGame method.
    const joinHash = () => {
        if(!hash){
            //Popup: You need to enter a hash (should only happen if they try to join using hash code)
            return;
        }
        //Check if hash valid, otherwise show alert.
        history.push("/" + hash);
    }



    const joinGame = () => {
        if(!username){
            //Popup: You need to set a name
            return (openModal())
        }
        //do SetHash with the Hash of the Public Lobby
        joinHash() //Then Join that Hash using joinHash
    }
    const lobbyList  = () => {
        return(
            <div className="home container lobby">
                <div className="home lobby-list">
                    <p className="home lobby-list column-name">Name</p>
                    <p className="home lobby-list column-name">Players</p>
                    <Button className="home refresh-btn"> Refresh </Button>
                </div>
                <div className="home lobby-list lobbies">
                    <ul>
                        List of Lobbies here
                    </ul>
                </div>
            </div>
        )
    }
    const lobbyListText = () => {
        if(showLobbyList){
            return "Close List"
        }
        return "View Games"
    }
    return (
        <div>

            <Modal
                isOpen={userPopupIsOpen}
                onRequestClose={closeUserPopup}
                style={usernamePopupStyle}
                contentLabel="Set Username"
            >
                <h2 className="home popup-title"> Pick a Username first! </h2>
                <form>
                    <FormField className="home input username popup" placeholder="Enter Username" value={username} onChange={n => setUsername(n)}></FormField>
                </form>
                <Button className="home close-popup-btn" onClick={closeUserPopup}> Close </Button>
            </Modal>

            <div>
                <h1 className="home title">Meme-It</h1>
                <p className="home subtitle"> The Meme Creation Game</p>
            </div>
            <BaseContainer className="home container">
                <FormField className="home input username" placeholder="Enter Username" value={username} onChange={n => setUsername(n)}></FormField>
                <div className="home container join-hash">
                    <FormField className="home input hash" placeholder="Game Hash" value={hash} onChange={h => setHash(h)}></FormField>
                    <Button className ="home join-btn" onClick={() => joinGame()}> <CgEnter/> </Button>
                </div>
                <Button> Create Lobby</Button>
                <Button onClick={() => setShowLobbyList(!showLobbyList)} >{lobbyListText()}</Button>
            </BaseContainer>
            {showLobbyList && lobbyList()}
            <BaseContainer className = "home container tutorial">
                <p className = "home tutorial-title">How To Play</p>
                <div className ="home tutorial-text">
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
                </div>
            </BaseContainer>
        </div>
    )
}

export default Home;