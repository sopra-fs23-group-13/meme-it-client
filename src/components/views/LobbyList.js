import React, {useEffect, useState} from "react";
import {ListGroup, Button, Badge} from "react-bootstrap";
import "styles/views/LobbyList.scss";
import { TfiReload } from 'react-icons/tfi';
import UsernameModal from "./UsernameModal";
import {api} from "../../helpers/api";
import {lobby} from "../../helpers/endpoints";

const LobbyList = props => {
    const [lobbies, setLobbies] = useState([]);
    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            try{
                const response = await api.get(lobby);
                setLobbies(response.data);
            } catch {
                alert("Couldn't fetch lobbies")
            }
        }
        fetchData();
    }, []);

    const refreshLobbies = async () => {
        try {
            const response = await api.get(lobby);
            setLobbies(response.data);
        } catch {
            alert("Couldn't fetch lobbies")
        }
    }

    let lobbyItems;
    if(lobbies) {
        lobbyItems = (
            <div>
            {lobbies.map(lobby => {
                if(lobby.lobbySetting.isPublic){
                    return(
                        <div key={lobby.code}>
                            <ListGroup.Item
                                as="li"
                                className="d-flex justify-content-between align-items-start"
                            >
                                <div className="ms-2 me-auto">
                                    <div className="fw-bold">{lobby.name}</div>
                                    Admin: {lobby.owner.name}
                                </div>
                                <div>
                                    <Badge className={"align-self-center lobbyList playerSize"} bg={lobby.lobbySetting.maxPlayers === lobby.players.length ? "danger" : "primary"} pill>
                                        {lobby.players.length} / {lobby.lobbySetting.maxPlayers}
                                    </Badge>
                                </div>
                                <UsernameModal c_names="home join-btn" joiningAllowed={lobby.players.length === lobby.lobbySetting.maxPlayers} title={"Join Game"} submit={props.action} code={lobby.code} />
                            </ListGroup.Item>
                        </div>
                    )
                }

                })}
            </div>
        )
    }

    return (
        <div>
            <ListGroup as="ol" >
            <ListGroup.Item
                as="li"
                className="d-flex justify-content-between align-items-start lobbyList header-item"

            >
                <div className="ms-2 me-auto">
                    <div className="fw-bold">Lobby Name</div>

                </div>
                <div>
                    <div className="lobbyList playerCount">Players</div>
                </div>
                <Button className="home lobbyList refresh-btn" onClick={()=>refreshLobbies()}>
                    <TfiReload/>
                </Button>
            </ListGroup.Item>
            </ListGroup>
            <ListGroup as="ol">
                {lobbyItems}
            </ListGroup>
        </div>
    )
}; export default LobbyList;