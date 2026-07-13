import { Box, Button, Field, Heading, Input, NativeSelect, Spinner, Text, Textarea, VStack } from "@chakra-ui/react";
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react";
import { formatOption, getPastQuestion, getSubjects, getExamTypes, submitPastQuestion } from "../../functions/questionFunctions";
import { uploadQuestionSchema, type MultiExamForm, type MultiQuestionForm, type MultiSubjectForm, } from "../../userComponent/schemas/question.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTitle } from "../../context/TitleContext";
import type z from "zod";

export const UploadPastQuestion = () => {
    useTitle("Upload Or Modify Past Question - Admin Dashboard");

    const { handleSubmit, register, watch, setValue,
        formState: { errors }
    } = useForm<
z.input<typeof uploadQuestionSchema>,
any,
z.output<typeof uploadQuestionSchema>
    >({
        resolver: zodResolver  (uploadQuestionSchema)
    });

    // state variables
    const [examTypes, setExamTypes] = useState<MultiExamForm>([])
    const [subjects, setSubjects] = useState<MultiSubjectForm>([]);
    const [pastQuestion, setPastQuestion] = useState<MultiQuestionForm>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // watcher variables
    const examType = watch("examType");
        const subject = watch("subject");
        const year = Number(watch("year"));
    let questionContent = watch("question");

    // use effect hook to fetch supported exam types
    useEffect(() => {
        getExamTypes()
        .then(data => {
            data && setExamTypes(data)
        });
    }, []);

    // use effect hook to fetch supported subjects
    useEffect(() => {
        if (!examType) return;

        getSubjects(examType)
        .then(data => {
            data && setSubjects(data);
        });
    }, [examType])

    // use effect hook to fetch the past questions
    useEffect(() => {
        if (!subject || !year) return;

        getPastQuestion(examType!, subject, year)
        .then(data => {
            data && setPastQuestion(data);
        });
    }, [examType, subject, year])

    // use the useEffect hook to update the question content
    useEffect(() => {
        setIsLoading(true);

        questionContent = pastQuestion.map(question => (
`${question.questionNumber}. ${question.question}
${formatOption(question.options)}
Answer: ${question.correctAnswer}
`
        )).join("")

        setValue("question", questionContent);
        setIsLoading(false);
    }, [pastQuestion]);

    if (isLoading) {
        <Box>
            <Spinner />
            <Text>Loading content. Please wait.</Text>
        </Box>
    }

        return (
        <Box
        maxW="800px"
        mx="auto"
        bg="white"
        p={{ base: 5, md: 8 }}
        borderRadius="lg"
        boxShadow="md"
        >
            <VStack align="stretch" gap={8}>

                {/* Page Header */}
                <Box>
                    <Heading as="h1" size="lg">
                        Upload Or Modify A Past Question
                    </Heading>

                    <Text mt={2} color="gray.600">
                        Fill up the fields below to upload or update a past question.
                        You may either paste the full content into the editor or upload
                        a file containing the question data.
                    </Text>
                </Box>

                {/* Instruction Section */}
                <Box
                p={4}
                bg="blue.50"
                borderWidth="1px"
                borderColor="blue.200"
                borderRadius="md"
                >
                    <Heading as="h2" size="sm" mb={2}>
                        How To Upload Or Update
                    </Heading>

                    <Text fontSize="sm" color="blue.800">
                        When pasting into the edit box, ensure you include the full
                        questions, options, and correct answers from the first
                        question to the last.
                    </Text>
                </Box>

                {/* Form */}
                <form onSubmit={handleSubmit(submitPastQuestion)}>
                    <VStack align="stretch" gap={6}>

                        {/* Metadata Section */}
                        <Box>
                            <Heading as="h3" size="sm" mb={4}>
                                Exam Details
                            </Heading>

                            <VStack align="stretch" gap={5}>

                                <Field.Root invalid={!!errors.examType}>
                                    <VStack align="stretch" gap={2}>
                                        <label htmlFor="examType"><Text fontWeight="medium">
                                            Select ExamType
                                        </Text></label>

                                        <NativeSelect.Root disabled={isLoading}>
                                            <NativeSelect.Field
                                            id="examType"
                                            { ...register("examType") }
                                            >
                                                <option value="">Select ExamType</option>
                                                {examTypes.map(examType => (
                                                    <option
                                                    key={examType}
                                                    value={examType}
                                                    >
                                                        {examType.toLocaleUpperCase()}
                                                    </option>
                                                ))}
                                            </NativeSelect.Field>
                                        </NativeSelect.Root>

                                        <Field.ErrorText>
                                            {errors.examType?.message}
                                        </Field.ErrorText>
                                    </VStack>
                                </Field.Root>

                                <Field.Root invalid={!!errors.subject}>
                                    <VStack align="stretch" gap={2}>
                                        <label htmlFor="subject"><Text fontWeight="medium">
                                            Select the subject
                                        </Text></label>

                                        <NativeSelect.Root disabled={isLoading}>
                                            <NativeSelect.Field
                                            id="subject"
                                            { ...register("subject") }
                                            >
                                                <option value="">Select a subject</option>
                                                {subjects?.map((subject, index) => (
                                                    <option key={index} value={subject}>
                                                        {subject}
                                                    </option>
                                                ))}
                                            </NativeSelect.Field>
                                        </NativeSelect.Root>

                                        <Field.ErrorText>
                                            {errors.subject?.message}
                                        </Field.ErrorText>
                                    </VStack>
                                </Field.Root>

                                <Field.Root invalid={!!errors.year}>
                                    <VStack align="stretch" gap={2}>
                                        <label htmlFor="year"><Text fontWeight="medium">
                                            Enter Exam Year
                                        </Text></label>

                                        <Input
                                        type="number"
                                        id="year"
                                        min={1900}
                                        max={new Date().getFullYear()}
                                        { ...register("year")}
                                        />

                                        <Field.ErrorText>
                                            {errors.year?.message}
                                        </Field.ErrorText>
                                    </VStack>
                                </Field.Root>

                            </VStack>
                        </Box>

                        {/* Content Section */}
                        <Box>
                            <Heading as="h3" size="sm" mb={4}>
                                Question Content
                            </Heading>

                            <VStack align="stretch" gap={5}>

                                <Field.Root invalid={!!errors.question}>
                                    <VStack align="stretch" gap={2}>
                                        <label htmlFor="content"><Text fontWeight="medium">
                                            Paste Exam Content
                                        </Text></label>

                                        <Textarea
                                        id="content"
                                        minH="200px"
                                        placeholder="Paste full question content here..."
                                        {...register("question") }
                                        />

                                        <Field.ErrorText>
                                            {errors.question?.message}
                                        </Field.ErrorText>
                                    </VStack>
                                </Field.Root>

                                <Field.Root invalid={!!errors.questionFile}>
                                    <VStack align="stretch" gap={2}>
                                        <Text fontWeight="medium">
                                            Or Upload Exam File
                                        </Text>

                                        <Input
                                        type="file"
                                        id="file"
                                        {...register("questionFile")}
                                        />

                                        <Field.ErrorText>
                                            {errors.questionFile?.message}
                                        </Field.ErrorText>
                                    </VStack>
                                </Field.Root>

                            </VStack>
                        </Box>

                        {/* Submit */}
                        <Button
                        type="submit"
                        loading={isLoading}
                        colorScheme="blue"
                        alignSelf="flex-start"
                        >
                            {pastQuestion.length > 0
                                ? `Update Past Question`
                                : `Upload Past Question`}
                        </Button>

                    </VStack>
                </form>

            </VStack>
        </Box>
    );
}