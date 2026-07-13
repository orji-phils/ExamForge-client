import { Box, Button, Checkbox, CheckboxGroup, HStack, NativeSelect, Text, VStack } from "@chakra-ui/react";
import type { ExamForm, MultiExamForm, MultiSubjectForm, SubjectForm } from "../../userComponent/schemas/question.schema";
import { useTitle } from "../../context/TitleContext";

export const RandomPracticeSelectors = ({
    setExamType,
    examTypes,
    selectedExamType,
    setSelectedSubjects,
    selectedSubjects,
    subjects,
    setStart,
    start
}: {
    setExamType: (examType: ExamForm) => void;
    examTypes: MultiExamForm;
    selectedExamType: ExamForm;
    setSelectedSubjects: (selectedSubjects: MultiSubjectForm) => void;
    selectedSubjects: MultiSubjectForm;
    subjects: SubjectForm[];
    setStart: (begin: boolean) => void;
    start: boolean;
}) => {
    useTitle(`Practice${start ? " - Setup" : ""} - ExamForge`);

    return (
        <Box
        bg="white"
        p={{ base: 5, md: 6 }}
        borderRadius="lg"
        boxShadow="sm"
        >
            <VStack align="stretch" gap={6}>

                {/* examType Selection */}
                <Box>
                    <VStack align="stretch" gap={3}>
                        <Text fontWeight="medium">
                            Select examType
                        </Text>

                        <NativeSelect.Root>
                            <NativeSelect.Field
                            id="examType"
                            value={selectedExamType}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                setExamType(e.target.value as ExamForm)
                            }
                            >
                                <option value="">Select examType</option>
                                {examTypes.map(cat => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </NativeSelect.Field>
                        </NativeSelect.Root>
                    </VStack>
                </Box>

                {/* Subject Selection */}
                {(!selectedExamType || !start) && (
                    <Box
                    pt={4}
                    borderTop="1px solid"
                    borderColor="gray.200"
                    >
                        <VStack align="stretch" gap={4}>

                            <Text fontWeight="medium">
                                Select subjects for your simulation
                            </Text>

                            <CheckboxGroup
                            id="subjects"
                            value={selectedSubjects}
                            onValueChange={(values) =>setSelectedSubjects(values as MultiSubjectForm)}
                            >
                                <VStack align="stretch" gap={3}>
                                    {subjects.map(sub => (
                                        <Box
                                        key={sub}
                                        p={3}
                                        borderWidth="1px"
                                        borderRadius="md"
                                        borderColor="gray.200"
                                        _hover={{ borderColor: "blue.400" }}
                                        transition="0.2s"
                                        >
                                            <Checkbox.Root value={sub}>
                                                <Checkbox.HiddenInput />
                                                <HStack gap={3}>
                                                    <Checkbox.Indicator />
                                                    <Checkbox.Label>
                                                        {sub}
                                                    </Checkbox.Label>
                                                </HStack>
                                            </Checkbox.Root>
                                        </Box>
                                    ))}
                                </VStack>
                            </CheckboxGroup>

                            <Button
                            onClick={() => setStart(true)}
                            disabled={selectedSubjects.length === 0}
                            colorScheme="blue"
                            alignSelf="flex-start"
                            >
                                Start Practice
                            </Button>

                        </VStack>
                    </Box>
                )}

            </VStack>
        </Box>
    );
}