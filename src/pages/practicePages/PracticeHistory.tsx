import React, { useEffect, useState } from "react"
import { useUser } from "../../context/UserContext";
import { deleteScore, getScoreInfo } from "../../functions/scoresFunction";
import { Box, Button, Heading, NativeSelect, Spinner, Text, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { dateFormat } from "../../functions/otherFunctions";
import type { MultiScoreForm, ScoreForm } from "../../userComponent/schemas/scores.schema";
import type { MultiSubjectForm, SubjectForm } from "../../userComponent/schemas/question.schema";
import { useTitle } from "../../context/TitleContext";

export const PracticeHistory = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    useTitle(`Practice History - ExamForge`);

    const [scoreInfo, setScoreInfo] = useState<MultiScoreForm>([]);
    const [distinctSubjects, setDistinctSubjects] = useState<MultiSubjectForm>([]);
    const [visibleSubject, setVisibleSubject] = useState<SubjectForm| null>(null);
    const [selectedType, setSelectedType] = useState("");
    const [groupedPractice, setGroupedPractice] = useState<MultiScoreForm>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // get the user's score information
    useEffect(() => {
        if (!user?.id || !selectedType) return;
        setScoreInfo([]);

        getScoreInfo(user?.id, selectedType)
        .then(data => {
            data && setScoreInfo(data);
        });
    }, [user?.id, selectedType]);

    // handle single question practices
    useEffect(() => {
        if (selectedType !== "single") return;
        setIsLoading(true);

        const subjects = scoreInfo.map(r => r.subject)
        .filter(Boolean) as MultiSubjectForm;

        setDistinctSubjects(Array.from(new Set(subjects)));
        setIsLoading(false);
    }, [scoreInfo]);

    // handle multiple question practices
    useEffect(() => {
        if (selectedType !== "simulation") return;
        setIsLoading(true);

        const grouped = Object.values(
            scoreInfo.reduce((listItem, item) => {
                if (!listItem[item.recordId!]) {
                    listItem[item.recordId!] = {
                        recordId: item.recordId!,
                        score: item.score!,
                        examType: item.examType!,
                        created_date: item.created_date!,
                        modified_date: item.modified_date!,
                        subjects: []
                    };
                }

                if (item.subject) {
                    listItem[item.recordId!].subjects?.push(item.subject!)
                }

                return listItem;
            }, {} as Record<number, ScoreForm>)
        );

        setGroupedPractice(grouped);
        setIsLoading(false);
    }, [scoreInfo, selectedType]);

    if (isLoading) {
        return (
            <Box>
                <Spinner />
                <Text>Loading practice history. Please wait.</Text>
            </Box>
        );
    }

            return (
        <Box
        bg="white"
        p={{ base: 5, md: 8 }}
        borderRadius="lg"
        boxShadow="md"
        >
            <VStack align="stretch" gap={8}>

                {/* Page Heading */}
                <Heading as="h1" size="lg">
                    Your Overall Practice History
                </Heading>

                {/* Selector Section */}
                <Box>
                    <VStack align="stretch" gap={3}>
                        <Text fontWeight="medium">
                            Select History Type
                        </Text>

                        <NativeSelect.Root>
                <NativeSelect.Field
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedType(e.target.value)}
                >
                    <option value="">Select Practice Type</option>
                    <option value="single">Single Subject Practice History</option>
                    <option value="simulation">Similation Practice History</option>
                </NativeSelect.Field>
            </NativeSelect.Root>
                    </VStack>
                </Box>

                {/* Single Subject History */}
                {distinctSubjects.length > 0 && selectedType === "single" && (
                    <VStack align="stretch" gap={4}>

                        {distinctSubjects.map(subject => (
                            <Button
                            key={subject}
                            onClick={() =>
                                setVisibleSubject(
                                    visibleSubject === subject ? null : subject
                                )
                            }
                            aria-expanded={visibleSubject === subject}
                            variant="outline"
                            justifyContent="space-between"
                            >
                                {subject} Practice
                            </Button>
                        ))}

                        {visibleSubject && (
                            <VStack align="stretch" gap={4} pt={4}>

                                {scoreInfo
                                ?.filter(info => info.subject === visibleSubject)
                                .map((info, index) => (
                                    <Box
                                    key={index}
                                    p={4}
                                    borderWidth="1px"
                                    borderRadius="md"
                                    borderColor="gray.200"
                                    bg="gray.50"
                                    >
                                        <VStack align="stretch" gap={2}>
                                            <Heading as="h2" size="sm">
                                                {index+1}. {info.subject} - {info.year}
                                            </Heading>

                                            <Text>
                                                Exam Type: {info.examType}
                                            </Text>

                                            <Text fontWeight="medium">
                                                Score: {info.score}
                                            </Text>

                                            <Text fontSize="sm" color="gray.600">
                                                Written on: {dateFormat(info.created_date!)}
                                            </Text>

                                            {info.created_date !== info.modified_date && (
                                                <Text fontSize="sm" color="gray.600">
                                                    Rewritten on: {dateFormat(info.modified_date!)}
                                                </Text>
                                            )}

                                            <Button
                                            onClick={() =>
                                                navigate(`/practice/${info.recordId}`)
                                            }
                                            colorScheme="blue"
                                            size="sm"
                                            alignSelf="flex-start"
                                            >
                                                Review Practice
                                            </Button>

                                            <Button
                                            onClick={() =>
                                                deleteScore(scoreInfo[0].recordId!, scoreInfo[0].subject!, scoreInfo[0].year!)
                                            }
                                            colorScheme="red"
                                            size="sm"
                                            alignSelf="flex-start"
                                            >
                                                Delete Practice
                                            </Button>
                                        </VStack>
                                    </Box>
                                ))}

                            </VStack>
                        )}

                    </VStack>
                )}

                {/* Simulation History */}
                {selectedType === "simulation" && groupedPractice.length > 0 && (
                    <VStack align="stretch" gap={4}>
                        {groupedPractice.map(p => (
                            <Box
                            key={p.recordId}
                            p={4}
                            borderWidth="1px"
                            borderRadius="md"
                            borderColor="gray.200"
                            bg="gray.50"
                            >
                                <VStack align="stretch" gap={2}>
                                    <Heading as="h2" size="sm">
                                        Simulation Attempt
                                    </Heading>

                                    <Text>
                                        Subjects: {p.subjects?.join(", ")}
                                    </Text>

                                    <Text>
                                        examType: {p.examType}
                                    </Text>

                                    <Text fontWeight="medium">
                                        Score: {p.score}
                                    </Text>

                                    <Text fontSize="sm" color="gray.600">
                                        Written on: {dateFormat(p.created_date!)}
                                    </Text>

                                    {p.created_date !== p.modified_date && (
                                        <Text fontSize="sm" color="gray.600">
                                            Rewritten on: {dateFormat(p.modified_date!)}
                                        </Text>
                                    )}

                                    <Button
                                    onClick={() =>
                                        navigate(`/randomPractice/${p.recordId}`)
                                    }
                                    colorScheme="blue"
                                    size="sm"
                                    alignSelf="flex-start"
                                    >
                                        Review Practice
                                    </Button>

                                </VStack>
                            </Box>
                        ))}

                    </VStack>
                )}

            </VStack>
        </Box>
    );
}