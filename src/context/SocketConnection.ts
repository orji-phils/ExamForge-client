import { useEffect } from "react";
import { useUser } from "./UserContext"
import { socket } from "../socket";

export const SocketConnection = () => {
    const { user } = useUser();

    useEffect(() => {
        if (!user) return;

        socket.auth = {
            userId: user?.id,
            role: user?.role
        };

        socket.connect();

        return () => {
            socket.disconnect();
        }
    }, [user]);

    return null;
}