export type GeneralMessageProps = {
    user: string;
    userLink: string;
    message: string;
    messageNode: React.ReactNode;
    platform: string;
    createdAt: string;
    streamerName?: string;
    color?: string;
};

const GeneralMessage = ({
    user,
    userLink,
    message,
    messageNode,
    platform,
    createdAt,
    color,
    streamerName
}: GeneralMessageProps) => {
    return (
        <div
            className={`flex flex-col  text-lg p-2  mx-3 rounded ${message.toLocaleUpperCase("hu").includes(streamerName?.toLocaleUpperCase("hu")!) ? "bg-red-900" : "liquid-glass bg-zinc-500/10"} text-zinc-200`}
        >
            <div className="flex items-center gap-4 mb-2">
                <img src={`/${platform}.webp`} alt="" className="h-5 rounded-md" />
                <a
                    href={userLink}
                    style={{ color: color || "#fff", textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)' }}
                    className="font-semibold text-shadow-2xl cursor-pointer"
                    target="_blank"
                >
                    {user}
                </a>
            </div>
            <div className="flex items-center">
                <div>{messageNode}</div>
            </div>
            <div className="italic text-xs text-zinc-300 mt-4 text-[0.6rem]">{createdAt}</div>
        </div>
    );
};

export default GeneralMessage;
