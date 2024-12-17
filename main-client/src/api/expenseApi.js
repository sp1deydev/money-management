import { EXPENSES_API_PATH } from "../constants/api";
import axiosClient from "./axiosClient";

export const expenseApi = {
    getAllExpenses: (data) => {
        return axiosClient.get(`${EXPENSES_API_PATH}`, {params: data});
    },
    getByType: () => {
        return axiosClient.get(`${EXPENSES_API_PATH}/get-by-type`);
    },
    getByWeek: (data) => {
        return axiosClient.get(`${EXPENSES_API_PATH}/get-by-week`, {params: data});
    },
    getByDate: (data) => {
        return axiosClient.get(`${EXPENSES_API_PATH}/get-by-date`, {params: data});
    },
    createExpense: (data) => {
        return axiosClient.post(`${EXPENSES_API_PATH}/create`, data);
    },
    updateExpense: (data) => {
        return axiosClient.put(`${EXPENSES_API_PATH}/update`, data);
    },
    deleteExpense: (data) => {
        return axiosClient.delete(`${EXPENSES_API_PATH}/delete`, {params: data});
    },
}