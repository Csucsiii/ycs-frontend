import { type SubmitHandler, useForm } from "react-hook-form";
import SettingsCard from "./SettingsCard";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loading from "../Loading/Loading";

const settings = [
    {
        platform: "twitch",
        title: "Twitch Settings",
        color: "text-purple-500",
        fields: [
            { label: "Channel", name: "channel", placeholder: "Channel Name..." }, 
            { label: "Client ID", name: "clientId", placeholder: "Client ID..." },
            { label: "Client Secret", name: "secret", placeholder: "Client Secret..." }
        ]
    },
    {
        platform: "kick",
        title: "Kick Settings",
        color: "text-green-500",
        fields: [
            { label: "Channel Name", name: "channelSlug", placeholder: "Channel Name.." },
            { label: "Client ID", name: "clientId", placeholder: "Client ID..." },
            { label: "Client Secret", name: "secret", placeholder: "Client Secret..." }
        ]
    },
    {
        platform: "youtube",
        title: "Youtube Settings",
        color: "text-rose-500",
        fields: [
            { label: "Channel ID", name: "channelId", placeholder: "Channel ID..." },
            { label: "API Key", name: "apiKey", placeholder: "API Key..." }
        ]
    }
];

export type FormData = {
    twitch: {
        channel: string;
    };
    kick: {
        channelSlug: "";
        clientId: string;
        secret: string;
    };
    youtube: {
        channelId: string;
        apiKey: string;
    };
};

const Settings = () => {
    const { register, handleSubmit, reset } = useForm<FormData>({
        defaultValues: {
            twitch: { channel: "" },
            kick: { channelSlug: "", clientId: "", secret: "" },
            youtube: { channelId: "", apiKey: "" }
        }
    });

    const [saveState, setSaveState] = useState<"idle" | "loading" | "error">("idle");
    const [settingsState, setSettingsState] = useState<"idle" | "loading" | "error">("idle")

    const onSubmit: SubmitHandler<FormData> = (data) => {
        const mapped: any = {};
        for (const platform of Object.keys(data) as (keyof typeof data)[]) {
            const object = data[platform];

            if ("channel" in object) {
                mapped[platform] = {
                    channel: object.channel
                };
            }

            if ("channelSlug" in object && "clientId" in object && "secret" in object) {
                mapped[platform] = {
                    channelSlug: object.channelSlug,
                    auth: {
                        clientId: object.clientId,
                        secret: object.secret
                    }
                };
            }

            if ("apiKey" in object) {
                mapped[platform] = {
                    channelId: object.channelId,
                    auth: {
                        apiKey: object.apiKey
                    }
                };
            }
        }

        console.log("request data", mapped);
        setSaveState("loading");

        fetch("http://localhost:3000/api/v1/dashboard/config", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(mapped)
        })
            .then((res) => {
                if (!res.ok) {
                    console.log(res);
                    toast.error("Couldn't save config.", {
                        theme: "dark",
                        position: "top-right"
                    });
                    throw Error("Couldn't save config.");
                }

                return;
            })
            .then((res) => {
                console.log(res);
                toast.success("Successfully saved config.", {
                    theme: "dark",
                    position: "top-right"
                });
            })
            .catch((err) => console.error(err))
            .finally(() => setSaveState("idle"));
    };

    useEffect(() => {
        setSettingsState("loading");
        fetch("http://localhost:3000/api/v1/dashboard/config", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        })
            .then((res) => res.json())
            .then((data) => {
                const newData: any = {};
                for (const key in data) {
                    const { auth, ...rest } = data[key];
                    newData[key] = { ...rest, ...(auth || {}) };
                }

                console.log("newdata", newData);
                reset(newData);
            })
            .catch((err) => console.error(err))
            .finally(() => setSettingsState("idle"));
    }, []);

    if (settingsState === "loading") {
        return <Loading />
    }

    return (
        <form className="flex flex-col w-full h-full" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-3 w-full px-4 gap-6 justify-items-center h-[90%]">
                {settings.map((s) => (
                    <SettingsCard
                        key={s.title}
                        color={s.color}
                        fields={s.fields}
                        title={s.title}
                        platform={s.platform as keyof FormData}
                        register={register}
                    />
                ))}
            </div>
            <div className="flex justify-center items-center w-full h-[10%]">
                <button
                    type="submit"
                    className="text-base-greener text-xl bg-base-lime duration-300 hover:bg-base-green focus:outline-none font-semibold rounded-lg px-14 py-2 me-2 mb-2 cursor-pointer"
                >
                    {saveState === "loading" ? (
                        <span className="animate-spin rounded-full h-6 w-6 aspect-square border-2 border-base-dark-green border-t-transparent text-base-dark-green"></span>
                    ) : (
                        "Mentés"
                    )}
                </button>
            </div>
        </form>
    );
};

export default Settings;
