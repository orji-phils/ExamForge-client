import { useEffect, useState } from "react";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const SOCKET_BASE_URL = import.meta.env.VITE_SOCKET_ADDRESS;

export const useLocalStorage = (key: string, defaultValue: any) => {
    const [value, setValue] = useState(() => {
        const currenteValue = localStorage.getItem(key);
        return currenteValue ? JSON.parse(currenteValue) : defaultValue;
    });

    useEffect(() => {
        localStorage.setItem(key,JSON.stringify(value) );
    }, [value]);

    return [value, setValue];
}