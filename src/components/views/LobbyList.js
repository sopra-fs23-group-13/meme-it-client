import React, { useEffect, useState } from "react";
import { Button, Badge, Table, Container } from "react-bootstrap";
import "styles/views/LobbyList.scss";
import { TfiReload } from 'react-icons/tfi';
import UsernameModal from "./UsernameModal";
import { api } from "../../helpers/api";
import { lobby } from "../../helpers/endpoints";

const LobbyList = props => {
    const [lobbies, setLobbies] = useState([]);
    useEffect(async () => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            try {
                const response = await api.get(lobby);
                setLobbies(response.data);
            } catch {
                alert("Couldn't fetch lobbies")
            }
        }
        await fetchData();
    }, []);

    const refreshLobbies = async () => {
        try {
            const response = await api.get(lobby);
            setLobbies(response.data);
        } catch {
            alert("Couldn't fetch lobbies")
        }
    }

    let lobbyEntries = <tr> <td>There are no public lobbies currently.</td> <td></td> <td></td> </tr>;
    if (lobbies) {
        lobbyEntries = lobbies.map(lobby => {
            if (lobby.lobbySetting.isPublic && lobby.gameStartedAt === null) {
                return (
                    <tr key={lobby.code}>
                        <td>
                            <div className="fw-bold">{lobby.name}</div>
                            Admin: {lobby.owner.name}
                        </td>
                        <td style={{ textAlign: "right" }}>
                            <Badge bg={lobby.lobbySetting.maxPlayers === lobby.players.length ? "danger" : "primary"} pill>
                                {lobby.players.length} / {lobby.lobbySetting.maxPlayers}
                            </Badge>
                        </td>
                        <td style={{ textAlign: "right" }}>
                            <UsernameModal c_names="home join-btn" joiningAllowed={lobby.players.length === lobby.lobbySetting.maxPlayers} title={"Join Game"} submit={props.action} code={lobby.code} />
                        </td>
                    </tr>
                )
            }
        })
    }

    return (
        <Container className={"lobbyList container"}>
            <Table responsive>
                <thead>
                    <tr>
                        <th>Lobby Name</th>
                        <th style={{ textAlign: "right" }}>Players</th>
                        <th style={{ textAlign: "right", width: "20%" }}>
                            <Button variant={"warning"} onClick={() => refreshLobbies()}>
                                <TfiReload />
                            </Button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {lobbyEntries}
                </tbody>
            </Table>
        </Container>
    )
}; export default LobbyList;