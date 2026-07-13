import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form";
import { Box, Button, Field, Flex, Heading, Input, Stack, Text } from "@chakra-ui/react";
import axios from "../axiosInstance";
import toast from "react-hot-toast";
import { useState } from "react";
import { signupSchema, type SignupForm } from "../userComponent/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod"
import { useTitle } from "../context/TitleContext";

export const Signup = () => {
    const navigate = useNavigate();
    useTitle("Sign Up - ExamForge");

    const [isLoading, setIsLoading] = useState(false);

    const { handleSubmit, register,
        formState:  { errors }
    } = useForm<SignupForm>({
        resolver: zodResolver(signupSchema)
    });

    const handleSignUP = async (inputs: SignupForm) => {
        try {
            setIsLoading(true);

            const  response = await axios.post(
                `/auth/signup`, inputs
            );

            // toast.success(response.data.message);
            navigate("/");
            toast.success(response.data.message);
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
                p={{ base: 6, md: 10 }}
                borderRadius="md"
                boxShadow="lg"
                w="full"
                maxW={{ base: "90%", sm: "sm", md: "md" }}
            >
                <Heading as="h1" size="lg" textAlign="center" mb={4}>
                    Welcome, User!
                </Heading>

                <Text mb={6} color="gray.600" textAlign="center">
                    Please fill in your credentials to create your account and enjoy the full features we offer.
                </Text>

                <form onSubmit={handleSubmit(handleSignUP)}>
                    <Stack gap={5}>
                        {/* Email */}
                        <Field.Root invalid={!!errors.email}>
                            <label htmlFor="email">
                                <Text mb={1} fontWeight="medium">
                                    Email
                                </Text>
                            </label>
                            <Input type="email" placeholder="Enter your email" id="email"
                            {...register("email", { required: "Sorry! Your email is required to create an account" })} />
                            <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
                        </Field.Root>

                        {/* Username */}
                        <Field.Root invalid={!!errors.userName}>
                            <label htmlFor="userName">
                                <Text mb={1} fontWeight="medium">
                                    Username
                                </Text>
                            </label>
                            <Input type="text" placeholder="Enter your username" id="userName"
                            {...register("userName", { required: "Sorry! Your user name is required to create an account" })} />
                            <Field.ErrorText>{errors.userName?.message}</Field.ErrorText>
                        </Field.Root>

                        {/* Password */}
                        <Field.Root invalid={!!errors.password}>
                            <label htmlFor="password">
                                <Text mb={1} fontWeight="medium">
                                    Password
                                </Text>
                            </label>
                            <Input type="password" placeholder="Enter your desired password" id="password"
                            {...register("password", { required: "Sorry! Your password is required to create an account" })} />
                            <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
                        </Field.Root>

                        {/* Confirm Password */}
                        <Field.Root invalid={!!errors.confirmPassword}>
                            <label htmlFor="confirmPassword">
                                <Text mb={1} fontWeight="medium">
                                    Confirm Password
                                </Text>
                            </label>
                            <Input type="password" placeholder="Confirm your password" id="confirmPassword"
                            {...register("confirmPassword", { required: "Please confirm your password to proceed" })} />
                            <Field.ErrorText>{errors.confirmPassword?.message}</Field.ErrorText>
                        </Field.Root>

                        {/* Hidden field for account type */}
                        {/* <Field.Root invalid={!!errors.accountType}> */}
                            {/* <Input type="hidden" id="accountType" value="user" */}
                            {/* { ...register("accountType")} /> */}
                        {/* </Field.Root> */}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            colorScheme="blue"
                            w="full"
                            mt={2}
                            loading={isLoading}
                            loadingText="Creating..."
                        >
                            Create Account
                        </Button>
                    </Stack>
                </form>

                <Flex mt={6} justify="center" fontSize="sm" color="gray.600">
                    <Text>
                        Already have an account?{" "}
                        <Link to="/signin">
                            <Text as="span" color="blue.500" fontWeight="medium">
                                Login instead
                            </Text>
                        </Link>
                    </Text>
                </Flex>
            </Box>
        </Flex>
    );
}