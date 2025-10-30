import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./providers/AuthProvider.tsx";
import { Route, Routes, BrowserRouter as Router, Navigate } from "react-router";
import Login from "./components/Login/Login.tsx";
import Chat from "./components/Chat/Chat";
import { ToastContainer } from "react-toastify";
import { ChatProvider } from "./providers/ChatProvider.tsx";
import DashboardRoot from "./components/Dashboard/DashboardRoot.tsx";
import Settings from "./components/Dashboard/Settings.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Router>
            <AuthProvider>
                <ChatProvider>
                    <Routes>
                        <Route path="/dashboard" element={<DashboardRoot />}>
                            <Route index element={<Settings />} />
                            <Route path="chat" element={<Chat />} />
                        </Route>
                        <Route path="/login" element={<Login />} />
                        <Route path="/*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </ChatProvider>
            </AuthProvider>
            <ToastContainer />
        </Router>
    </StrictMode>
);
