import axios from "axios";
import { EXPORT_API_PATH } from "../constants/api";
import fileClient from "./fileClient";

export const exportApi = {
    downloadIncome: () => {
        return fileClient.post('http://localhost:3001/export/');
    },
}