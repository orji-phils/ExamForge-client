import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import { API_BASE_URL } from "../util";
import toast from "react-hot-toast";

const dateFormat = (date: Date | string) => {
    return new Date(date).toLocaleString(undefined, {
        dateStyle: "full",
        timeStyle: "short"
    })
}

const signOut = (updateUser: any) => {
    axiosInstance.get(
        `${API_BASE_URL}/auth/signout`
    ). then(response => {
        const navigate = useNavigate();
    

        updateUser(null);
        navigate("/signin");
        toast.success(response.data.message);
    })
}

export { dateFormat, signOut };