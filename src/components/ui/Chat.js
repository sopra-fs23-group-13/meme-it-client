import {useEffect, useState} from "react";
import ChatRoom from "./ChatRoom";
import "styles/ui/Chat.scss";
import Cookies from "universal-cookie";
import PropTypes from "prop-types";
import {api} from "../../helpers/api";
import {chat} from "../../helpers/endpoints";
const Chat = (props) => {
    Chat.propTypes = {
        currentLobby: PropTypes.object,
    }

    const cookies = new Cookies();
    const [collapsed, setCollapsed] = useState(true);
    const [totalMessages, setTotalMessages] = useState(0);

    const toggleCollapsed = () => {
        if(props.currentLobby.code !== undefined && totalMessages > 0){
            sessionStorage.setItem("lastOpenedAt", totalMessages);
            sessionStorage.setItem("newMessages", 0);
        }
        setCollapsed(!collapsed);
    };
    const newMessageText = () => {
        if(sessionStorage.getItem("newMessages") == null || sessionStorage.getItem("newMessages") == 0) return ("Open Chat");
        else {
            return (`Open Chat (${sessionStorage.getItem("newMessages")})`)
        }
    }
    if(sessionStorage.getItem("lastOpenedAt") === null) sessionStorage.setItem("lastOpenedAt", 0);
    if(sessionStorage.getItem("newMessages") === null) sessionStorage.setItem("newMessages", 0);
    const getChatData = async () => {
        if(props.currentLobby.code === undefined) return;
        try {
            const response = await api.get(`${chat}/${props.currentLobby.code}`, {
                headers: {Authorization: "Bearer " + cookies.get("token")},
            });
            if(totalMessages != response.data.length ) {
                sessionStorage.setItem("newMessages", response.data.length - sessionStorage.getItem("lastOpenedAt"));
            }
            setTotalMessages(response.data.length);
        } catch (error) {
            console.log(error);
        }
    };

    getChatData();

    return (
        <div className={`chat-container${collapsed ? " chat-collapsed" : ""}`} >
            <button className="chat-toggle" onClick={toggleCollapsed}>
                {collapsed ? newMessageText() : "Close Chat"}
            </button>
            {!collapsed && (
                <div className="chat-room-container">
                    <ChatRoom
                        name={props.currentLobby?.owner?.name || props.currentLobby.id}
                        code={localStorage.getItem("code")}
                        uuid={props.currentLobby}
                        author={props.currentLobby.players.find((player) => player?.id === cookies.get("token") || player?.user?.id === cookies.get("token"))}
                    />
                </div>
            )}
        </div>
    );
};
export default Chat;
