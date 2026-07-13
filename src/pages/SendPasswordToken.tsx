import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { SendToken } from "./SendToken";
import axiosInstance from "../axiosInstance";
import { useTitle } from "../context/TitleContext";
import type { UserForm } from "../userComponent/schemas/user.schema";

export const SendResetToken = () => {
    const navigate = useNavigate();
    useTitle("Forgot Password - ExamForge");

    const doSubmit = async (value: UserForm) => {
        try {
            const response = await axiosInstance.get(
                `/user/resetPasswordMail/${value.email}`
            );

            // retrieve axios response
            navigate("/");
            toast.success(response.data.message);
        } catch (error) {
            return null;
        }
    }

    return (
        <SendToken 
        goal="password reset"
        heading="Forgot Your Password"
        instruction="Enter your registered email address below. A secure password reset link will be sent to you."
        action={doSubmit}
        />
    );
}