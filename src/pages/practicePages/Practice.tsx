import { useParams } from "react-router-dom";
import { useUser } from "../../context/UserContext"
import { useEffect, useState } from "react";
import { getScores, submitScores } from "../../functions/scoresFunction";
import { Box, Button, Flex, Heading, Spinner, Stack, Text } from "@chakra-ui/react";
import { PracticeSelectors } from "./PracticeSelectors";
import { PracticeQuestions } from "./PracticeQuestions";
import { PracticeSummary } from "./PracticeSummary";
import { type ExamForm, type MultiExamForm, type MultiQuestionForm, type MultiSubjectForm, type MultiYearForm, type SubjectForm, type YearForm } from "../../userComponent/schemas/question.schema";
import type { MultiScoreForm } from "../../userComponent/schemas/scores.schema";
import { useTitle } from "../../context/TitleContext";
import { getExamTypes, getPastQuestion, getPastQuestionWithId, getSubjects, getYears } from "../../functions/questionFunctions";

export const Practice = () => {
    const { user } = useUser();
    const retrievedRecordId = useParams();
    const isRestoring = Number.isFinite(Number(retrievedRecordId.recordId));
    useTitle(`Practice${isRestoring ? " - Restore" : ""} - ExamForge`);

    // state variables
    const [examTypes, setExamTypes] = useState<MultiExamForm>([]);
    const [subjects, setSubjects] = useState<MultiSubjectForm>([]);
    const [years, setYears] = useState<MultiYearForm>([]);
    const [questions, setQuestions] = useState<MultiQuestionForm>([]);
    const [answers, setAnswers] = useState<MultiScoreForm>([]);

    const [index, setIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [totalAttempts, setTotalAttempts] = useState(0);
    const [recordedId, setRecordedId] = useState(0);

    const [examType, setExamType] = useState<ExamForm>();
    const [subject, setSubject] = useState<SubjectForm>("");
    const [year, setYear] = useState<number | "">("");
    const [activeSubject, setActiveSubject] = useState<SubjectForm>("");
    const [activeYear, setActiveYear] = useState<YearForm | "">("");

    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [close, setClose] = useState(!isRestoring ? false : true);

    // current question
    const currentQuestion = questions[index];

    // save user's responses
    const selected = answers[index]?.userAnswer;

    // retrieve question examTypes
    useEffect(() => {
        if (isRestoring) return;

        getExamTypes()
        .then(data => {
            data &&setExamTypes(data)
        });
    }, [isRestoring]);

    // retrieve available subjects
    useEffect(() => {
        if (!examType || isRestoring) return;

        setSubjects([]);

        getSubjects(examType)
        .then(data => data && setSubjects(data));
    }, [examType, isRestoring]);

    // retrieve the available years for the selected examType and subject
    useEffect(() => {
        if (!subject || isRestoring) return;

        setYears([]);

        getYears(examType!, subject)
        .then(data => {
            data &&setYears(data);
        });
    }, [examType, subject, isRestoring]);

    // retrieve the available questions for the current selections
    const getQuestions = () => {
        if (year === "" || isRestoring) return;

        setLoading(true);
        setClose(true);
        setIndex(0);
        setActiveSubject(subject);
        setActiveYear(year);
        getPastQuestion(examType!, subject!, year)
        .then((data: MultiQuestionForm) => {
            if (!data.length) return;

            setQuestions(data);

            const initialAnswers: MultiScoreForm = data.map(q => ({
                questionId: q.id,
                year: q.year,
                examType: examType,
                subject: q.subject,
                userAnswer: "",
                correctAnswer: q.correctAnswer
            }));

            setAnswers(initialAnswers);
        })
        .finally(() => setLoading(false));
    };

    // restore existing practices
    useEffect(() => {
        if (!isRestoring) return;

        const restoreQuestions = async () => {
            setLoading(true);

            try {
                const scoreData = await getScores(Number(retrievedRecordId.recordId));
                const questionData = await getPastQuestionWithId(scoreData, scoreData[0]?.examType);
                if (!scoreData.length || !questionData.length) return;

                setIndex(0);
                setExamType(scoreData[0].examType)
                setActiveSubject(scoreData[0].subject);
                setActiveYear(scoreData[0].year);
                setQuestions(questionData);
                setAnswers(scoreData);
                setScore(scoreData[0].score);
                setHasSubmitted(true);
            } finally {
                setLoading(false);
            }
        }

        restoreQuestions();
    }, [isRestoring]);

    // handle answers selection
    const handleAnswerSelection = (value: string) => {
        if (!currentQuestion) return;

        setAnswers(prev => prev.map(a => 
            a.questionId === currentQuestion.id ?
            { ...a, userAnswer: value } : a
        ));
    }

    // handle user's practice submission
    const handleSubmission = async () => {
        if (!answers.length) return;

        // count the number of attempted questions
        const attempts = answers.filter(
            a => a.userAnswer !== ""
        ).length;
        setTotalAttempts(attempts);

        // calculate user's score
        const correct = answers.filter(
            a => a.userAnswer === a.correctAnswer
        ).length;

        const finalAnswer = correct * 2;
        setScore(finalAnswer);
        setHasSubmitted(true);

        const updatedData = answers.map(a => ({
            ...a,
            score: finalAnswer,
            userId: user?.id,
            examType
        }));

        if (recordedId) {
            await submitScores(updatedData, Number(retrievedRecordId.recordId));
            setRecordedId(Number(retrievedRecordId.recordId));
        } else {
            const id = await submitScores(updatedData, 0);
            setRecordedId(id!);
        }
    }

    if (loading) {
        return (
            <Flex
            minH="100vh"
            align="center"
            justify="center"
            bg="gray.50"
            px={4}
            >
                <Box
                bg="white"
                p={10}
                borderRadius="md"
                boxShadow="md"
                textAlign="center"
                >
                    <Spinner size="lg" mb={4} />
                    <Text color="gray.600">
                        Loading questions. Please wait.
                    </Text>
                </Box>
            </Flex>
        );
    }

    return (
        <Flex
        minH="100vh"
        align="center"
        justify="center"
        bg="gray.50"
        px={4}
        >
            <Box
            bg="white"
            p={10}
            my={8}
            borderRadius="md"
            boxShadow="md"
            w="full"
            maxW={{ base: "95%", sm: "sm", md: "lg" }}
            >
                {/* Page Header */}
                <Heading
                as="h2"
                mb={6}
                size="lg"
                textAlign="center"
                >
                    Select Questions to Practice
                </Heading>

                {/* Toggle Button */}
                <Flex justify="center" mb={6}>
                    <Button
                    onClick={() => setClose(prev => !prev)}
                    disabled={isRestoring}
                    colorScheme={close ? "blue" : "red"}
                    >
                        {close ? "Select Questions" : "Close Selector"}
                    </Button>
                </Flex>

                <Stack gap={6}>
                    {/* Selector Section */}
                    {!close && (
                        <Box>
                            <PracticeSelectors
                            examTypes={examTypes}
                            subjects={subjects}
                            years={years}
                            examType={examType!}
                            subject={subject}
                            year={year}
                            setExamType={setExamType}
                            setSubject={setSubject}
                            setYear={setYear}
                            submitSelections={getQuestions}
                            disabled={hasSubmitted}
                            />
                        </Box>
                    )}

                    {/* Questions Section */}
                    {questions.length > 0 && (
                        <Box>
                            <PracticeQuestions
                            question={currentQuestion}
                            index={index}
                            total={questions.length}
                            selectedAnswer={selected!}
                            setAnswer={handleAnswerSelection}
                            answers={answers}
                            activeSubject={activeSubject}
                            activeYear={activeYear}
                            hasSubmitted={hasSubmitted}
                            previousQuestion={() =>
                                setIndex(i => Math.max(i - 1, 0))
                            }
                            nextQuestion={() =>
                                setIndex(i => Math.min(i + 1, questions.length - 1))
                            }
                            submitAnswer={handleSubmission}
                            />
                        </Box>
                    )}

                    {/* Summary Section */}
                    {hasSubmitted && (
                        <Box
                        p={6}
                        bg="green.50"
                        borderRadius="md"
                        >
                            <PracticeSummary
                            subject={activeSubject}
                            examType={examType!}
                            totalQuestions={questions.length}
                            score={score}
                            answersCount={totalAttempts}
                            showNewTrial={isRestoring}

                            onTryAgain={() => {
                                setAnswers(prev => 
                                    prev.map(a => ({
                                        ...a,
                                        userAnswer: ""
                                    }))
                                );

                                setIndex(0);
                                setScore(0);
                                setHasSubmitted(false);
                            }}

                            onNewTrial={() => {
                                setExamType("");
                                setSubject("");
                                setYear(0);
                                setQuestions([]);
                                setIndex(0);
                                setAnswers([]);
                                setHasSubmitted(false);
                                setScore(0);
                                setRecordedId(0);
                            }}
                            />
                        </Box>
                    )}
                </Stack>
            </Box>
        </Flex>
    );
}