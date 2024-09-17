import React, { useState, useEffect, useRef } from 'react';
import { AiOutlineSend } from "react-icons/ai";
import { chatAPI, getAllUser, getAllMessages } from '../services/apiService';
import SockJS from 'sockjs-client';
import {
    useDispatch,
    useSelector
} from 'react-redux';
import { Client } from '@stomp/stompjs';
import { doLogout } from '../redux/action/userAction';
const SOCKET_URL = 'http://localhost:8086/ws';
const Message = ({ onLogout }) => {
    const [userid, setUserid] = useState(useSelector(state => state.user.user.userId));
    const [listUser, setListUser] = useState([]);
    const [listMessages, setListMessages] = useState([]);
    const [chatId, setChatId] = useState();
    const [messagerid, setMessagerid] = useState('');
    const dispatch = useDispatch();
    const [content, setContent] = useState();
    const [isConnected, setIsConnected] = useState(false);
    const socket = new SockJS(SOCKET_URL);
    const stompClient = new Client(
        {
        webSocketFactory: () => new SockJS(SOCKET_URL),
        reconnectDelay: 5000,
        onConnect: () => {
            console.log('Connected to WebSocket');
            stompClient.subscribe('/topic/receive', (message) => {
                setIsConnected(true);
                console.log("Message received:", message.body);
                setListMessages(prev => [...prev, JSON.parse(message.body)]); // Update UI with the message
            });
        },
            onStompError: (error) => {
            setIsConnected(false); // Mark as not connected
            console.log("WebSocket Error:", error);
        }
    });
    const handleOnChange = (event) => {
        setContent(event.target.value);
        console.log(content);
    }
    const onSendMessage = () => {
        if (!stompClient.active) {
            console.error("Cannot send message. Not connected to WebSocket.");
            return;
        }
        console.log("Sending message...");
        if (content.trim() !== "") {
            const messagePayload = {
                chatId: chatId,
                senderid: userid,
                recipientid: messagerid,
                content: content
            };

            stompClient.publish({
                destination: "/app/send", // The destination to send the message to (from the backend)
                body: JSON.stringify(messagePayload) // Convert message payload to JSON string
            });
            console.log("Message sent:", content);
            setContent(""); // Clear input after sending
        }
    };
    const onReceiveMessage = (msgText) => {
        console.log('new Message receive', msgText);
        setListMessages(prev => prev.concat(msgText));
    }
    const messageContainerRef = useRef(null);
    const scrollToBottom = () => {
        const container = messageContainerRef.current;
        container.scrollTop = container.scrollHeight;
    };
    const handleLogout =() => {
        onLogout();
        dispatch(doLogout());
    }
    const handleOnMessage = (event) => {
        setMessagerid(event.currentTarget.getAttribute('data-id'));
        getAllMessage(event.currentTarget.getAttribute('data-id'));
    }
    const getAllMessager = async () => {
        let data = await getAllUser(userid);
        setListUser(data);
    }
    const getAllMessage = async (userid2) => {
        let data = await getAllMessages(userid, userid2);
        console.log(data);
        setChatId(data.chatId);
        setListMessages(data.messageResponses);
    }
    useEffect(() => {
        getAllMessager();
        // const client = new Client({
        //     webSocketFactory: () => new SockJS('http://localhost:8086/ws'),
        //     reconnectDelay: 5000,
        //     onConnect: () => {
        //         console.log('Connected to WebSocket');
        //         client.subscribe('/topic/receive', (message) => {
        //             console.log("Message received:", message.body);
        //             setListMessages(prev => [...prev, JSON.parse(message.body)]);
        //         });
        //     },
        //     onStompError: (error) => {
        //         console.error("WebSocket Error:", error);
        //     }
        // });
        // client.activate();
        // // Cleanup function to disconnect when component unmounts
        // return () => {
        //     if (client.connected) {
        //         client.deactivate();
        //     }
        // };
    }, []);
    return (
        <div className="body" >
            <div className="message-form">
                <header className="header-message">
                    <span className="header-title">Message</span>
                    <span className="log-out-btn" onClick={handleLogout}>Log out</span>
                </header>
                <div className="body-message">
                    <div className="messages">
                        <div className="list-message-header">List Message</div>
                        <div className="list-message-body">
                            {
                            listUser.map((user, index) => (
                                <div key={index} data-id={user} className="user-tag" onClick={handleOnMessage}>
                                    { user }
                                </div>
                            ))
                            }
                        </div>
                    </div>
                    <div className="divider"></div>
                    {
                        messagerid ? 
                            (
                                <div className="message">
                                    <div className="message-header">
                                        Header
                                    </div>
                                    <div className="divider"></div>
                                    <div className = "message-body" ref = {messageContainerRef}>
                                        { listMessages && listMessages.length > 0?
                                            (
                                                listMessages
                                                .reverse()
                                                .map((message, index) => (
                                                <div key={index} className={`message-tag ${message.sender === "1" ? "send" : "receive"}`}>
                                                    {message.text}
                                                </div>
                                                )
                                                )
                                            )
                                            :
                                            (
                                                <div></div>
                                            )
                                        }
                                        </div>
                                    <div className="message-footer">
                                        <input value={content} onChange={handleOnChange} className="input-message" placeholder="type message" />
                                        <div className="send-btn" onClick={onSendMessage}>
                                            <AiOutlineSend />
                                        </div>
                                    </div>
                                </div>
                            )
                            :
                            (
                                <div className="homepage-message">
                                    Chọn một cuộc trò chuyện để bắt đầu
                                </div>
                            )
                    }
                </div>
            </div>
        </div>
    )
}

export default Message;