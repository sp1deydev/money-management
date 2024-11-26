import axiosClient from "./axiosClient";

export const userApi = {
    updateUser: (data) => {
        return axiosClient.put('/users/update', data);
    },
    getUserById: (data) => {
        return axiosClient.get('/users/:id', data);
    },
    changePassword: (data) => {
        return axiosClient.put('/users/change-password', data);
    },
    deleteUser: (data) => {
        return axiosClient.delete('/users/delete', data);
    },
}