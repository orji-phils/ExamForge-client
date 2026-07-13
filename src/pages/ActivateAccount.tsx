import { useEffect, useState } from "react"
import axios from "../axiosInstance";
import { Link, useSearchParams,  } from "react-router-dom";
import toast from "react-hot-toast";
import { Box, Heading, Spinner, Text } from "@chakra-ui/react";
import { useTitle } from "../context/TitleContext";

export const ActivateAccount = () => {
    const [activate] = useSearchParams();
    const token = activate.get("token");
    const userId = activate.get("id");
    useTitle("Activate Account - ExamForge");

    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!token || !userId) return;
        setIsLoading(true);

        axios.patch(
            `/accountActivation/activateAccount`, { token, userId }
        ).then(response => {
            setSuccess(true);
            toast.success(response.data.message);
        }).catch(() => {
            setSuccess(false);
        }).finally(() => {
            setIsLoading(false);
        });
    }, [token, userId]);

    if (isLoading) {
        return (
            <Box>
                <Spinner />
                <Text>Activating your account. Please wait.</Text>
            </Box>
        )
    }

    return success ? (
        <Box>
            <Heading as={"h1"}>
                Success
            </Heading>
            <Text>
                Your account has been activated successfully. click on the link below to login and start practicing.
            </Text>
            <Link to={"/signin"}>
                Signin to your account
            </Link>
        </Box>
    ) : (
        <Box>
            <Heading as={"h1"}>
                Oops! Can't Activate Your Account
            </Heading>

            <Text>
                Invalid or expired activation link. Please click on the button below to request another activation mail.
            </Text>

            <Link to={"/sendActivationToken"}>
                Resend activation token
            </Link>
        </Box>
    );
}