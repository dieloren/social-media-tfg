import axios from 'axios';

const instance = axios.create();

axios.interceptors.request.use(function (config) {

    return config;
});

export default instance;
