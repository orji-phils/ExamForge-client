import z from "zod";
import { examTypeSchema, subjectSchema, yearSchema } from "./question.schema";

const scoreSchema = z.object({
    subject: subjectSchema
    .optional(),

    subjects: z.array(subjectSchema)
    .optional(),

    year: yearSchema
    .optional(),

    examType: examTypeSchema
    .optional(),

    score: z
    .coerce.number()
    .min(0, "Practice score can not be less than 0.")
    .max(100, "Practice score can not be grater than 100")
    .optional(),

    questionId: z
    .coerce.number()
    .min(1, "Question id cannot be less than 1.")
    .optional(),

    id: z
    .coerce.number()
    .min(1, "Practice id cannot be less than 1.")
    .optional(),

    recordId: z
    .coerce.number()
    .min(1, "Practice id cannot be less than 1.")
    .optional(),

    practiceId: z
    .coerce.number()
    .min(1, "Practice id cannot be less than 1.")
    .optional(),

    userAnswer: z
    .string()
    .trim()
    .optional(),

    correctAnswer: z
    .string()
    .trim()
    .optional(),

    created_date: z
    .coerce.date()
    .optional(),

    modified_date: z
    .coerce.date()
    .optional()
});

const multiScoreSchema = z.array(scoreSchema);

export type ScoreForm = z.infer<typeof scoreSchema>;
export type MultiScoreForm = z.infer<typeof multiScoreSchema>;

export { scoreSchema, multiScoreSchema };