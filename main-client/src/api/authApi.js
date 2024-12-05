import { AUTH_API_PATH } from "../constants/api";
import axiosClient from "./axiosClient";

export const authApi = {
    login: (data) => {
        return axiosClient.post(`${AUTH_API_PATH}/login`, data);
    },
    register: (data) => {
        return axiosClient.post(`${AUTH_API_PATH}/signup`, data);
    },
    getCurrentUser: () => {
        return axiosClient.get(`${AUTH_API_PATH}/`);
    },
    logout: () => {
        return axiosClient.get(`${AUTH_API_PATH}/logout`);
    }
}