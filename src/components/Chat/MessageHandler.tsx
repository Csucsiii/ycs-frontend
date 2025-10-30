import KickMessage from "./KickMessage";
import TwitchMessage from "./TwitchMessage";

export type MessageHandlerProps = {
    user: string;
    message: string;
    platform: string;
    createdAt: Date;
    color?: string;
    streamerName?: string;
    tags?: any;
};

const MessageHandler = ({ user, message, platform, createdAt, color, streamerName, tags }: MessageHandlerProps) => {
    switch (platform) {
        case "twitch":
            return (
                <TwitchMessage
                    user={user}
                    message={message}
                    createdAt={createdAt}
                    color={color}
                    streamerName={streamerName}
                    tags={tags}
                />
            );
        case "kick":
            return (
                <KickMessage
                    user={user}
                    message={message}
                    createdAt={createdAt}
                    color={color}
                    streamerName={streamerName}
                />
            );
        default:
            return;
    }
};

export default MessageHandler;
