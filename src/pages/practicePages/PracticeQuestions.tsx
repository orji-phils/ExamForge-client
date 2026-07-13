import { Box, Button, Flex, Heading, HStack, RadioGroup, Text, VStack } from "@chakra-ui/react";
import type { QuestionForm, SubjectForm } from "../../userComponent/schemas/question.schema";
import type { MultiScoreForm } from "../../userComponent/schemas/scores.schema";
import { useTitle } from "../../context/TitleContext";

export const PracticeQuestions = ({
    question,
    index,
    total,
    selectedAnswer,
    setAnswer,
    answers,
    activeSubject,
    activeYear,
    hasSubmitted,
    previousQuestion,
    nextQuestion,
    submitAnswer
}: {
    question: QuestionForm;
    index: number;
    total: number;
    selectedAnswer: string;
    setAnswer: (value: string) => void;
    answers: MultiScoreForm;
    activeSubject: SubjectForm;
    activeYear: number | "";
    hasSubmitted: boolean;
    previousQuestion: () => void;
    nextQuestion: () => void;
    submitAnswer: () => void;
}) => {
    const options = JSON.parse(question.options as any) as Record<string, string>
    useTitle(`Practice - ${activeSubject} ${activeYear} - Question ${index + 1} of ${total}`);

    return (
        <Box
        bg="white"
        p={{ base: 5, md: 8 }}
        borderRadius="md"
        boxShadow="md"
        >
            <VStack align="stretch" gap={6}>

                {/* Header */}
                <Box borderBottom="1px solid" borderColor="gray.200" pb={3}>
                    <Heading as="h3" size="md">
                        {activeSubject} - {activeYear}
                    </Heading>
                    <Text fontSize="sm" color="gray.600">
                        Question {index + 1} of {total}
                    </Text>
                </Box>

                {/* Question Text */}
                <Box>
                    <Text fontWeight="medium" fontSize="lg">
                        Q{question.questionNumber}. {question.question}
                    </Text>
                </Box>

                {/* Options */}
                <RadioGroup.Root
                onValueChange={(e) => setAnswer(e.value!)}
                value={selectedAnswer}
                >
                    <VStack align="stretch" gap={4}>
                        {Object.entries(options).map(([key, value]) => (
                            <Box
                            key={key}
                            p={4}
                            borderWidth="1px"
                            borderRadius="md"
                            borderColor="gray.200"
                            _hover={{ borderColor: "blue.400" }}
                            transition="0.2s"
                            >
                                <RadioGroup.Item value={key}>
                                    <RadioGroup.ItemHiddenInput />
                                    <HStack gap={3}>
                                        <RadioGroup.ItemIndicator />
                                        <RadioGroup.ItemText>
                                            {key}. {value}
                                        </RadioGroup.ItemText>
                                    </HStack>
                                </RadioGroup.Item>
                            </Box>
                        ))}
                    </VStack>
                </RadioGroup.Root>

                {/* Feedback */}
                {hasSubmitted && (
                    <Box
                    p={4}
                    borderRadius="md"
                    bg={
                        answers[index].userAnswer === question.correctAnswer
                        ? "green.50"
                        : "red.50"
                    }
                    >
                        <Text
                        fontWeight="medium"
                        color={
                            answers[index].userAnswer === question.correctAnswer
                            ? "green.600"
                            : "red.600"
                        }
                        >
                            {answers[index].userAnswer === question.correctAnswer
                            ? `Correct. The answer is ${question.correctAnswer}`
                            : `Wrong. The correct answer is ${question.correctAnswer}`}
                        </Text>
                    </Box>
                )}

                {/* Navigation */}
                <Flex justify="space-between" pt={4}>

                    <Button
                    onClick={previousQuestion}
                    disabled={index === 0}
                    variant="outline"
                    >
                        Previous Question
                    </Button>

                    <HStack gap={4}>
                        <Button
                        onClick={nextQuestion}
                        disabled={index === total - 1}
                        variant="outline"
                        >
                            Next Question
                        </Button>

                        <Button
                        onClick={submitAnswer}
                        disabled={
                            hasSubmitted || 
                            !answers.some(a => a.userAnswer !== "")
                        }
                        colorScheme="blue"
                        >
                            Submit
                        </Button>
                    </HStack>

                </Flex>

            </VStack>
        </Box>
    );
}