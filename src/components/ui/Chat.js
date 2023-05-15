import {useEffect, useState} from "react";
import ChatRoom from "./ChatRoom";
import "styles/ui/Chat.scss";
import Cookies from "universal-cookie";
import PropTypes from "prop-types";
import {api} from "../../helpers/api";
import {chat} from "../../helpers/endpoints";
import {Badge} from "react-bootstrap";

const Chat = (props) => {
    Chat.propTypes = {
        currentLobby: PropTypes.object,
    }

    const cookies = new Cookies();
    const [collapsed, setCollapsed] = useState(true);
    const [totalMessages, setTotalMessages] = useState(0);

    const toggleCollapsed = () => {
        if(props.currentLobby !== undefined && totalMessages > 0){
            localStorage.setItem("lastOpenedAt", totalMessages);
            localStorage.setItem("newMessages", 0);
        }
        setCollapsed(!collapsed);
    };
    const newMessageText = () => {
        if(localStorage.getItem("newMessages") > 0) return (<><span style={{ textAlign: 'center', width: '100%', marginLeft: '22px'}}>Open Chat</span> <Badge pill bg="danger" style={{ marginLeft: 'auto' }}>{localStorage.getItem("newMessages")}</Badge></>);
        return ("Open Chat");
    }
    if(localStorage.getItem("lastOpenedAt") === null) localStorage.setItem("lastOpenedAt", 0);
    if(localStorage.getItem("newMessages") === null) localStorage.setItem("newMessages", 0);

    useEffect(async () => {
        const code = props.currentLobby.code ? props.currentLobby.code : localStorage.getItem("code");
        try {
            const response = await api.get(`${chat}/${code}`, {
                headers: {Authorization: "Bearer " + cookies.get("token")},
            });
            if(totalMessages !== response.data.length ) {
                localStorage.setItem("newMessages", response.data.length - localStorage.getItem("lastOpenedAt"));
            }
            setTotalMessages(response.data.length);
            if (!collapsed) {
                localStorage.setItem("lastOpenedAt", totalMessages);
            }
        } catch (error) {
            console.log(error);
        }
    });

    return (
        <div className={`chat-container${collapsed ? " chat-collapsed" : ""}`} >
            <button className="chat-toggle" onClick={toggleCollapsed}>
                {collapsed ? newMessageText() : "Close Chat"}
            </button>
            {!collapsed && (
                <div className="chat-room-container">

                    <div className="chat-room-wrapper">
                        <div className="chat-room-content">
                    <ChatRoom
                        name={props.currentLobby?.owner?.name || props.currentLobby.id}
                        code={localStorage.getItem("code")}
                        uuid={props.currentLobby}
                        author={props.currentLobby.players.find((player) => player?.id === cookies.get("token") || player?.user?.id === cookies.get("token"))}
                    />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Chat;
