import { useEffect, useState } from "react";
import { socket } from "../socket";

type ActiveUsers = {
    admins: number;
    masters: number;
    users: number;
    total: number;
}

export const useActiveUser = () => {
    const [data, setData] = useState<ActiveUsers | null>(null);

    useEffect(() => {
        socket.on("activeUsers", (stats: ActiveUsers) => {
            setData(stats);
        });

        return() => {
            socket.off("activeUsers");
        };
    }, []);

    return data;
};