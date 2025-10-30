import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { useAuth } from "../../providers/AuthProvider";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

type Inputs = {
    username: string;
    password: string;
};

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<Inputs>();
    const { login, user } = useAuth();
    const navigate = useNavigate();

    if (user) {
        navigate("/dashboard");
        return;
    }

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            await login(data.username, data.password);
            navigate("/dashboard");
        } catch (err: any) {
            toast.error(err.message ?? "Login failed", {
                theme: "dark",
                position: "top-right"
            });
        }
    };

    return (
        <div className="flex flex-col w-full h-screen max-h-screen">
            <div className="flex items-center w-full h-[8vh] max-h-[8vh] text-base-lime p-4">
                <h1 className="text-4xl font-bold">YCS</h1>
            </div>
            <div className="flex justify-center items-center w-full h-[92vh] max-h-[92vh] gap-2">
                <form
                    className="flex flex-col w-full max-w-md liquid-glass bg-zinc-300/10 rounded-lg p-4 gap-4 shadow-lg text-zinc-200"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <h1 className="text-3xl my-4 font-bold text-center">Login</h1>
                    <div className="flex flex-col gap-1">
                        <input
                            type="text"
                            className="p-2 liquid-glass bg-zinc-300/10 w-full text-zinc-200 text-lg rounded-md focus:outline-none focus:ring-2 focus:ring-base-lime"
                            placeholder="Username"
                            {...register("username", { required: true, minLength: 3 })}
                        />
                        {errors.username?.type === "required" && (
                            <span className="text-rose-500 text-sm">Username is required!</span>
                        )}
                        {errors.username?.type === "minLength" && (
                            <span className="text-rose-500 text-sm">Username must be atleast 3 characters!</span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <input
                            className="p-2 liquid-glass bg-zinc-300/10 w-full text-zinc-200 text-lg rounded-md focus:outline-none focus:ring-2 focus:ring-base-lime"
                            type="password"
                            placeholder="Password"
                            {...register("password", { required: true, minLength: 6 })}
                        />
                        {errors.password?.type === "required" && (
                            <span className="text-rose-500 text-sm">Password is required!</span>
                        )}
                        {errors.password?.type === "minLength" && (
                            <span className="text-rose-500 text-sm">Password must be at least 6 characters</span>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="enabled:hover:bg-white disabled:bg-base-dark-green transition duration-300 rounded-md p-2 px-7 text-lg mt-6 flex items-center justify-center font-semibold disabled:cursor-not-allowed liquid-glass bg-zinc-300/10 text-zinc-300 hover:text-zinc-800 cursor-pointer"
                    >
                        {isSubmitting ? (
                            <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent text-base-dark-green"></span>
                        ) : (
                            "Login"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
