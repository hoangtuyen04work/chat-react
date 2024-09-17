import axios from '../utils/axiosUtils';

const chatAPI = {
    getMessages: (userid, friendid) => {
        console.log("calling get messages from API");
        // Sử dụng template literals chính xác
        return axios.get(`/messages/${userid}/${friendid}`);
    },
    sendMessage: (chatId, userid, messagerid, content) => {
        let msg = {
            chatId: chatId,
            senderid: userid,
            recipientid: messagerid,
            content: content
        };
        return axios.post('/app/send', msg);
    }
};

const login = (userid, password) => {
    let data = {
        userid: userid
    };
    return axios.post('message/login', data);
};

const getMesseger = (userid) => {
    // Sử dụng template literals chính xác
    return axios.get(`message/messeger/${userid}`);
};
const getAllUser = (userid) => {
    return axios.get(`message/all/${userid}`)
}
const getAllMessages = (userid1, userid2) => {
    return axios.get(`message/chat/${userid1}/${userid2}`)
}
export {
    chatAPI,
    login,
    getAllUser,
    getMesseger,
    getAllMessages
};