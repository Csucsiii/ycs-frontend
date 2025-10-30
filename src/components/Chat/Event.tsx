import { useEffect, useState } from "react";
import type { TwitchEvent } from "../../providers/ChatProvider";
import { formatTime } from "../../utils/utils";

const titles: Record<string, string> = {
    cheer: "Cheer",
    sub: "Feliratkozás",
    resub: "Feliratkozás",
    subgift: "Subgift   "
};

const Event = ({ event }: { event: TwitchEvent }) => {
    const [visible, setVisible] = useState<boolean>(false);

    useEffect(() => {
        setVisible(true);
    }, []);

    return (
        <div
            className={`transform transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"} flex flex-col gap-2 text-md rounded text-zinc-100 bg-zinc-700/10 shadow-lg overflow-hidden liquid-glass p-4`}
        >
            <div className="flex flex-col  w-full h-full">
                <div className="flex items-end w-full gap-4 text-zinc-300">
                    <span className="text-green-500 font-bold">Kick</span>
                    <span>{event.username}</span>
                    <span className="text-zinc-400 text-sm">{titles[event.type] ?? "Új értesítés!"} {event.type === "cheer" && event.bits? `x ${event.bits}`: ""}</span>
                </div>

                {event.type === "cheer" && (
                    <p className="flex flex-col w-full my-2">
                        {event.message && (
                            <div className="flex gap-2">
                                <span className="font-bold">Üzenet:</span>
                                <span>{event.message}</span>
                            </div>
                        )}
                    </p>
                )}

                {event.type === "sub" && (
                    <p className="flex flex-col my-2">
                        {event.message && `Üzenet: "${event.message}"`}
                    </p>
                )}

                {event.type === "resub" && (
                    <p className="p-4 my-2">
                        <strong>{event.username}</strong> újra feliratkozott ({event.months} hónap)!
                        {event.message && `Üzenet: "${event.message}"`}
                    </p>
                )}

                {event.type === "subgift" && (
                    <p className="my-2">
                        <strong>{event.username}</strong> adott egy subgiftet!
                        <ul className="ml-4 text-left list-decimal grid grid-cols-2 p-3">
                            {[...new Set(event.recipients)].map((r) => (
                                <li className="font-semibold text-zinc-300" key={r}>{r}</li>
                            ))}
                        </ul>
                    </p>
                )}

                <div className="text-[0.6rem] text-zinc-300 italic">{formatTime(new Date())}</div>
            </div>
        </div>
    );
};

export default Event;
