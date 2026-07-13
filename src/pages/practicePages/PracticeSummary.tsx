import { Box, Button, Heading, Text, VStack, HStack, Flex } from "@chakra-ui/react"
import type { ExamForm } from "../../userComponent/schemas/question.schema";
import { useTitle } from "../../context/TitleContext";

export const PracticeSummary = ({
  subject,
  subjects,
  examType,
  totalQuestions,
  score,
  answersCount,
  showNewTrial,
  onTryAgain,
  onNewTrial
}: {
  subject?: string;
  subjects?: string[];
  examType: ExamForm;
  totalQuestions: number;
  score: number;
  answersCount: number;
  showNewTrial: boolean;
  onTryAgain: () => void;
  onNewTrial: () => void;
}) => {
  const correctAnswers = score / 2
  const wrongAnswers = answersCount - correctAnswers
  const percentage = Math.round((correctAnswers / totalQuestions) * 100)

  const performance = percentage >= 75
      ? {
          color: "green.600",
          bg: "green.50",
          message: "Excellent performance!"
        } : percentage >= 50
      ? {
          color: "orange.600",
          bg: "orange.50",
          message: "Good effort. Keep improving!"
        } : {
          color: "red.600",
          bg: "red.50",
          message: "Keep practicing. You can do better!"
        }
        useTitle(`Practice Summary - ${subject || subjects?.join(", ") || "Exam"} - ExamForge`)

  return (
    <Box
      bg="white"
      p={{ base: 6, md: 10 }}
      borderRadius="lg"
      boxShadow="lg"
      role="region"
      aria-labelledby="practice-summary-heading"
    >
      <VStack gap={8} align="stretch">

        {/* Heading */}
        <Heading
          as="h2"
          size="lg"
          textAlign="center"
          id="practice-summary-heading"
        >
          Practice Summary
        </Heading>

        {/* Score Highlight Section */}
        <Box
          bg={performance.bg}
          p={8}
          borderRadius="md"
          textAlign="center"
        >
          <Text
            fontSize={{ base: "3xl", md: "5xl" }}
            fontWeight="bold"
            color={performance.color}
          >
            {percentage}%
          </Text>

          <Text mt={2} fontSize="md">
            {correctAnswers} out of {totalQuestions} correct
          </Text>

          <Text
            mt={3}
            fontWeight="medium"
            color={performance.color}
          >
            {performance.message}
          </Text>

          {/* Accessible Progress Bar */}
          <Box mt={5}>
  <Box
    height="10px"
    bg="gray.200"
    borderRadius="md"
    overflow="hidden"
  >
    <Box
      height="100%"
      width={`${percentage}%`}
      bg="blue.500"
      transition="width 0.4s ease"
      aria-label={`You scored ${percentage} percent`}
      role="progressbar"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  </Box>
</Box>
        </Box>

        <Box as="hr" borderColor="gray.200" />

        {/* Details Grid */}
        <VStack align="stretch" gap={3} fontSize="md">

          <HStack justify="space-between">
            <Text fontWeight="medium">Subject/Course</Text>
            <Text>
              {subjects?.length! > 0
                ? subjects?.join(", ")
                : subject}
            </Text>
          </HStack>

          <HStack justify="space-between">
            <Text fontWeight="medium">examType</Text>
            <Text>{examType}</Text>
          </HStack>

          <HStack justify="space-between">
            <Text fontWeight="medium">Total Questions</Text>
            <Text>{totalQuestions}</Text>
          </HStack>

          <HStack justify="space-between">
            <Text fontWeight="medium">Attempted</Text>
            <Text>{answersCount}</Text>
          </HStack>

          <HStack justify="space-between">
            <Text fontWeight="medium">Correct</Text>
            <Text>{correctAnswers}</Text>
          </HStack>

          <HStack justify="space-between">
            <Text fontWeight="medium">Wrong</Text>
            <Text>{wrongAnswers}</Text>
          </HStack>

        </VStack>

        {/* Action Buttons */}
        <Flex
          direction={{ base: "column", sm: "row" }}
          gap={4}
          pt={4}
        >
          <Button
            onClick={onTryAgain}
            colorScheme="blue"
            size="lg"
            w="full"
          >
            Try Again
          </Button>

          {!showNewTrial && (
            <Button
              onClick={onNewTrial}
              variant="outline"
              size="lg"
              w="full"
            >
              Start New Practice
            </Button>
          )}
        </Flex>

      </VStack>
    </Box>
  )
}