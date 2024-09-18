import React, { useState, useEffect, useRef } from 'react';
import { AiOutlineSend } from "react-icons/ai";
import { chatAPI, getAllUser, getAllMessages } from '../services/apiService';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';  // Updated import
import { useDispatch, useSelector } from 'react-redux';
import { doLogout } from '../redux/action/userAction';

const Message = ({ onLogout }) => {
    const userid = useSelector(state => state.user.user.userId);
    const [listUser, setListUser] = useState([]);
    const [listMessages, setListMessages] = useState([]);
    const [chatId, setChatId] = useState();
    const [messagerid, setMessagerid] = useState('');
    const dispatch = useDispatch();
    const [content, setContent] = useState('');
    const [stompClient, setStompClient] = useState(null);
    const messageContainerRef = useRef(null);
        const textareaRef = useRef(null); // Thêm ref cho textarea

    const scrollToBottom = () => {
        const container = messageContainerRef.current;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    };

    const handleLogout = () => {
        onLogout();
        dispatch(doLogout());
    };

    const handleOnMessage = (event) => {
        const userId = event.currentTarget.getAttribute('data-id');
        setMessagerid(userId);
        getAllMessage(userId);
        setContent("");
    };

    const getAllMessager = async () => {
        const data = await getAllUser(userid);
        setListUser(data);
    };

    const getAllMessage = async (userid2) => {
        const data = await getAllMessages(userid, userid2);
        console.log("messages of a chat", data);
        setChatId(data.id);
        setListMessages(data.messageResponses);
    };

    const sendMessage = () => {
        if (stompClient) {
            const messagePayload = {
                chatId: chatId,
                senderid: userid,
                recipientid: messagerid,
                content: content
            };
            stompClient.publish({
                destination: '/app/send',
                body: JSON.stringify(messagePayload)
            });
            setContent('');
        }
    };
    useEffect(() => {
        const socket = new SockJS('http://localhost:8086/message/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: (frame) => {
                console.log('Connected: ' + frame);
                client.subscribe(`/topic/receive/${chatId}`, (response) => {
                    const receivedMessage = JSON.parse(response.body);
                    console.log("message received", receivedMessage);
                    setListMessages(prevMessages => [...prevMessages, receivedMessage]);
                    scrollToBottom();
                });
            },
            debug: (str) => {
                console.log(str);
            }
        });
        client.activate();
        setStompClient(client);
        return () => {
            if (client) {
                client.deactivate();
            }
        };
    }, []);
    useEffect(() => {
        scrollToBottom(); // Cuộn xuống khi danh sách tin nhắn được render hoặc cập nhật
    }, [listMessages]); // Lắng nghe sự thay đổi trong listMessages

    useEffect(() => {
        getAllMessager();
    }, []);

     const handleOnChange = (event) => {
         setContent(event.target.value);
         // Tự động điều chỉnh chiều cao của textarea
         textareaRef.current.style.height = 'auto'; // Đặt về auto trước để tính toán lại chiều cao
         textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`; // Giới hạn chiều cao tối đa (100px ~ khoảng 4 dòng)
     };


    return (
        <div className="body">
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
                                        {user}
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div className="divider"></div>
                    {
                        messagerid ? (
                            <div className="message">
                                <div className="message-header">
                                    {messagerid}
                                </div>
                                <div className="divider"></div>
                                <div className="message-body" ref={messageContainerRef}>
                                    {
                                        listMessages && listMessages.length > 0 ? (
                                            listMessages.map((message, index) => (
                                                <div key={index} className={`message-tag ${message.senderid === `${userid}` ? "send" : "receive"}`}>
                                                    {message.content}
                                                </div>
                                            ))
                                        ) : (
                                            <div></div>
                                        )
                                    }
                                </div>
                                <div className="message-footer">
                                    <textarea
                                        ref={textareaRef} // Thêm ref cho textarea
                                        value={content}
                                        onChange={handleOnChange}
                                        className="input-message"
                                        placeholder="Type a message..."
                                    ></textarea>
                                    <div className="send-btn" onClick={sendMessage}>
                                        <AiOutlineSend />
                                    </div>
                                </div>

                            </div>
                        ) : (
                            <div className="homepage-message">
                                Chọn một cuộc trò chuyện để bắt đầu
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default Message;
