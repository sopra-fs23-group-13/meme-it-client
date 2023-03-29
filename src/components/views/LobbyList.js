import React from "react";
import {ListGroup, Button, Badge} from "react-bootstrap";

import MockData from '../../mockData/menuScreenDataMock.json'

const LobbyList = () => {

    return (
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
                            <Badge className={"align-self-center home playerSize"} bg={lobby.size === lobby.current_players ? "danger" : "primary"} pill>
                                {lobby.current_players} / {lobby.size}
                            </Badge>
                        </div>
                        <Button>
                            Join Lobby
                        </Button>
                    </ListGroup.Item>
                )
            })}
        </ListGroup>
    )
}; export default LobbyList;