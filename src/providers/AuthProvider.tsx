import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { disconnectSocket } from "../websocket/socket";

type User = {
    id: string;
    username: string;
    createdAt: Date;
} | null;

type AuthContextType = {
    user: User;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const login = useCallback(async (username: string, password: string) => {
        const res = await fetch("http://localhost:3000/api/v1/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ username, password })
        });

        if (!res.ok) throw new Error("Login Failed");

        const data = await res.json();

        setUser(data.user);
    }, []);

    const logout = useCallback(async () => {
        await fetch("http://localhost:3000/api/v1/auth/logout", {
            method: "POST",
            credentials: "include"
        });

        setUser(null);
        disconnectSocket();
    }, []);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/v1/auth/me", {
                    credentials: "include"
                });

                if (!res.ok) return setUser(null);

                const data = await res.json();

                setUser(data.user);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");

    return ctx;
};
