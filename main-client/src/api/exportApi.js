import axios from "axios";
import { EXPORT_API_PATH } from "../constants/api";
import fileClient from "./fileClient";

export const exportApi = {
    downloadIncome: () => {
        return fileClient.post(`${EXPORT_API_PATH}/income`);
    },
    downloadExpense: () => {
        return fileClient.post(`${EXPORT_API_PATH}/expense`);
    },
    downloadGoal: () => {
        return fileClient.post(`${EXPORT_API_PATH}/goal`);
    },
}