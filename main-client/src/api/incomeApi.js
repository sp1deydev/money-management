import { INCOMES_API_PATH } from "../constants/api";
import axiosClient from "./axiosClient";

export const incomeApi = {
    getAllIncomes: (data) => {
        return axiosClient.get(`${INCOMES_API_PATH}`, {params: data});
    },
    getByType: () => {
        return axiosClient.get(`${INCOMES_API_PATH}/get-by-type`);
    },
    createIncome: (data) => {
        return axiosClient.post(`${INCOMES_API_PATH}/create`, data);
    },
    updateIncome: (data) => {
        return axiosClient.put(`${INCOMES_API_PATH}/update`, data);
    },
    deleteIncome: (data) => {
        return axiosClient.delete(`${INCOMES_API_PATH}/delete`, {params: data});
    },
}