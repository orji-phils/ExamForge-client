import axios from "axios";
import { API_BASE_URL } from "./util";
import toast from "react-hot-toast";

const axiosInstance = axios.create({
    baseURL: `${API_BASE_URL}`,
    withCredentials: true
});

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (axios.isAxiosError(error)) {
            const errorMessage = 
            error.response?.data.message
            || error.message

            toast.error(errorMessage);
        } else {
            toast.error("Something went wrong. Please try again later.");
        }

        return Promise.reject(error);
    }
);

export default axiosInstance