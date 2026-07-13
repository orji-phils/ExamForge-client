import { useState } from "react"

type ConfirmState = {
    title: string;
    content: string;
    buttonLabel: string;
    isOpen: boolean;
    handleFunction: (userId: number, userName: string) => void;
};

export function useConfirmation () {
    const [dialog, setDialog] = useState<ConfirmState>();

    const confirmAction = ({
        title, 
        content, 
        buttonLabel, 
        isOpen, 
        handleFunction
    }: ConfirmState) => {
        setDialog({title, content, buttonLabel, isOpen, handleFunction});
    }

    return { dialog, confirmAction};
}   