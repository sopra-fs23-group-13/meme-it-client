import React, {useState, useEffect} from "react";
import {api} from "../../helpers/api";
import {chat} from "../../helpers/endpoints";
import Cookies from "universal-cookie";

const ChatRoom = (props) => {
    const cookies = new Cookies();
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");

    useEffect(() => {
        const getChatData = async () => {
            try {
                const response = await api.get(`${chat}/${props.code}`, {
                    headers: {Authorization: "Bearer " + cookies.get("token")},
                });
                setMessages(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        const interval = setInterval(() => {
            getChatData();
        }, 500);
        return () => clearInterval(interval);
    }, []);

    const sendMessage = async () => {
        const newMessage = {
            author: cookies.get("token"),
            message: messageText,
        };
        //Display dummy message (just author name) until chat gets updated to avoid token as name
        const newTempMessage = {
            author: localStorage.getItem("username"),
            message: messageText,
        }
        setMessages((prevMessages) => [...prevMessages, newTempMessage]);
        await api.post(`${chat}/${props.code}`, newMessage, {
            headers: {Authorization: "Bearer " + cookies.get("token")},
        });
        setMessageText("");
    };
    return (
        <div className={"chat"}>
            <ul className="message-list">
                {messages.map((message, index) => (

                    <div className={"message-content-block"}>
                    <li key={index} className={`message-item ${(message.id === props?.author?.id || message.id === props?.author?.user?.id) ? "author-message" : ""}`}>
                        {
                            message.time === undefined ? <span className="message-item-time">Now - </span> :
                                (
                                <span className="message-item-time">
                                    {message.time?.split("T")[1]?.split(":")[0] + ":" + message.time?.split("T")[1]?.split(":")[1]} -{" "}
                                </span>
                                )
                        }
                        <span className="message-item-author">
                          {message.author}:
                        </span>{" "}
                        {message.message}
                    </li>
                    </div>
                ))}
            </ul>
            <div className="chat-input-container">
                <input
                    className="chat-input"
                    type="text"
                    value={messageText}
                    onChange={(event) => setMessageText(event.target.value)}
                />
                <button className="chat-send-button" onClick={sendMessage}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatRoom;
