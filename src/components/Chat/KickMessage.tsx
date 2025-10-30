import { formatTime } from "../../utils/utils";
import GeneralMessage from "./GeneralMessage";

export type KickMessageProps = {
    user: string;
    message: string;
    createdAt: Date;
    color?: string;
    streamerName: string | undefined;
};

const formatKickMessage = (m: string) => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    const regex = /\[emote:(\d+):([^\]]+)\]/g;
    const urlRegex = /https?:\/\/[^\s<>]+[^\s.,!?;:<>]?/gi;

    const combinedRegex = new RegExp(`${regex.source}|${urlRegex.source}`, "g");

    let match;

    while ((match = combinedRegex.exec(m)) !== null) {
        const start = match.index;

        if (start > lastIndex) {
            parts.push(m.substring(lastIndex, start));
        }

        if (match[1] && match[2]) {
            const [_, emoteId, emoteName] = match;
            const emoteUrl = `https://files.kick.com/emotes/${emoteId}/fullsize`;
            parts.push(
                <img key={`${emoteId}-${start}`} src={emoteUrl} alt={emoteName} className="inline w-6 h-6 mx-0.5" />
            );
        } else if (match[0].startsWith("http")) {
            const url = match[0];
            parts.push(
                <a
                    key={`link-${start}`}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                >
                    {url}
                </a>
            );
        }
        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < m.length) {
        parts.push(m.substring(lastIndex));
    }

    return parts;
};

const KickMessage = ({ user, message, createdAt, color, streamerName }: KickMessageProps) => {
    return (
        <GeneralMessage
            user={user}
            userLink={`https://kick.com/${user}`}
            platform="kick"
            message={message}
            messageNode={formatKickMessage(message)}
            color={color}
            streamerName={streamerName}
            createdAt={formatTime(createdAt)}
        />
    );
};

export default KickMessage;
