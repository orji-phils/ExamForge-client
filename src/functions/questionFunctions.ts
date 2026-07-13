import axios from "../axiosInstance"
import { API_BASE_URL } from "../util";
import toast from "react-hot-toast";
import { multiExamTypeSchema, multiQuestionSchema, multiSubjectSchema, multiYearSchema, type DeleteQuestionForm, type ExamForm, type UploadQuestionForm } from "../userComponent/schemas/question.schema";
import type { MultiScoreForm } from "../userComponent/schemas/scores.schema";

// get the exam types
const getExamTypes = async () => {
    try {
        const response = await axios.get(
            `/jamb/getDatabases`
        );

        const result = multiExamTypeSchema.safeParse(response.data);
        if (!result.success) {
            console.log(result.error);
            return [];
        }

        return result.data;
    } catch (error) {
        return null;
    }

    return [];
}

// fetch the subjects from the database.
const getSubjects = async (type: string) => {
    try {
        const response = await axios.get(
            `/${type}/getTables`
        );

        const result = multiSubjectSchema.safeParse(response.data);
        if (!result.success) {
            console.log(result.error);
            return [];
        }

        return result.data;
    } catch (error) {
        return null;
    }
}

const getYears = async (examType: ExamForm, subjects: string) => {
    try {
        const response  = await axios.get(
            `/${examType}/getAllYears/${subjects}`
        );

        const result = multiYearSchema.safeParse(response.data);
        if (!result.success) return [];

        return result.data;
    } catch (error) {
        return null;
    }
}

// fetch the past question from the server
const getPastQuestion = async (type: ExamForm, subject: string, year: number) => {
    try {
        const response = await axios.get(
            `/${type}/getPastQuestion/${subject}/${year}`
        );
        console.log(JSON.stringify(response.data));

        const result = multiQuestionSchema.safeParse(response.data);
        if (!result.success) {
            // console.log(result.error);
            return [];
        }

        return response.data;
    } catch (error) {
        return [];
    }

    return [];
}

// get random past questions using their subjects
const getRandomQuestions = async (category: string, subjects: string[]) => {
    try {
        const response = await axios.get(
            `/${category}/getRandomQuestions/${subjects}`
        );

        const result = multiQuestionSchema.safeParse(response.data);
        if (!result.success) return [];

        return result.data;
    } catch (error) {
        return null;
    }
}

// fetch pastquestions with their id
const getPastQuestionWithId = async (scoreInfo: MultiScoreForm, type: string) => {
    try {
        const response = await axios.post(
            `/${type}/getQuestionsWithId`, scoreInfo
        );

        const result = multiQuestionSchema.safeParse(response.data);
        if (!result.success) return [];

        return response.data;
    } catch (error) {
        return [];
    }
}

// delete an existing past question
const deletePastQuestion = async (questionData: DeleteQuestionForm) => {
    try {
        console.log(JSON.stringify(questionData));
        const response = await axios.delete(
            `/jamb/deletePastQuestion/${questionData.subject}/${questionData.year}`
        );

        toast.success(response.data.message);
    } catch (error) {
        return null;
    }
}

// submit the past question to the server
const submitPastQuestion = async (content: UploadQuestionForm) => {
    // append the form input to the formData object
    const formData = new FormData();
    for (const key in content) {
        const value = content[key as keyof UploadQuestionForm];

        if (value instanceof FileList && value.length > 0) {
            formData.append(key, value[0]);
        } else {
            formData.append(key, String(value));
        }
    }

    try {
        const response = await axios.put(
            `${API_BASE_URL}/jamb/uploadPastQuestion/${content?.subject}/${content?.year}`, formData
        );

        console.log(JSON.stringify(content));
        toast.success(response.data.message);
    } catch (error) {
        return;
    }
}

const formatOption = (options: any) => {
    try {
        const optionObject = JSON.parse(options);

        return Object.keys(optionObject)
        .map(option => `${option}. ${optionObject[option]}`)
        .join('\n');
    } catch (error) {
        toast.error("Error formatting options. Please try again.");
    }
}

export { getExamTypes, getSubjects, getYears, getPastQuestion, getRandomQuestions, getPastQuestionWithId, deletePastQuestion, submitPastQuestion, formatOption };