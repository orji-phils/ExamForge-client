import { Box, Button, Field, Heading, Input, Stack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "../axiosInstance";
import toast from "react-hot-toast";
import { userSchema, type UserForm } from "../userComponent/schemas/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTitle } from "../context/TitleContext";
import type z from "zod";

export const UserUpdate = () => {
    const { user, updateUser } = useUser();
    const navigate = useNavigate();
    const { handleSubmit, register,
        formState: { errors }
     } = useForm<
z.input<typeof userSchema>,
any,
z.output<typeof userSchema>
     >({
        resolver: zodResolver(userSchema),
        defaultValues: {
            userName: user?.userName,
            email: user?.email
        }
    });
    useTitle("Update Your Information - ExamForge");

    // update user's info
    const doSubmit = async (values: UserForm) => {
        try {
            const response = await axios.patch(
                `/user/updateUser/${user?.id}`, values
            );

            updateUser(response.data);
            navigate(`/${user?.role}Profile`);
            toast.success(response.data.message);
        } catch (error) {
            return null;
        }
    }

    return (
        <Box>
            <Heading as={"h1"}>
                Update Your Sign In Information
            </Heading>
            <form onSubmit={handleSubmit(doSubmit)}>
                <Stack>
                    <label htmlFor="email">
                        Email address
                    </label>
                    <Field.Root invalid={!!errors.email}>
                        <Input type="email" placeholder="Enter your email address" id="email"
                        {...register("email", { required: "Sorry! Your email is required" })} required />
                        <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
                    </Field.Root>

                    <label htmlFor="userName">
                        User name
                    </label>
                    <Field.Root invalid={!!errors.userName}>
                        <Input type="text" placeholder="Enter your user name" id="userName"
                        {...register("userName", { required: "Sorry! Your user name is required" })} required />
                        <Field.ErrorText>{errors.userName?.message}</Field.ErrorText>
                    </Field.Root>

                    <Button type="submit">
                        Update data
                    </Button>
                </Stack>
            </form>
        </Box>
    );
}