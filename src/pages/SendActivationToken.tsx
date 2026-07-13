import { useNavigate } from "react-router-dom"
import axiosInstance from "../axiosInstance";
import toast from "react-hot-toast";
import { SendToken } from "./SendToken";
import { useTitle } from "../context/TitleContext";
import type { UserForm } from "../userComponent/schemas/user.schema";

export const SendActivationToken = () => {
    const navigate = useNavigate();
    useTitle("Resend Activation Token - ExamForge");

    const sendToken = async (value: UserForm) => {
        try {
            const response = await axiosInstance.get(
                `/accountActivation/resendActivationToken/${value.email}`
            );

            navigate("/");
            toast.success(response.data.message);
        } catch (error) {
            return null;
        }
    }

    return (
        <SendToken
        goal="activation"
        heading="Resend Activation Token"
        instruction="Enter the email address used during account creation below. A secure activation link will be sent to you."
        action={sendToken}
        />
    );
}