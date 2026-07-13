import toast from "react-hot-toast";
import axios from "../axiosInstance";
import { multiUpgradeSchema, upgradeSchema, type StatusForm, type UserNameForm } from "../userComponent/schemas/upgrades.schema";

// get all upgrade requests
const getUpgradeRequests = async (status: StatusForm) => {
    try {
        const response = await axios.get(
            `/upgradeRequests/get/status/${status}`
        );

        const result = multiUpgradeSchema.safeParse(response.data);
        if (!result.success) {
            console.log("Error fetching upgrade data via status type:", result.error)
            return [];
        }

        return result.data;
    } catch (error) {
        return [];
    }
}

// get a user's upgrade data via their userName
const getUpgradeData = async (userName: UserNameForm) => {
    try {
        const response = await axios.get(
            `/upgradeRequests/get/userName/${userName}`
        );

        const result = multiUpgradeSchema.safeParse(response.data);
        if (!result.success) {
            console.log("Error fetching searched user:", result.error);
            return [];
        }

        return result.data;
    } catch (error) {
        return [];
    }
}

// get a single user upgrade request
const getSingleUpgradeRequest = async (userId: number) => {
    try {
        const response = await axios.get(
            `/upgradeRequests/get/userId/${userId}`
        );

        const result = upgradeSchema.safeParse(response.data);
        if (!result.success) {
            console.log("Error fetching upgrade data via userId:", result.error);
            return null;
        }

        return result.data;
    } catch (error) {
        return null;
    }
}

// delete a user's upgrade request
const deleteRequest = async (userId: number, userName: UserNameForm) => {
    try {
        const response = await axios.delete(
            `/upgradeRequests/delete/${userId}/${userName}`
        );

        toast.success(response.data.message);
    } catch (error) {
        return null;
    }
}

// approve user's upgrade request
const approveRequest = async (userId: number, userName: UserNameForm) => {
    try {
        const response = await axios.patch(
        `/upgradeRequests/approve/${userId}/${userName}`
    );

    toast.success(response.data.message);
    } catch (error) {
        return null;
    }
}

// restore user back to admin
const restoreAdmin  = async (userId: number, userName: UserNameForm) => {
    try {
        const response = await axios.patch(
            `/upgradeRequests/restore/${userId}/${userName}`
        );

        toast.success(response.data.message);
    } catch (error) {
        return null;
    }
}

// upgrade user or admin to master
const upgradeToMaster = async (userId: number, username: string) => {
    try {
        const response = await axios.patch(
            `/upgradeRequests/upgrade/${userId}/${username}`
        );

        toast.success(response.data.message);
    } catch (error) {
        return null;
    }
}

// reject user's upgrade request
const rejectRequest = async (userId: number, userName: UserNameForm) => {
    try {
        const response = await axios.patch(
            `/upgradeRequests/reject/${userId}/${userName}`
        );

        toast.success(response.data.message);
    } catch (error) {
        return null;
    }
}

// revoke admin access
const revokeAccess = async (userId: number, userName: UserNameForm) => {
    try {
        const response = await axios.patch(
            `/upgradeRequests/revoke/${userId}/${userName}`
        );

        toast.success(response.data.message);
    } catch (error) {
        return null;
    }
}

// apply for account upgrade
const upgradeAccount = async () => {
    try {
        const response = await axios.post(
            `/upgradeRequests/request`
        );

        toast.success(response.data.message);
    } catch (error) {
        return null;
    }
}

export { getUpgradeRequests, getUpgradeData, getSingleUpgradeRequest, deleteRequest, approveRequest, restoreAdmin, upgradeToMaster, rejectRequest, revokeAccess, upgradeAccount };