import {api, handleError} from 'helpers/api';
import {useEffect, useState} from 'react';
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
    const [show, setShow] = useState(false);

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
            return;
        }
        //do SetHash with the Hash of the Public Lobby
        //Do joinHash()
    }
    const lobbyList  = () => {
        return(
            <div className="home container lobby">
                <div className="home lobby-list">
                    <p className="home lobby-list column-name">Name</p>
                    <p className="home lobby-list column-name">Players</p>
                    <Button className="home refresh-btn">Refresh</Button>
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
        if(show){
            return "Close List"
        }
        return "View Games"
    }

    return (
        <div>
            <div className="home title">
                Meme-It
            </div>
            <BaseContainer className="home container">
                <FormField className="home input username" placeholder="Enter Username" value={username} onChange={n => setUsername(n)}></FormField>
                <div className="home container join">
                    <FormField className="home input hash" placeholder="Game Hash" value={hash} onChange={h => setHash(h)}></FormField>
                    <Button className ="home join-btn" onClick={() => joinGame()}>Join Game</Button>
                </div>
                <Button> Create Lobby</Button>
                <Button onClick={() => setShow(!show)} >{lobbyListText()}</Button>
            </BaseContainer>
            {show && lobbyList()}
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