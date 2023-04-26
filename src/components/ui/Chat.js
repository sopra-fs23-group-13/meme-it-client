import { useState } from "react";
import ChatRoom from "./ChatRoom";
import "styles/ui/Chat.scss";
import Cookies from "universal-cookie";
const Chat = (props) => {
    const cookies = new Cookies();
    const [collapsed, setCollapsed] = useState(true);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div className={`chat-container${collapsed ? " chat-collapsed" : ""}`} >
            <button className="chat-toggle" onClick={toggleCollapsed}>
                {collapsed ? "Open Chat" : "Close Chat"}
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
