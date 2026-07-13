import { Box, Button, Flex, NativeSelect, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import type { ExamForm, SubjectForm } from "../../userComponent/schemas/question.schema";

export const PracticeSelectors = ({
    examTypes,
    subjects,
    years,
    examType,
    subject,
    year,
    setExamType,
    setSubject,
    setYear,
    submitSelections,
    disabled,
}: {
    examTypes: string[];
    subjects: string [];
    years: number[];
    examType: ExamForm;
    subject: string;
    year: number | "";
    setExamType: (value: ExamForm) => void;
    setSubject: (value: SubjectForm) => void;
    setYear: (value: number | "") => void;
    submitSelections: () => void;
    disabled: boolean;
}) => {

    return (
        <Box
        bg="gray.50"
        p={{ base: 5, md: 8 }}
        borderRadius="md"
        >
            <VStack gap={6} align="stretch">

                {/* Section Title */}
                <Box>
                    <Text fontSize="lg" fontWeight="semibold">
                        Practice Setup
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                        Choose your examType, subject and year before starting.
                    </Text>
                </Box>

                {/* Form Fields */}
                <SimpleGrid columns={{ base: 1, md: 3 }} gap={5}>

                    {/* examType */}
                    <Box>
                        <Text mb={2} fontWeight="medium" fontSize="sm">
                            ExamType
                        </Text>
                        <NativeSelect.Root disabled={disabled}>
                            <NativeSelect.Field
                            id="examType"
                            onChange={(e) => setExamType(e.target.value as ExamForm)}
                            value={examType}
                            >
                                <option value="">Select examType</option>
                                {examTypes.map(type => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </NativeSelect.Field>
                        </NativeSelect.Root>
                    </Box>

                    {/* Subject */}
                    <Box>
                        <Text mb={2} fontWeight="medium" fontSize="sm">
                            Subject
                        </Text>
                        <NativeSelect.Root disabled={disabled}>
                            <NativeSelect.Field
                            id="subjects"
                            onChange={(e) => setSubject(e.target.value as SubjectForm)}
                            value={subject}
                            >
                                <option value="">Select subject</option>
                                {subjects.map(sub => (
                                    <option key={sub} value={sub}>
                                        {sub}
                                    </option>
                                ))}
                            </NativeSelect.Field>
                        </NativeSelect.Root>
                    </Box>

                    {/* Year */}
                    <Box>
                        <Text mb={2} fontWeight="medium" fontSize="sm">
                            Year
                        </Text>
                        <NativeSelect.Root disabled={disabled}>
                            <NativeSelect.Field
                            id="years"
                            onChange={(e) =>
                                setYear(e.target.value === "" ? "" : Number(e.target.value))
                            }
                            value={year}
                            >
                                <option value="">Select year</option>
                                {years.map(yea => (
                                    <option key={yea} value={yea}>
                                        {yea}
                                    </option>
                                ))}
                            </NativeSelect.Field>
                        </NativeSelect.Root>
                    </Box>

                </SimpleGrid>

                {/* Button Area */}
                <Flex justify="flex-end">
                    <Button
                    onClick={submitSelections}
                    disabled={!examType || !subject || !year}
                    colorScheme="blue"
                    size="md"
                    px={8}
                    >
                        Start Practice
                    </Button>
                </Flex>

            </VStack>
        </Box>
    );
}