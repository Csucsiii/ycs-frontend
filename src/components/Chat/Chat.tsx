import { useAuth } from "../../providers/AuthProvider";
import { withAuth } from "../hoc/withAuth";
import { useChat } from "../../providers/ChatProvider";
import Event from "./Event";
import MessageHandler from "./MessageHandler";
import { useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

const Chat = () => {
    const { messages, events } = useChat();
    const { user } = useAuth();

    const containerRef = useRef<HTMLDivElement | null>(null);

    const rowVirtualizer = useVirtualizer({
        count: messages.length,
        getScrollElement: () => containerRef.current,
        estimateSize: () => 80,
        overscan: 5
    });

    useEffect(() => {
        rowVirtualizer.scrollToIndex(messages.length - 1, { align: "end" });
    }, [messages.length]);


    return (
        <div className="flex flex-col items-center justify-center w-full h-screen min-screen">
            <div className="flex flex-col justify-center items-center lg:flex-row w-full h-screen max-h-screen gap-4 overflow-hidden p-4">
                <div className="flex flex-col justify-between w-1/3 liquid-glass bg-zinc-300/10 h-full rounded-md p-4">
                    <div className="flex flex-col h-[90vh] max-h-[90vh] w-full gap-2 overflow-auto">
                        {events.map((event, index) => {
                            return (
                                <div key={`events_key_${index}`} className="flex-none w-full">
                                    <Event event={event} />
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div
                    className="flex flex-col w-2/3 h-[90%] lg:h-full overflow-y-auto gap-2 liquid-glass bg-zinc-300/10 rounded-md"
                    ref={containerRef}
                >
                    <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: "100%", position: "relative" }}>
                        {
                            rowVirtualizer.getVirtualItems().map((virtualRow) => {
                                const msg = messages[virtualRow.index];

                                return (
                                    <div
                                        key={virtualRow.key}
                                        ref={rowVirtualizer.measureElement}
                                        data-index={virtualRow.index}
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            width: "100%",
                                            transform: `translateY(${virtualRow.start}px)`,
                                            paddingBottom: `8px`
                                        }}
                                    >
                                        <MessageHandler
                                            user={msg.user}
                                            platform={msg.platform}
                                            message={msg.message}
                                            color={msg.color}
                                            streamerName={user?.username}
                                            tags={msg.tags}
                                            createdAt={msg.createdAt}
                                        />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withAuth(Chat);
