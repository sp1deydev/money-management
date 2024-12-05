import { GOALS_API_PATH } from "../constants/api";
import axiosClient from "./axiosClient";

export const goalApi = {
    getAllGoals: (data) => {
        return axiosClient.get(`${GOALS_API_PATH}`, {params: data});
    },
    createGoal: (data) => {
        return axiosClient.post(`${GOALS_API_PATH}/create`, data);
    },
    updateGoal: (data) => {
        return axiosClient.put(`${GOALS_API_PATH}/update`, data);
    },
    deleteGoal: (data) => {
        return axiosClient.delete(`${GOALS_API_PATH}/delete`, {params: data});
    },
}