import React, { useState, useEffect } from "react";
import { api } from "../../helpers/api";
import { chat } from "../../helpers/endpoints";
import Cookies from "universal-cookie";

const ChatRoom = (props) => {
    const cookies = new Cookies();
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");

    useEffect(() => {
        const getChatData = async () => {
            try {
                const response = await api.get(`${chat}/${props.code}`, {
                    headers: { Authorization: "Bearer " + cookies.get("token") },
                });
                setMessages(response.data);
                console.log(response.data);
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
            sender: props.name,
            message: messageText,
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        await api.post(`${chat}/${props.code}`, newMessage, {
            headers: { Authorization: "Bearer " + cookies.get("token") },
        });
        setMessageText("");
    };

    return (
        <div>
            <ul className="message-list">
                {messages.map((message, index) => (
                    <li key={index} className="message-item">
            <span className="message-item-time">
              {message.time} -{" "}
            </span>
                        <span className="message-item-author">
              {message.author}:
            </span>{" "}
                        {message.message}
                    </li>
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
