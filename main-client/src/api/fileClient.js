import axios from "axios";

let baseURL = 'http://localhost:3001/';

const fileClient = axios.create({
    baseURL: baseURL,
    responseType: 'blob'
})

export default fileClient;