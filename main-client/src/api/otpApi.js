import axiosClient from "./axiosClient";

export const otpApi = {
    generateOTP: (data) => {
        return axiosClient.post('otp/generate', data);
    },
    verifyOTP: (data) => {
        return axiosClient.post('otp/verify', data);
    },
}