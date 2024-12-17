import axiosClient from "../api/axiosClient";
import fileClient from "../api/fileClient";

const handleAuthToken = (token) => {
    if (token) {
        axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        fileClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    else {
        delete axiosClient.defaults.headers.common['Authorization'];
        delete fileClient.defaults.headers.common['Authorization'];
    }
};

export default handleAuthToken;