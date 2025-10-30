import { useEffect, useState } from "react";
import { getSocket } from "../websocket/socket";

export const useSocket = () => {
    const [socket, setSocket] = useState(() => getSocket());

    useEffect(() => {
        setSocket(getSocket());
    }, []);

    return socket;
};
