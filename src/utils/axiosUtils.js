import axios from "axios";
import {
    store
} from '../redux/store'

const instance = axios.create({
    baseURL: 'http://localhost:8086/'
});

instance.interceptors.request.use(function (config) {
    const token = store?.getState()?.user?.user?.token;
    if (token && !config.url.includes('/login') && !config.url.includes('/signup')) {
        config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
}, function (error) {
    return Promise.reject(error)
});


instance.interceptors.response.use(function (response) {
    return response && response.data ? response.data : response;
}, function (error) {
    return error && error.response && error.response.data ? error.response.data : Promise.reject(error);
})

export default instance;