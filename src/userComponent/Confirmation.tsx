import { Button, Dialog, Portal } from "@chakra-ui/react";

type ConfirmationProps = {
    title: string;
    content: string;
    buttonLabel: string;
    isOpen: boolean;
    handleFunction: () => void;
};

export const Confirmation = ({title, content, buttonLabel, isOpen, handleFunction }: ConfirmationProps) => {

    return (
        <Dialog.Root  lazyMount open={isOpen} closeOnEscape={true}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>{title}</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>{content}</Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant={"outline"}>Cancel</Button>
                            </Dialog.ActionTrigger>
                            <Button onClick={handleFunction}>{buttonLabel}</Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}