import toast from "react-hot-toast";
import axios from "../axiosInstance";
import type { ProfileForm } from "../userComponent/schemas/profile.schema";
import type { UserForm } from "../userComponent/schemas/user.schema";

// submit profile data for upload or update
const submitProfile = async (values: ProfileForm) => {
    try {
        const formData = new FormData();

        // get the form input and append them to the formData object
        for (const key in values) {
            const value = values[key as keyof ProfileForm]
            if ((key === "file" || key === "profilePicture") && value instanceof FileList) {
                value.length > 0 && formData.append(key, value[0]);
            } else {
                formData.append(key, String(value));
            }
        }

        // upload or update user's profile
        const response = await axios.put(
            `/profile/uploadProfile`, formData
        );

        toast.success(response.data.message);
        // navigate(`${values.accountType}Profile`);
    } catch (error: any) {
        if (error.response?.status === 404) {
            return null;
        }

        throw error;
    }
}

// get user's profile
const getProfile = async () => {
    try {
        const response = await axios.get(
            `/profile/getProfile`
        );

        const profileData = response.data;

        if (profileData) {
            if (profileData.dateOfBirth) {
                const dateOfBirth = profileData.dateOfBirth;
                const date = new Date(dateOfBirth);

                profileData.dateOfBirth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            }

            return profileData;
        }
    } catch (error: any) {
        return null;
    }

    return null;
}

// delete user's account 
const deleteProfile = async () => {
    try {
        const response = await axios.delete(
            `/profile/deleteProfile`
        );

        toast.success(response.data.message);
        // navigate("/");
    } catch (error) {
        return null;
    }
}

// log user out
const logOut = async (updateUser: (user: UserForm | null) => void) => {
        try {
            // setIsLoading(true);
            const response = await axios.get(
                `/auth/signout`
            );

            updateUser(null);
            // navigate("/signin");
            toast.success(response.data.message);
        } catch (error) {
            return null;
        } finally {
            // setIsLoading(false);
        }
    }

export { submitProfile, getProfile, deleteProfile, logOut };