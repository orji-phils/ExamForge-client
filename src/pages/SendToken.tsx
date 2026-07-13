import { Box, Button, Field, Flex, Heading, Input, Text, VStack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { userSchema, type UserForm } from "../userComponent/schemas/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTitle } from "../context/TitleContext";
import type z from "zod";

export const SendToken = ({ 
    goal, 
    heading,
    instruction,
    action 
}: { 
    goal: string; 
    heading: string; 
    instruction: string; 
    action: (value: UserForm) => void; 
}) => {
    const { handleSubmit, register,
        formState: { errors } 
     } = useForm<
     z.input<typeof userSchema>,
     any,
     z.output<typeof userSchema>
     >({
        resolver: zodResolver(userSchema)
     });
     useTitle(`${heading} - ExamForge`);

    return (
        <Flex
        minH="100vh"
        align="center"
        justify="center"
        bg="gray.50"
        px={4}
        >
            <Box
            w="100%"
            maxW="450px"
            bg="white"
            p={{ base: 6, md: 8 }}
            borderRadius="lg"
            boxShadow="lg"
            >
                <VStack align="stretch" gap={6}>

                    {/* Header */}
                    <Box>
                        <Heading as="h1" size="lg">
                            {heading}
                        </Heading>

                        <Text mt={2} fontSize="sm" color="gray.600">
                            {instruction}
                        </Text>
                    </Box>

                    {/* Divider */}
                    <Box borderTop="1px solid" borderColor="gray.200" />

                    {/* Form */}
                    <form onSubmit={handleSubmit(action)}>
                        <VStack align="stretch" gap={5}>
                            <Field.Root invalid={!!errors.email}>
                                <VStack align="stretch" gap={2}>
                                    <label htmlFor="email">
                                        <Text fontWeight="medium">
                                            Email Address
                                        </Text>
                                    </label>

                                    <Input
                                    type="email"
                                    placeholder="Enter your email address"
                                    id="email"
                                    autoComplete="email"
                                    {...register("email", {
                                        required: "Sorry! Your email address is required"
                                    })}
                                    />

                                    <Field.ErrorText>
                                        {errors.email?.message}
                                    </Field.ErrorText>
                                </VStack>
                            </Field.Root>

                            <Button
                            type="submit"
                            colorScheme="blue"
                            >
                                Send {goal} Token
                            </Button>

                        </VStack>
                    </form>

                </VStack>
            </Box>
        </Flex>
    );
}