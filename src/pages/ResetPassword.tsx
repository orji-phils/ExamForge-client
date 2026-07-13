import { Box, Button, Field, Heading, Input, Text } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import axios from "../axiosInstance";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { passwordSchema, type PasswordForm } from "../userComponent/schemas/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTitle } from "../context/TitleContext";

export const ResetPassword = () => {
    const [data] = useSearchParams();
    const token = data.get("token");
    const userId = data.get("id");

    const navigate = useNavigate();

    const { handleSubmit, register,
        formState: { errors }
    } = useForm<PasswordForm>({
        resolver: zodResolver(passwordSchema)
    });
    useTitle("Reset Password - ExamForge");

    const submitPasswords = (value: PasswordForm) => {
        axios.patch(
            `/User/updatePassword/${token}/${userId}`, value
        ).then(response => {
            toast.success(response.data.message);
            navigate("/signin");
        });
    }

    return (
        <Box>
            <Heading as={"h1"}>
                Reset Your Password
            </Heading>

            <form onSubmit={handleSubmit(submitPasswords)}>
                <Field.Root invalid={!!errors.password}>
                    <label htmlFor="password">
                        <Text>
                            Enter your new password
                        </Text>
                    </label>

                    <Input
                    type="password"
                    id="password"
                    placeholder="Enter your new password"
                    { ...register("password", { required: "Your new password is required." }) }
                    />

                    <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={!!errors.confirmPassword}>
                    <label htmlFor="confirm">
                        <Text>
                            Confirm your new password
                        </Text>
                    </label>

                    <Input
                    type="password"
                    id="confirm"
                    placeholder="Confirm your new password"
                    { ...register("confirmPassword", { required: "Please confirm your password to continue." }) }
                    />

                    <Field.ErrorText>{errors.confirmPassword?.message}</Field.ErrorText>
                </Field.Root>

                <Button
                type="submit"
                >Change Password</Button>
            </form>
        </Box>
    );
}