export const processLinks = (text: string) => {
    const subParts: React.ReactNode[] = [];
    let lastSubIndex = 0;
    let match;
    const urlRegex = /https?:\/\/[^\s<>]+[^\s.,!?;:<>]?/gi;
    while ((match = urlRegex.exec(text)) !== null) {
        const start = match.index;
        const url = match[0];

        if (start > lastSubIndex) subParts.push(text.substring(lastSubIndex, start));

        subParts.push(
            <a
                key={`link-${start}-${Math.random()}`}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
            >
                {url}
            </a>
        );

        lastSubIndex = start + url.length;
    }

    if (lastSubIndex < text.length) subParts.push(text.substring(lastSubIndex));
    return subParts;
};

export const formatTime = (time: Date): string => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const formattedTime = new Intl.DateTimeFormat("hu-HU", {
        timeZone: userTimeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    }).format(time);

    return formattedTime;
};
