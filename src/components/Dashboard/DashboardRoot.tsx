import { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { withAuth } from "../hoc/withAuth";
import ChannelDetails from "./ChannelDetails";
import { Icon } from "@iconify/react";

const DashboardRoot = () => {
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleControlButton = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch("http://localhost:3000/api/v1/dashboard/bots/control", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });

            if (!res.ok) return;

            const data = await res.json();

            setIsRunning(data.status);

            toast.success(`Successfully ${data.status ? "started" : "stopped"} the bots!`, {
                theme: "dark",
                position: "top-right"
            });
        } catch (err) {
            console.error("error during starting/stopping bot", err);
            toast.error("Something went wrong with handling the bots", {
                theme: "dark",
                position: "top-right"
            });
        } finally {
            setLoading(false);
        }
    }, []);

    const handleLogout = useCallback(async () => {
        try {
            await fetch("http://localhost:3000/api/v1/auth/logout", {
                method: "POST",
                credentials: "include"
            });
        } catch (err) {
            console.error(err);
        } finally {
            navigate("/login");
        }
    }, [])

    const handleKickConnect = useCallback(async () => {
        const width = 600;
        const height = 700;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const popup = window.open(
            "http://localhost:3000/api/v1/kick/auth",
            "kickAuth",
            `width=${width},height=${height},left=${left},top=${top}`
        );

        const interval = setInterval(() => {
            if (popup?.closed) {
                clearInterval(interval);

                window.dispatchEvent(new Event("kick-connected"));
            }
        }, 500);
    }, []);

    const handleTwitchConnect = useCallback(async () => {
        const width = 600;
        const height = 700;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const popup = window.open(
            "http://localhost:3000/api/v1/twitch/auth",
            "twitchAuth",
            `width=${width},height=${height},left=${left},top=${top}`
        );

        const interval = setInterval(() => {
            if (popup?.closed){
                clearInterval(interval);

                window.dispatchEvent(new Event("twitch-connected"));
            }
        }, 500);
    }, []);

    useEffect(() => {
        fetch("http://localhost:3000/api/v1/dashboard/bots/status", {
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        })
            .then((res) => res.json())
            .then((data) => {
                setIsRunning(data.status);
            });
    }, []);

    return (
        <div className="flex flex-col w-full h-screen max-h-screen overflow-auto gap-4">
            <div className="flex w-full h-full">
                <div className="flex flex-col items-center w-1/6 h-full bg-zinc-300/10 text-base-lime p-4 py-8 gap-2">
                    <div className="text-2xl font-semibold h-[10vh]">Welcome, in Yappers Club</div>
                    <div className="flex flex-col justify-between items-center w-full h-full gap-4">
                        <div className="flex flex-col justify-between w-full h-full">
                            <div className="flex flex-col w-full">
                                <button
                                    type="button"
                                    className={`text-zinc-100 text-md duration-300 hover:bg-zinc-400 hover:text-zinc-800 focus:outline-none font-semibold rounded-lg px-5 py-2 me-2 mb-2 cursor-pointer w-full liquid-glass ${location.pathname === "/dashboard/chat" ? "bg-zinc-100 text-zinc-800" : "bg-zinc-300/10"}`}
                                    onClick={() => navigate("/dashboard/chat")}
                                >
                                    Chat
                                </button>
                                <button
                                    type="button"
                                    className={`text-zinc-100 text-md  duration-300 hover:bg-zinc-400 hover:text-zinc-800 focus:outline-none font-semibold rounded-lg px-5 py-2 me-2 mb-2 cursor-pointer w-full liquid-glass ${location.pathname === "/dashboard" ? "bg-zinc-100 text-zinc-800" : "bg-zinc-300/10"}`}
                                    onClick={() => navigate("/dashboard")}
                                >
                                    Settings
                                </button>
                            </div>
                            {/* <ChannelDetails isRunning={isRunning}/> */}
                        </div>
                        <div className="flex flex-col items-center w-full">
                            <button className="text-zinc-800 text-md duration-300 liquid-glass enabled:bg-base-lime enabled:hover:bg-green-700 focus:outline-none font-semibold rounded-lg px-5 py-2 me-2 mb-2 cursor-pointer w-full flex items-center justify-center disabled:cursor-not-allowed gap-2" onClick={handleKickConnect}>
                                <span>
                                    <Icon icon="ri:kick-fill" width="1.5rem" height="1.5rem" />
                                </span>
                                Connect Kick
                            </button>
                            {/* <button className="text-zinc-200 text-md duration-300 liquid-glass enabled:bg-purple-600 enabled:hover:bg-green-700 focus:outline-none font-semibold rounded-lg px-5 py-2 me-2 mb-2 cursor-pointer w-full flex items-center justify-center disabled:cursor-not-allowed gap-2" onClick={handleTwitchConnect}>
                                <span>
                                    <Icon icon="mdi:twitch" width="1.5rem" height="1.5rem" className="text-zinc-200"/>
                                </span>
                                Connect Twitch
                            </button> */}
                            <button
                                type="button"
                                className="text-zinc-800 text-md duration-300 liquid-glass enabled:bg-zinc-100 enabled:hover:bg-zinc-400 focus:outline-none font-semibold rounded-lg px-5 py-2 me-2 mb-2 cursor-pointer w-full flex items-center justify-center disabled:cursor-not-allowed"
                                onClick={handleControlButton}
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="animate-spin rounded-full h-6 w-6 aspect-square border-2 border-white border-t-transparent text-base-dark-green"></span>
                                ) : isRunning ? (
                                    <>
                                        <span>Stop Bots</span>
                                    </>

                                ) : (
                                    <span>Start Bots</span>
                                )}
                            </button>
                            <button
                                type="button"
                                className="text-zinc-100 text-md bg-rose-800 duration-300 hover:bg-rose-500 focus:outline-none font-semibold rounded-lg px-5 py-2 me-2 mb-2 cursor-pointer w-full"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
                <div className="w-5/6 h-full">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};


export default withAuth(DashboardRoot);