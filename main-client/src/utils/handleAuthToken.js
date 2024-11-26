import axiosClient from "../api/axiosClient";

const handleAuthToken = (token) => {
    if (token) {
        axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    else {
        delete axiosClient.defaults.headers.common['Authorization'];
    }
};

export default handleAuthToken;