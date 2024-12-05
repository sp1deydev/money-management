import { USER_API_PATH } from "../constants/api";
import axiosClient from "./axiosClient";

export const userApi = {
    updateUser: (data) => {
        return axiosClient.put(`${USER_API_PATH}/update`, data);
    },
    getUserById: (data) => {
        return axiosClient.get(`${USER_API_PATH}/:id`, data);
    },
    changePassword: (data) => {
        return axiosClient.put(`${USER_API_PATH}/change-password`, data);
    },
    deleteUser: (data) => {
        return axiosClient.delete(`${USER_API_PATH}/delete`, data);
    },
    checkPassword: (data) => {
        return axiosClient.post(`${USER_API_PATH}/check-password`, data);
    },
    forgotPassword: (data) => {
        return axiosClient.post(`${USER_API_PATH}/forgot-password`, data);
    },
    checkUsername: (data) => {
        return axiosClient.post(`${USER_API_PATH}/check-username`, data);
    },
}