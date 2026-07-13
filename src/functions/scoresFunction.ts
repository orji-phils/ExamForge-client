import axios from "../axiosInstance";
import toast from "react-hot-toast";
import type { MultiScoreForm } from "../userComponent/schemas/scores.schema";

const getScoreInfo = async (userId: number, selectedType: string) => {
    try {
        const response = await axios.get(
            `/scores/getScoreInfo/${userId}/${selectedType}`
        );

        return response.data;
    } catch (error) {
        return null;
    }
}

const getScores = async (recordId: number) => {
    try {
        const response = await axios.get(
            `/scores/getScores/${recordId}`
        );

        return response.data;
    } catch (error) {
        return null;
    }

    return null;
}

// delete user's score
const deleteScore = async (recordId: number, subject: string, year: number) => {
    try {
        const response = axios.delete(
            `/scores/delete/${recordId}/${subject}/${year}`
        );

        toast.success((await response).data.message);
    } catch (error) {
        return null;
    }
}

// submit user's score data for upload or update
const submitScores = async (scoresData: MultiScoreForm, recordId: number) => {
    try {
        let lastId: number = recordId;

        // get the last record id to determin the number of the new record id
        const lastRecord = await axios.get(
        `/scores/getLastRecordId`
    );
    lastId = Number(lastRecord.data);

        // post or update the new score data
        const response = await axios.put(
            `/scores/uploads/${lastId}`, scoresData
        );

        toast.success(response.data.message);
        return lastId;
    } catch (error) {
        return null;
    }
}

export { getScoreInfo, getScores, deleteScore, submitScores};