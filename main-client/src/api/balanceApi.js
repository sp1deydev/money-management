import { BALANCE_API_PATH } from "../constants/api";
import axiosClient from "./axiosClient";

export const balanceApi = {
    getBalance: () => {
        return axiosClient.get(`${BALANCE_API_PATH}`);
    },
}