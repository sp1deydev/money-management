import axiosClient from "./axiosClient";

export const authApi = {
    login: (data) => {
        return axiosClient.post('/auth/login', data);
    },
    register: (data) => {
        return axiosClient.post('/auth/signup', data);
    },
    getCurrentUser: () => {
        return axiosClient.get('/auth/');
    },
    logout: () => {
        return axiosClient.get('/auth/logout');
    }
}