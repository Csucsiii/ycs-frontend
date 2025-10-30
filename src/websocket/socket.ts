import { io, Socket } from "socket.io-client";

const URL = "http://localhost:3000";

let socket: Socket | null = null;

export const connectSocket = (): Socket => {
    if (socket) return socket;

    socket = io(URL, {
        autoConnect: true,
        withCredentials: true
    });

    return socket;
};

export const getSocket = (): Socket | null => socket;
export const disconnectSocket = (): void => {
    if (!socket) return;

    socket.disconnect();
    socket = null;
};
