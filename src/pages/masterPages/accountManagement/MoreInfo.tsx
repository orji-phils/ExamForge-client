import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { Box, Button, Heading, Image, Spinner, Text } from "@chakra-ui/react";
import { dateFormat } from "../../../functions/otherFunctions";
import { deleteUser, getFullData } from "../../../functions/userFunction";
import { useUser } from "../../../context/UserContext";
import { upgradeToMaster } from "../../../functions/upgradeFunctions";
import type { UserProfileForm } from "../../../userComponent/schemas/user.schema";
import { useTitle } from "../../../context/TitleContext";

export const MoreInfo = () => {
    const userId = useParams();
    const { user } = useUser();
    useTitle(`${user?.userName || "User".toLocaleUpperCase()} Info - Account Management`);

    const [userData, setUserData] = useState<UserProfileForm | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // get the specified user's full data
    useEffect(() => {
        if (!userId.userId) return;
        setIsLoading(true);

        getFullData(Number(userId.userId))
        .then(data => 
            data && setUserData(data)
        ). finally(
            () => setIsLoading(false)
        );
    }, [userId]);

    if (isLoading) {
        return (
            <Box>
                <Spinner />
                <Text>Loading user data. Please Wait.</Text>
            </Box>
        );
    }

    return (
        <Box>
            <Heading as={"h1"}>
                {userData?.userName}
            </Heading>

            <Heading>User Info</Heading>

            {userData?.profilePicture ? 
            <Image src={userData?.profilePicture} alt={`${userData?.userName}'s profile picture`} /> :
            "No profile picture to show."}

            <Text>Email address: {userData?.email}</Text>
            <Text>Account type: {userData?.role}</Text>
            <Text>Account created on: {dateFormat(userData?.created_date!)}</Text>
            {userData?.role !== "user" && (
                <Text>{userData?.role === "admin" ? "Admin" : "Master"} since: {dateFormat(userData?.modified_date!)}</Text>
            )}

<Heading>Profile info</Heading>
            {userData?.firstName ? (
                <Box>
                    <Text>First name: {userData?.firstName}</Text>
                    <Text>Last name: {userData?.lastName}</Text>
                    <Text>Date of birth: {dateFormat(userData?.dateOfBirth!)}</Text>
                    <Text>Phone number: {userData?.phoneNumber}</Text>
                    <Text>User bio: {userData?.bio}</Text>
                    </Box>
            ) : (
                <Text>No profile data to show.</Text>
            )}

            {userData?.role !== "user" && (
                <Box>
                    <Heading>Bank Info</Heading>
                    {userData?.bankName ? (
                        <Box>
                        <Text>Bank name: {userData.bankName}</Text>
                        <Text>Account number: {userData.accountNumber}</Text>
                        </Box>
                    ) : (<Text>No bank info to show.</Text>)}
                </Box>
            )}

            {userData?.role === "admin" && user?.id === 1 && (
                <Button
                    onClick={() => upgradeToMaster(Number(userId.userId), userData.userName!)}
                >
                    Upgrade To Master
                </Button>
            )}

            {user?.role === "master" && userData?.role !== "master" && (
                <Button
                    onClick={() => deleteUser(userData?.id!, userData?.userName!)}
                >
                    Delete User
                </Button>
            )}

            {user?.id === 1 && userData?.role === "master" && (
                <Button
                    onClick={() => deleteUser(userData?.id!, userData?.userName!)}
                >
                    Delete Master User
                </Button>
            )}
        </Box>
    );
}