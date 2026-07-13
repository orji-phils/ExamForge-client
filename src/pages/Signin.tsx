import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useForm } from "react-hook-form";
import axios from "../axiosInstance";
import { Box, Button, Field, Flex, Heading, Input, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { signinSchema, type SigninForm } from "../userComponent/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTitle } from "../context/TitleContext";

export const Signin = () => {
    const navigate = useNavigate();
    const { updateUser } = useUser();
    useTitle("Sign In - ExamForge");

    const [isLoading, setIsLoading] = useState(false);

    const { handleSubmit, register,
        formState: { errors } 
    } = useForm<SigninForm>({
        resolver: zodResolver(signinSchema)
    });

    // function to handle signin submittions
    const doSubmit = async (value: SigninForm) => {
        try {
            setIsLoading(true);
            const response = await axios.post(
                `/auth/signin`, value
            );
            const accType = response.data.role;

            updateUser(response.data);
            navigate(`/${accType}Dashboard`);
        } catch (error) {
            return null;
        } finally {
            setIsLoading(false);
        }
    }

    return (
                <Flex minH="100vh" align="center" justify="center" bg="gray.50" px={4}>
            <Box
                bg="white"
                p={10}
                my={8}
                borderRadius="md"
                boxShadow="md"
                w="full"
                maxW={{ base: "90%", sm: "sm", md: "md" }}
            >
                <Heading as="h2" mb={4} size="lg" textAlign="center">
                    Welcome Back
                </Heading>
                <Text mb={6} color="gray.600" textAlign="center">
                    Enter your credentials to sign in
                </Text>

                <form onSubmit={handleSubmit(doSubmit)}>
                    <Stack gap={5}>
                        <Field.Root invalid={!!errors.userName}>
                            <label htmlFor="userName">
                                <Text mb={1} fontWeight="medium">
                                    User name
                                </Text>
                            </label>
                            <Input type="text" placeholder="Enter your user name" id="userName"
                            { ...register("userName", { required: "Your user name is required." }) } />
                            <Field.ErrorText>{errors.userName?.message}</Field.ErrorText>
                        </Field.Root>

                        <Field.Root invalid={!!errors.password}>
                            <label htmlFor="password">
                                <Text mb={1} fontWeight="medium">
                                    Password
                                </Text>
                            </label>
                            <Input type="password" placeholder="Enter your password" id="password"
                            { ...register("password", { required: "Your password is required." }) } />
                            <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
                        </Field.Root>

                        <Button
                            type="submit"
                            colorScheme="blue"
                            loading={isLoading}
                            loadingText="Signing in..."
                        >
                            Log in
                        </Button>
                    </Stack>
                </form>

                <Flex justify="space-between" mt={6} fontSize="sm" color="gray.600">
                    <Text>
                        Don't have an account?{" "}
                        <Link to={"/signup"} color="blue.500">
                            Sign up
                        </Link>
                    </Text>

                    <Link to={"/forgotPassword"} color="blue.500">
                        Forgot your password?
                    </Link>
                </Flex>
            </Box>
        </Flex>
    );
}