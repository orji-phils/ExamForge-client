import { Box, Button, Flex, Heading, HStack, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { useTitle } from "../context/TitleContext";
import { useNavigate } from "react-router-dom";

export const Home = () => {
    useTitle("Home - ExamForge");
    const navigate = useNavigate();

    return (
    <Box>

        {/* HERO SECTION */}
        <Flex
            minH="90vh"
            align="center"
            justify="center"
            bg="gray.50"
            px={6}
        >
            <VStack maxW="3xl" textAlign="center" gap={6}>

                <Heading as="h1" size="2xl">
                    Practice Smarter. Succeed Confidently.
                </Heading>

                <Text fontSize="lg" color="gray.600">
                    Access structured exam practice materials for every stage of your academic journey — 
                    from primary school to postgraduate level.
                </Text>

                <HStack gap={4} flexWrap="wrap" justify="center">
                    <Button colorScheme="blue" size="lg" onClick={() => navigate("/practice")}>
                        Start Practicing
                    </Button>

                    <Button variant="outline" size="lg">
                        Explore Levels
                    </Button>
                </HStack>

            </VStack>
        </Flex>


        {/* LEVEL SELECTION */}
        <Box py={20} px={6} bg="white">
            <VStack maxW="6xl" mx="auto" gap={12}>

                <Heading textAlign="center">
                    Choose Your Level
                </Heading>

                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={8}>

                    {[
                        "Primary School",
                        "Secondary School",
                        "Undergraduate",
                        "Postgraduate"
                    ].map((level) => (
                        <Box
                            key={level}
                            p={8}
                            borderWidth="1px"
                            borderRadius="lg"
                            _hover={{ shadow: "md", transform: "translateY(-4px)" }}
                            transition="0.2s"
                            cursor="pointer"
                        >
                            <Heading size="md" mb={3}>
                                {level}
                            </Heading>
                            <Text fontSize="sm" color="gray.600">
                                Practice curated materials tailored for {level.toLowerCase()} students.
                            </Text>
                        </Box>
                    ))}

                </SimpleGrid>
            </VStack>
        </Box>


        {/* HOW IT WORKS */}
        <Box py={20} px={6} bg="gray.50">
            <VStack maxW="5xl" mx="auto" gap={12}>

                <Heading textAlign="center">
                    How It Works
                </Heading>

                <SimpleGrid columns={{ base: 1, md: 3 }} gap={10}>

                    <VStack>
                        <Heading size="md">1. Select Your Level</Heading>
                        <Text textAlign="center" color="gray.600">
                            Choose your academic stage and subject area.
                        </Text>
                    </VStack>

                    <VStack>
                        <Heading size="md">2. Practice or Simulate</Heading>
                        <Text textAlign="center" color="gray.600">
                            Take practice questions or simulate a real exam experience.
                        </Text>
                    </VStack>

                    <VStack>
                        <Heading size="md">3. Track Your Progress</Heading>
                        <Text textAlign="center" color="gray.600">
                            Monitor performance and improve over time.
                        </Text>
                    </VStack>

                </SimpleGrid>

            </VStack>
        </Box>


        {/* FINAL CTA */}
        <Box py={20} px={6} bg="white">
            <VStack maxW="3xl" mx="auto" gap={6} textAlign="center">

                <Heading>
                    Ready to Begin?
                </Heading>

                <Text color="gray.600">
                    Join thousands of students preparing confidently for their exams.
                </Text>

                <Button onClick={() => navigate("/signup")} size="lg" colorScheme="blue">
                    Get Started Today
                </Button>

            </VStack>
        </Box>

    </Box>
);
}