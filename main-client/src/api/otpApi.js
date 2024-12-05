import { OTP_API_PATH } from "../constants/api";
import axiosClient from "./axiosClient";

export const otpApi = {
    generateOTP: (data) => {
        return axiosClient.post(`${OTP_API_PATH}/generate`, data);
    },
    verifyOTP: (data) => {
        return axiosClient.post(`${OTP_API_PATH}/verify`, data);
    },
}