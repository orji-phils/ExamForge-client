import z from "zod";
import { ZodIssueCode } from "zod/v3";

const currentYear = new Date().getFullYear();
const max_size = 5 * 1024 * 1024;
const allowedTypes = [".docx", ".pdf"];

const examTypeSchema = z
.enum(["", "jamb", "waec", "neco"]);

const subjectSchema =  z
.enum(["", "accounting", "biology", "chemistry", "computer", "dataprocessing", "economics", "english", "government", "literature", "mathematics", "physics"]);

const yearSchema = z
.coerce.number()
.min(1970, "Question year cannot be less than 1970.")
.max(currentYear, `Question year cannot be greater than ${currentYear}.`);

const uploadQuestionSchema = z.object({
    examType: examTypeSchema
    .optional(),

    subject: subjectSchema
    .optional(),

    year: yearSchema
    .optional(),

    question: z
    .string()
    .trim()
    .optional(),

    questionFile: z
    .custom<FileList>()
    .optional()
    .refine(
        (files) => !files ||
        files.length === 0 ||
        files[0].size <= max_size,
        "File size can not exceed 5MB."
    )
    .refine(
        (files) => !files ||
        files.length === 0 ||
        !allowedTypes.includes(files[0].type),
        "Only PDF and DOCX files are allowed."
    )
}).superRefine((data, ctx) => {
    const hasQuestion = data.question?.trim();
    const hasFile = !!data.questionFile && data.questionFile.length > 0;

    if (!hasQuestion && !hasFile) {
        ctx.addIssue({
            code: ZodIssueCode.custom,
            message: "Please paste or type question content, or upload question file.",
            path: ["question"]
        });

        ctx.addIssue({
            code: ZodIssueCode.custom,
            message: "Please paste or type question content, or upload question file.",
            path: ["questionFile"]
        });
    }
});

const deleteQuestionSchema = z.object({
    examType: examTypeSchema
    .optional(),

    subject: subjectSchema
    .optional(),

    year: yearSchema
    .optional()
});

const questionSchema = z.object({
    id: z
    .number()
    .min(1)
    .optional(),

    questionNumber: z
    .number()
    .min(1, "Question number cannot be less than 1.")
    .optional(),

    question: z
    .string()
    .trim(),

    options: z
    .json(),

    correctAnswer: z
    .string()
    .trim(),

    year: yearSchema,

    subject: subjectSchema
    .optional(),

    examType: examTypeSchema
    .optional()
});

const multiExamTypeSchema = z.array(examTypeSchema);
const multiSubjectSchema = z.array(subjectSchema);
const multiYearSchema = z.array(yearSchema);
const multiQuestionSchema = z.array(questionSchema);

export type ExamForm = z.infer<typeof examTypeSchema>;
export type MultiExamForm = z.infer<typeof multiExamTypeSchema>;
export type SubjectForm = z.infer<typeof subjectSchema>;
export type MultiSubjectForm = z.infer<typeof multiSubjectSchema>;
export type YearForm = z.infer<typeof yearSchema>;
export type MultiYearForm = z.infer<typeof multiYearSchema>;
export type QuestionForm = z.infer<typeof questionSchema>;
export type MultiQuestionForm = z.infer<typeof multiQuestionSchema>;
export type UploadQuestionForm = z.output<typeof uploadQuestionSchema>;
export type DeleteQuestionForm = z.infer<typeof deleteQuestionSchema>;

export { examTypeSchema, multiExamTypeSchema, subjectSchema, multiSubjectSchema, yearSchema, multiYearSchema, uploadQuestionSchema, deleteQuestionSchema, questionSchema, multiQuestionSchema };