import { useParams } from "react-router-dom";
import { useUser } from "../../context/UserContext"
import { useEffect, useState } from "react";
import { Box, Flex, Heading, HStack, Spinner, Text, VStack } from "@chakra-ui/react";
import { RandomPracticeSelectors } from "./RandomPracticeSelectors";
import { PracticeQuestions } from "./PracticeQuestions";
import { PracticeSummary } from "./PracticeSummary";
import { getScores, submitScores } from "../../functions/scoresFunction";
import type { MultiScoreForm } from "../../userComponent/schemas/scores.schema";
import type { ExamForm, MultiExamForm, MultiQuestionForm, MultiSubjectForm } from "../../userComponent/schemas/question.schema";
import { useTitle } from "../../context/TitleContext";
import { getExamTypes, getPastQuestionWithId, getRandomQuestions, getSubjects } from "../../functions/questionFunctions";

export const RandomPractice = () => {
    const { user } = useUser();
    const retrievedRecord = useParams();
    const isRestoring = Number.isFinite(Number(retrievedRecord.recordId))
    useTitle(`Practice${isRestoring ? " - Restore" : ""} - ExamForge`);

    const [examTypes, setExamTypes] = useState<MultiExamForm>([]);
    const [examType, setExamType] = useState<ExamForm>("");
    const [subjects, setSubjects] = useState<MultiSubjectForm>([]);
    const [selectedSubjects, setSelectedSubjects] = useState<MultiSubjectForm>([]);
    const [questions, setQuestions] = useState<MultiQuestionForm>([]);
    const [answers, setAnswers] = useState<MultiScoreForm>([]);

    const [index, setIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [recordedId, setRecordedId] = useState(0);

    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [start, setStart] = useState(false);

    const currentQuestion = questions[index];
    const selected = currentQuestion ? 
    answers.find(
        a => a.questionId === currentQuestion.id
    )?.userAnswer : "";

    const currentSubject = currentQuestion && currentQuestion.subject;  // get the current subject user is solving

    // get the number of the current question
    const subjectNumber = questions.slice(0, index + 1)
    .filter(q => q.subject === currentSubject)
    .length;

    // get the total number of the current subject
    const totalPerSubject = questions.filter(
        q => q.subject === currentSubject
    ).length;

        // fetch the examTypes with useEffect hook
    useEffect(() => {
        if (isRestoring) return;

        getExamTypes().then(data => {
            data &&setExamTypes(data);
        });
    }, [isRestoring]);

    // fetch the subjects with useEffect hook
    useEffect(() => {
        if (!examType || isRestoring) return;

        getSubjects(examType!).then(data => {
            data &&setSubjects(data);
        });
    }, [examType, isRestoring]);

    // fetch the random past questions using a useEffect hook
    useEffect(() => {
        if (!start || isRestoring) return;

        setLoading(true);
        getRandomQuestions(examType, selectedSubjects)
        .then((randomQuestions: MultiQuestionForm | null) => {
            if (!randomQuestions?.length) return;

            setQuestions(randomQuestions);
            const initialAnswers: MultiScoreForm = randomQuestions.map(q => ({
                questionId: q.id,
                year: q.year,
                subjects: selectedSubjects,
                examType,
                userAnswer: "",
                correctAnswer: q.correctAnswer
            }));

            setAnswers(initialAnswers);
        })
        .finally(() => setLoading(false));
    }, [start, examType, isRestoring]);

    // restore existing random practices
    useEffect(() => {
        if (!isRestoring) return;
        setLoading(true);
        
        getScores(Number(retrievedRecord.recordId))
        .then((scoreData) => {
            getPastQuestionWithId(scoreData, scoreData[0].examType)
            .then((questionData) => {
                if (!scoreData.length || !questionData.length) return;

                setIndex(0);
                setExamType(scoreData[0].examType);
                setSelectedSubjects(scoreData[0].subjects);
                setQuestions(questionData);
                setAnswers(scoreData);
                setScore(scoreData[0].score)
                setHasSubmitted(true);
            });
        })
        .finally(() => setLoading(false));
    }, [isRestoring]);

    // handle answer selection
    const handleAnswerSelection = (value: string) => {
        if (!currentQuestion) return;

        setAnswers(prev => prev.map(a => 
            a.practiceId === currentQuestion.id
            ? { ...a, userAnswer: value } : a
        ));
    }

    // handle user's practice submission
    const handleSubmission = async () => {
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
            userId: user?.id
        }));

        if (recordedId) {
            await submitScores(updatedData, Number(retrievedRecord.recordId));
            setRecordedId(Number(retrievedRecord.recordId));
        } else {
            const id = await submitScores(updatedData, 0);
            setRecordedId(id!);
        }
    }

        if (loading) {
        return (
            <Flex
            minH="60vh"
            align="center"
            justify="center"
            direction="column"
            gap={4}
            >
                <Spinner size="lg" borderWidth="4px" />
                <Text fontSize="md" color="gray.600">
                    Loading questions. Please wait.
                </Text>
            </Flex>
        );
    }

    return (
        <Box
        maxW="900px"
        mx="auto"
        px={{ base: 4, md: 6 }}
        py={{ base: 6, md: 10 }}
        >
            <VStack align="stretch" gap={8}>

                {/* Page Heading */}
                <Heading as="h1" size="lg">
                    Practice Simulations
                </Heading>

                {/* Selectors */}
                {!isRestoring && (
                    <Box
                    p={{ base: 4, md: 6 }}
                    borderWidth="1px"
                    borderRadius="lg"
                    borderColor="gray.200"
                    bg="white"
                    boxShadow="sm"
                    >
                        <RandomPracticeSelectors
                        setExamType={setExamType}
                        examTypes={examTypes}
                        selectedExamType={examType}
                        setSelectedSubjects={setSelectedSubjects}
                        selectedSubjects={selectedSubjects}
                        subjects={subjects}
                        setStart={setStart}
                        start={start}
                        />
                    </Box>
                )}

                {/* Question Section */}
                {questions.length > 0 && (
                    <PracticeQuestions
                    activeSubject={questions[index].subject!}
                    activeYear={questions[index].year}
                    question={currentQuestion}
                    index={index}
                    total={questions.length}
                    selectedAnswer={selected ?? ""}
                    setAnswer={handleAnswerSelection}
                    answers={answers}
                    hasSubmitted={hasSubmitted}
                    previousQuestion={() => setIndex(i => Math.max(i - 1, 0))}
                    nextQuestion={() => setIndex(i => Math.min(i + 1, questions.length - 1))}
                    submitAnswer={handleSubmission}
                    />
                )}

                {/* Summary Section */}
                {hasSubmitted && (
                    <Box
                    p={{ base: 4, md: 6 }}
                    borderWidth="1px"
                    borderRadius="lg"
                    borderColor="gray.200"
                    bg="gray.50"
                    >
                        <PracticeSummary
                        subjects={selectedSubjects}
                        examType={examType}
                        totalQuestions={questions.length}
                        score={score}
                        answersCount={answers.length}
                        showNewTrial={isRestoring}
                        onTryAgain={() => {
                            setAnswers([]);
                            setIndex(0);
                            setHasSubmitted(false);
                        }}
                        onNewTrial={() => {
                            setExamType("");
                            setSelectedSubjects([]);
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

                {/* Progress Info Footer */}
                {questions.length > 0 && (
                    <Box
                    pt={4}
                    borderTop="1px solid"
                    borderColor="gray.200"
                    >
                        <HStack justify="space-between" flexWrap="wrap" gap={3}>
                            <Text fontSize="sm" color="gray.600">
                                {currentSubject} {subjectNumber} / {totalPerSubject}
                            </Text>

                            <Text fontSize="sm" color="gray.600">
                                {questions.length} total questions
                            </Text>
                        </HStack>
                    </Box>
                )}

            </VStack>
        </Box>
    );
}