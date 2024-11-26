import axios from "axios";

let baseURL = 'http://localhost:3001/';

const axiosClient = axios.create({
    baseURL: baseURL,
})

export default axiosClient;