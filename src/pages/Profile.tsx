import { useUser } from "../context/UserContext";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Box, Button, Field, Flex, Heading, Input, Spinner, Stack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { deleteUser } from "../functions/userFunction";
import { deleteProfile, getProfile, logOut, submitProfile } from "../functions/ProfileFunctions";
import { upgradeAccount } from "../functions/upgradeFunctions";
import { profileSchema, type ProfileForm } from "../userComponent/schemas/profile.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTitle } from "../context/TitleContext";

export const Profile = () => {
    const { user, updateUser } = useUser();
    const navigate = useNavigate();
    useTitle("Your Profile - ExamForge");

    const [profileInfo, setProfileInfo] = useState<ProfileForm| null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { handleSubmit, register, reset,
        formState: { errors }
    } = useForm<ProfileForm>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            email: user?.email,
            userName: user?.userName,
            role: user?.role
        }
    });

    // get user's profile on page load
    useEffect(() => {
        setIsLoading(true);

        getProfile()
        .then(profile => {
            profile && setProfileInfo(profile);
            profile && reset(profile);
        })

        setIsLoading(false);
    }, [getProfile, isLoading]);

    const Upgrade = async () => {
        setIsLoading(true);
        await upgradeAccount();
        setIsLoading(false);
    }

    if (isLoading) {
        return (
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" h="60vh">
                <Spinner size="lg" />
                <Text mt={4}>Loading your profile...</Text>
            </Box>
        );
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
                maxW={{ base: "90%", sm: "sm", md: "md", lg: "lg" }}
            >
                <Heading as="h1" mb={4} size="lg" textAlign="center">
                    Your Profile
                </Heading>
                <Text mb={6} color="gray.600" textAlign="center">
                    Fill in the information to create or update your profile
                </Text>

                <form onSubmit={handleSubmit(submitProfile)}>
                    <Stack gap={5}>
                        {/* First Name */}
                        <Field.Root invalid={!!errors.firstName}>
                            <label htmlFor="firstName">
                                <Text mb={1} fontWeight="medium">First name</Text>
                            </label>
                            <Input type="text" placeholder="Enter your first name" id="firstName"
                            {...register("firstName", { required: "Sorry! Your first name is required." })} required />
                            <Field.ErrorText>{errors.firstName?.message}</Field.ErrorText>
                        </Field.Root>

                        {/* Last Name */}
                        <Field.Root invalid={!!errors.lastName}>
                            <label htmlFor="lastName">
                                <Text mb={1} fontWeight="medium">Last name</Text>
                            </label>
                            <Input type="text" placeholder="Enter your last name" id="lastName"
                            {...register("lastName", { required: "Sorry! Your last name is required" })} required />
                            <Field.ErrorText>{errors.lastName?.message}</Field.ErrorText>
                        </Field.Root>

                        {/* Username (Disabled) */}
                        <Field.Root invalid={!!errors.userName}>
                            <label htmlFor="userName">
                                <Text mb={1} fontWeight="medium">Username</Text>
                            </label>
                            <Input type="text" placeholder="Enter your username" id="userName" 
                            {...register("userName")} disabled />
                        </Field.Root>

                        {/* Date of Birth */}
                        <Field.Root invalid={!!errors.dateOfBirth}>
                            <label htmlFor="dateOfBirth">
                                <Text mb={1} fontWeight="medium">Date of birth</Text>
                            </label>
                            <Input type="date" id="dateOfBirth" {...register("dateOfBirth")} />
                        </Field.Root>

                        {/* Profile Picture */}
                        <Field.Root invalid={!!errors.profilePicture}>
                            <label htmlFor="profilePicture">
                                <Text mb={1} fontWeight="medium">Profile Picture</Text>
                            </label>
                            <Input 
                            type="file" 
                            id="profilePicture" 
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                file && reset({ ...profileInfo, profilePicture: file })
                            }}
                            />
                        </Field.Root>

                        {/* Phone Number */}
                        <Field.Root invalid={!!errors.phoneNumber}>
                            <label htmlFor="phoneNumber">
                                <Text mb={1} fontWeight="medium">Phone Number</Text>
                            </label>
                            <Input type="tel" placeholder="Enter your phone number" id="phoneNumber"
                            {...register("phoneNumber", { required: "Sorry! Your phone number is required" })} required />
                            <Field.ErrorText>{errors.phoneNumber?.message}</Field.ErrorText>
                        </Field.Root>

                        {/* Email (Disabled) */}
                        <Field.Root invalid={!!errors.email}>
                            <label htmlFor="email">
                                <Text mb={1} fontWeight="medium">Email</Text>
                            </label>
                            <Input type="email" placeholder="Enter your email" id="email"
                            {...register("email")} disabled />
                        </Field.Root>

                        {/* admin or master section */}
                        {user?.role !== "user" && (
                            <>
                                {/* Account Number */}
                                <Field.Root invalid={!!errors.accountNumber}>
                                    <label htmlFor="accountNumber">
                                        <Text mb={1} fontWeight="medium">Account Number</Text>
                                    </label>
                                    <Input type="number" placeholder="Enter your account number" id="accountNumber"
                                    {...register("accountNumber", { required: "Sorry! Your account number is required" })} required />
                                </Field.Root>

                                {/* Bank Name */}
                                <Field.Root invalid={!!errors.bankName}>
                                    <label htmlFor="bankName">
                                        <Text mb={1} fontWeight="medium">Bank Name</Text>
                                    </label>
                                    <Input type="text" placeholder="Enter your bank name" id="bankName"
                                    {...register("bankName", { required: "Sorry! Your bank name is required" })} required />
                                </Field.Root>
                            </>
                    )}

                        {/* Role  */}
                        <Text mb={1} fontWeight="medium">Account Type: {user?.role}</Text>

                        {/* for regular user */}
                        {user?.role === "user" && (
                            <Button
                            colorScheme="blue"
                            onClick={Upgrade}
                            >Upgrade Account</Button>
                        )}

                        {/* Bio */}
                        <Field.Root invalid={!!errors.bio}>
                            <label htmlFor="bio">
                                <Text mb={1} fontWeight="medium">Bio</Text>
                            </label>
                            <textarea id="bio" rows={4} placeholder="Tell us a little about yourself..."
                            {...register("bio")}
                            style={{
                                width: "100%",
                                padding: "0.75rem",
                                borderRadius: "6px",
                                border: "1px solid #CBD5E0", // Chakra's gray.300
                                fontFamily: "inherit",
                            }} />
                        </Field.Root>

                        {/* Submit Button */}
                        <Button 
                        type="submit" 
                        colorScheme="blue" 
                        loading={isLoading} 
                        loadingText={profileInfo ? "Updating profile" : "Creating profile"}>
                            {profileInfo ? "Update Profile" : "Create Profile"}
                        </Button>
                    </Stack>
                </form>

                {/* Bottom Actions */}
                <Flex justify="space-between" mt={6} fontSize="sm" color="gray.600">
                    <Text cursor="pointer" onClick={() => navigate("/userUpdate")} _hover={{ color: "red.500", textDecoration: "underline" }}>
                        Update user data
                    </Text>

                    <Text cursor="pointer" onClick={deleteProfile} _hover={{ color: "red.500", textDecoration: "underline" }}>
                        Delete your profile
                    </Text>

                    <Text cursor="pointer" _hover={{ color: "red.500", textDecoration: "underline" }}
                    onClick={() => 
                        deleteUser(user?.id!, user?.userName!)
                    }
                >
                            Delete your account
                        </Text>

                    <Text cursor="pointer" onClick={() => logOut(updateUser)} _hover={{ color: "blue.500", textDecoration: "underline" }}>
                        Log out
                    </Text>

                </Flex>
            </Box>
        </Flex>
    );
}