export type Users = {
    id: number;
    profilePicture?: string;
    userName: string;
    email: string;
    role: string;
    created_date?: string;
    modified_date?: string;
}

// user profile type
export type UserProfile = {
    id: number;
    role?: string;
    bankName?: string;
    accountNumber?: number;
    created_date?: string;
    modified_date?: string;
    firstName: string;
    lastName: string;
    userName: string;
    dateOfBirth: string;
    profilePicture: string | File;
    phoneNumber: number;
    email: string;
    bio: string;
};

// pastquestion type
export type PastQuestion = {
    id: number;
    year: number;
    questionNumber: number;
    question: string;
    options: { [option: string]: string };
    correctAnswer: string;
    subject: string;
    examType: string;
    content: string;
    questionFile: FileList;
};

export type Subject = {
    [Tables_in_jambDB   : string]: string;
}

// type for practice types
export type PracticeType = {
    id?: number;
    questionId: number;
    year: number;
    recordId?: number;
    userId?: number;
    score?: number;
    subject?: string;
    subjects?: string[];
    examType: string;
    userAnswer: string;
    correctAnswer: string;
    created_date?: string;
    modified_date?: string;
};

// Upgrade request type
export type UpgradeRequest = {
    userId: number;
    userName: string;
    email: string;
    role?: "admin" | "master" | "user";
    created_date: string;
    request_date: string;
    response_date?: string;
    profilePicture: string;
    status: string;
}

// activities type
export type Activity = {
  id: number;
  description: string;
  created_date: string;
};
