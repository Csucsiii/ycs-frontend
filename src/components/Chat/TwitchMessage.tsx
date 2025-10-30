import { processLinks, formatTime } from "../../utils/utils";
import GeneralMessage from "./GeneralMessage";

export type TwitchMessageProps = {
    user: string;
    message: string;
    createdAt: Date;
    color?: string;
    streamerName: string | undefined;
    tags?: any;
};

const formatTwitchMessage = (m: string, tags: any) => {
    if (!tags || !tags.emotes) return [processLinks(m)];
    const emotePositions: { start: number; end: number; id: string }[] = [];
    for (const [emoteId, positions] of Object.entries(tags.emotes) as [string, string[]][]) {
        for (const pos of positions) {
            const [start, end] = pos.split("-").map(Number);
            emotePositions.push({ start, end, id: emoteId });
        }
    }

    emotePositions.sort((a, b) => a.start - b.start);

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    for (const { start, end, id } of emotePositions) {
        const textBefore = m.substring(lastIndex, start);
        if (textBefore) parts.push(...processLinks(textBefore));

        const emoteText = m.substring(start, end + 1);
        const emoteUrl = `https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/1.0`;

        parts.push(<img key={`${id}-${start}`} src={emoteUrl} alt={emoteText} className="inline w-6 h-6 mx-0.5" />);

        lastIndex = end + 1;
    }

    if (lastIndex < m.length) {
        parts.push(...processLinks(m.substring(lastIndex)));
    }

    return parts;
};

const TwitchMessage = ({ user, message, createdAt, color, streamerName, tags }: TwitchMessageProps) => {
    return (
        <GeneralMessage
            user={user}
            userLink={`https://twitch.tv/${user}`}
            platform="twitch"
            message={message}
            messageNode={formatTwitchMessage(message, tags)}
            color={color}
            streamerName={streamerName}
            createdAt={formatTime(createdAt)}
        />
    );
};

export default TwitchMessage;
