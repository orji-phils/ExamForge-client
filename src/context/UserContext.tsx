import { createContext, useContext, type ReactNode } from "react";
import { useLocalStorage } from "../util";
import { type UserForm } from "../userComponent/schemas/user.schema";

type UserContextType = {
    user: UserForm | null;
    updateUser: (user: UserForm | null) => void;
};

type Props = {
    children: ReactNode;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: Props) => {
    const [user, setUser] = useLocalStorage("ExamForge_token", null);

    const updateUser = (user: UserForm | null) => {
        setUser(user);
    };

    const value = { user, updateUser };

    return (
        <UserContext.Provider value={value}>{children}</UserContext.Provider>
    );
}

export const useUser =  () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("UseUser must be used within a UserProvider.");
    }
    return context;
}