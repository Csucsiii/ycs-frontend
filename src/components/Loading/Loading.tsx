const Loading = () => {
    return (
        <div className="flex flex-col justify-center items-center w-full h-screen text-zinc-300 text-4xl font-semibold gap-4">
            <span className="animate-spin ease-in-out rounded-full h-15 w-15 border-6 border-zinc-300 border-t-transparent text-base-dark-green"></span>
            <div>Loading...</div>
        </div>
    );
};

export default Loading;
