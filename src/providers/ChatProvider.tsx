import { createContext, useContext, useEffect, useRef, useState } from "react";
import { connectSocket } from "../websocket/socket";
import { useAuth } from "./AuthProvider";

export type TwitchEvent =
    | { type: "cheer"; username: string; bits: number; message: string }
    | { type: "sub"; username: string; message?: string }
    | { type: "resub"; username: string; months: number; message?: string }
    | { type: "subgift"; username: string; recipients: string[]; anonymous?: boolean };

export type ChatMessage = {
    id: string;
    user: string;
    platform: string;
    message: string;
    color?: string;
    createdAt: Date;
    tags?: any;
};

type ChatContextType = {
    messages: ChatMessage[];
    events: TwitchEvent[];
};

type SocketMessage = {
    data: {
        user: string;
        platform: string;
        message: string;
        color?: string;
        createdAt: Date;
        tags?: any;
    };
};

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [events, setEvents] = useState<TwitchEvent[]>([]);

    const msgBufferRef = useRef<ChatMessage[]>([]);

    useEffect(() => {
        if (!user) return;

        const socket = connectSocket();
        const handleTwitchSocketMessage = (data: SocketMessage) => {
            const { user, platform, message, createdAt, color, tags } = data.data;

            const newMessage: ChatMessage = {
                id: `${Date.now()}-${Math.random()}`,
                user,
                platform,
                message,
                color,
                createdAt: createdAt ? new Date(createdAt) : new Date(),
                tags: tags
            };

            msgBufferRef.current.push(newMessage);

            if (msgBufferRef.current.length > 1000) {
                msgBufferRef.current.splice(0, msgBufferRef.current.length - 1000);
            }
        };

        const handleTwitchSocketSubEvent = (response: { data: TwitchEvent[] }) => {
            const eventsArray = Array.isArray(response.data) ? response.data : [response.data];

            setEvents((prev) => {
                let newList = [...prev];

                for (const event of eventsArray) {
                    newList = [...newList, event];
                }

                return newList.slice(-100);
            });
        };

        socket.on("chat_message", handleTwitchSocketMessage);
        socket.on("subscription_events", handleTwitchSocketSubEvent);

        const interval = setInterval(() => {
            if (msgBufferRef.current.length > 0) {
                setMessages((prev) => {
                    const updated = [...prev, ...msgBufferRef.current];
                    msgBufferRef.current = [];

                    return updated.slice(-300);
                });
            }
        }, 200);

        return () => {
            clearInterval(interval);
            socket.off("chat_message", handleTwitchSocketMessage);
            socket.off("subscription_events", handleTwitchSocketSubEvent);
        };
    }, [user]);

    return <ChatContext.Provider value={{ messages, events }}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
    const ctx = useContext(ChatContext);
    if (!ctx) throw new Error("useChat must be used inside ChatProvider!");

    return ctx;
};
