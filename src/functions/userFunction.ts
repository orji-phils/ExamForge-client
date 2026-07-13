import toast from "react-hot-toast"
import axios from "../axiosInstance"
import { multiUserSchema, userProfileSchema, type UserNameForm, type UserRoleForm } from "../userComponent/schemas/user.schema";

const deleteUser = (userId: number, userName: string) => {
    axios.delete(
        `/user/deleteUser/${userId}/${userName}`
    ).then(
        response => toast.success(response.data.message)
    );
}

const suspendAccount = async (userId: number, userName: string) => {
    try {
        const response = await axios.patch(
            `/accountActivation/suspend/${userId}/${userName}`
        );

        toast.success(response.data.message);
    } catch (error) {
        return null;
    }
}

const searchUser = async (userName: UserNameForm) => {
    try {
        const response = await axios.get(
            `/user/get/userName/${userName}`
        );

        const result = multiUserSchema.safeParse(response.data);
        if (!result.success) {
            console.log("Error fetching user;", result.error);
            return null;
        }

        return result.data;
    } catch (error) {
        return null;
    }
}

const getUsers = async (userType: UserRoleForm) => {
    try {
        const response = await axios.get(
            `/user/getUserByType/${userType}`
        );

        const result = multiUserSchema.safeParse(response.data);
        if (!result.success) {
            console.log("Error fetching all user type:", result.error);
            return [];
        }

        return result.data;
    } catch (error) {
        return null;
    }
}

// get user's full data
const getFullData = async (userId: number) => {
    try {
        const response = await axios.get(
            `/user/getFullUserData/${userId}`
        );

        const result = userProfileSchema.safeParse(response.data);
        if (!result.success) {
            console.log("Error fetching all user data:", result.error);
            return null;
        }

        return result.data;
    } catch (error) {
        return null;
    }
}

export { deleteUser, suspendAccount, searchUser, getUsers, getFullData };