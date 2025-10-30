import { useEffect, useState } from "react";

type ChannelData = {
    category: {
        id: number;
        name: string;
    },
    stream: {
        isLive: boolean;
        viewCount: number;
        title: string;
    }
}

type ChannelsResponse = {
    data: {
        kick: ChannelData,
        twitch: ChannelData
    }
}

const ChannelDetails = ({ isRunning }: { isRunning: boolean }) => {
    const [kickData, setKickData] = useState<ChannelData | null>(null);
    const [twitchData, setTwitchData] = useState<ChannelData | null> (null);

    useEffect(() => {
        const interval = setInterval(async () => {
            if (isRunning) {
                const res = await fetch("http://localhost:3000/api/v1/channels", {
                    method: "GET",
                    credentials: "include"
                });

                if (!res.ok) return;

                const data: ChannelsResponse = await res.json();

                setKickData(data.data.kick);
                setTwitchData(data.data.twitch);
            }
        }, 1 * 60 * 1000);

        return () => clearInterval(interval)
    }, [isRunning]);

    return (
        <div className="flex flex-col w-full gap-2">
            <div className="flex flex-col liquid-glass bg-zinc-300/10 p-2 rounded-md text-zinc-400 gap-2">
                <div className="text-green-500 text-lg font-semibold">Kick</div>
                <div className="flex items-center w-full gap-4">
                    <span className={`w-2 h-2 rounded-full ${kickData?.stream.isLive ? "bg-red-500 animate-pulse" : "bg-zinc-900"}`}></span>
                    <div>{kickData?.stream.isLive ? kickData.stream.viewCount : "Offline"}</div>
                </div>
                <div className="italic text-sm">{kickData?.category.name ?? "None"}</div>
            </div>
            <div className="flex flex-col liquid-glass bg-zinc-300/10 p-2 rounded-md text-zinc-400 gap-2">
                <div className="text-purple-500 text-lg font-semibold">Twitch</div>
                <div className="flex items-center w-full gap-4">
                    <span className={`w-2 h-2 rounded-full ${twitchData?.stream.isLive? "bg-red-500 animate-pulse": "bg-zinc-900"}`}></span>
                    <div>{twitchData?.stream.isLive? twitchData.stream.viewCount: "Offline"}</div>
                </div>
                <div className="italic text-sm">{twitchData?.category.name ?? "None"}</div>
            </div>
        </div>
    );
};


export default ChannelDetails;