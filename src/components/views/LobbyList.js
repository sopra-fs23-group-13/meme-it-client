import React from "react";
import {ListGroup, Button, Badge} from "react-bootstrap";
import "styles/views/LobbyList.scss";
import { TfiReload } from 'react-icons/tfi';


import MockData from '../../mockData/menuScreenDataMock.json'
import UsernameModal from "./UsernameModal";

const LobbyList = props => {

    return (
        <div>
            <ListGroup as="ol">
            <ListGroup.Item
                as="li"
                className="d-flex justify-content-between align-items-start"
            >
                <div className="ms-2 me-auto">
                    <div className="fw-bold">Lobby Name</div>

                </div>
                <div>
                    <Badge className={"align-self-center lobbyList playerSize"} pill>
                        Joined / Players
                    </Badge>
                </div>
                <Button variant={"warning"}>
                    <TfiReload />
                </Button>
            </ListGroup.Item>
            </ListGroup>
            <ListGroup as="ol">
                {MockData.map(lobby => {
                    return(
                        <ListGroup.Item
                            as="li"
                            className="d-flex justify-content-between align-items-start"
                        >
                            <div className="ms-2 me-auto">
                                <div className="fw-bold">{lobby.name}</div>
                                Admin: {lobby.admin}
                            </div>
                            <div>
                                <Badge className={"align-self-center lobbyList playerSize"} bg={lobby.size === lobby.current_players ? "danger" : "primary"} pill>
                                    {lobby.current_players} / {lobby.size}
                                </Badge>
                            </div>
                            <UsernameModal joiningAllowed={lobby.current_players === lobby.size} title={"Join Game"} submit={props.action} />
                        </ListGroup.Item>
                    )
                })}
            </ListGroup>
        </div>
    )
}; export default LobbyList;