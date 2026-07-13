import { Box, Button, Field, Heading, NativeSelect, Spinner, Text, VStack } from "@chakra-ui/react"
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { deleteQuestionSchema, type MultiExamForm, type MultiSubjectForm, type MultiYearForm } from "../../userComponent/schemas/question.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { deletePastQuestion, getExamTypes, getSubjects, getYears } from "../../functions/questionFunctions";
import { useTitle } from "../../context/TitleContext";
import type z from "zod";

export const DeletePastQuestion = () => {
    useTitle("Delete Past Question - Admin Dashboard");

    const { handleSubmit, register, watch, 
        formState: { errors }
    } = useForm<
    z.input<typeof deleteQuestionSchema>,
    any,
    z.output<typeof deleteQuestionSchema>
    >({
        resolver: zodResolver(deleteQuestionSchema)
    });

    const [examTypes, setExamTypes] = useState<MultiExamForm>([]);
    const [subjects, setSubjects] = useState<MultiSubjectForm>([]);
    const [years, setYears] = useState<MultiYearForm>([]);

    const examType = watch("examType");
    const subject = watch("subject");

    const [isLoading, setIsLoading] = useState<boolean>(false);

    //  use a useEffect hook to get the exam examTypes
    useEffect(() => {
        getExamTypes()
        .then(data => {
            data && setExamTypes(data)
        });
    }, []);

    // use effect hook to fetch supported subjects
    useEffect(() => { 
        if (!examType) return;

        setSubjects([]);
        getSubjects(examType)
        .then(data => {
            data && setSubjects(data);
        });
    }, [examType])

    // use a useEffect hook to get the exam years
    useEffect(() => {
        if (!subject) return;
        setIsLoading(true);
        setYears([]);

        getYears(examType!, subject)
        .then(data => {
            data && setYears(data)
        })
        .finally(() => setIsLoading(false));
    }, [subject]);

    if (isLoading) {
        return(
            <Box>
                <Spinner />
                <Text>Searching past question. Please wait.</Text>
            </Box>
        );
    }

        return(
        <Box
        maxW="700px"
        mx="auto"
        bg="white"
        p={{ base: 5, md: 8 }}
        borderRadius="lg"
        boxShadow="md"
        >
            <VStack align="stretch" gap={6}>

                {/* Header */}
                <Box>
                    <Heading as="h1" size="lg" color="red.600">
                        Delete An Entire Past Question
                    </Heading>
                    <Text mt={2} color="gray.600">
                        Kindly select the past question you would like to permanently delete.
                        This action cannot be undone.
                    </Text>
                </Box>

                {/* Divider */}
                <Box borderTop="1px solid" borderColor="gray.200" />

                {/* Form */}
                <form onSubmit={handleSubmit(deletePastQuestion)}>
                    <VStack align="stretch" gap={5}>

                        <Field.Root invalid={!!errors.examType}>
                            <VStack align="stretch" gap={2}>
                                <Text fontWeight="medium">
                                    Select the examType
                                </Text>

                                <NativeSelect.Root disabled={isLoading}>
                                    <NativeSelect.Field
                                    {...register("examType")}
                                    >
                                        <option value="">Select the examType</option>
                                        {examTypes.map(examType => (
                                            <option key={examType} value={examType}>
                                                {examType}
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
                                <Text fontWeight="medium">
                                    Select a Subject
                                </Text>

                                <NativeSelect.Root disabled={isLoading}>
                                    <NativeSelect.Field
                                    {...register("subject")}
                                    >
                                        <option value="">Select the subject</option>
                                        {subjects.map(subject => (
                                            <option key={subject} value={subject}>
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
                                <Text fontWeight="medium">
                                    Select the year
                                </Text>

                                <NativeSelect.Root disabled={isLoading}>
                                    <NativeSelect.Field
                                    {...register("year")}
                                    >
                                        <option value="">Select the year</option>
                                        {years.map(year => (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        ))}
                                    </NativeSelect.Field>
                                </NativeSelect.Root>

                                <Field.ErrorText>
                                    {errors.year?.message}
                                </Field.ErrorText>
                            </VStack>
                        </Field.Root>

                        {/* Warning Box */}
                        <Box
                        p={4}
                        borderRadius="md"
                        bg="red.50"
                        borderWidth="1px"
                        borderColor="red.200"
                        >
                            <Text fontSize="sm" color="red.700">
                                Warning: Deleting this question will permanently remove it
                                from your records.
                            </Text>
                        </Box>

                        {/* Delete Button */}
                        <Button
                        type="submit"
                        loading={isLoading}
                        colorScheme="red"
                        alignSelf="flex-start"
                        >
                            Delete Question
                        </Button>

                    </VStack>
                </form>

            </VStack>
        </Box>
    );
}