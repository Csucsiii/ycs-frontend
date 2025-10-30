import type { Path, UseFormRegister } from "react-hook-form";
import type { FormData } from "./Settings";

type SettingsCardProps = {
    platform: keyof FormData;
    title: string;
    color: string;
    fields: { label: string; name: string; placeholder: string, type?: string }[];
    register: UseFormRegister<FormData>;
};

const SettingsCard = ({ title, color, fields, register, platform }: SettingsCardProps) => {
    return (
        <div className="flex flex-col w-full items-center text-zinc-200 liquid-glass bg-zinc-300/10 rounded-md overflow-hidden gap-2 p-3">
            <div className={`text-2xl w-full ${color} p-4 text-center liquid-glass overflow-hidden rounded-md`}>{title}</div>
            {fields.map((field) => {
                const path = `${platform}.${field.name}` as Path<FormData>;
                return (
                    <div key={field.name} className="flex flex-col w-full p-4 gap-2">
                        <label htmlFor={field.name} className="font-semibold">
                            {field.label}
                        </label>
                        <input
                            {...register(path, { valueAsNumber: field.type === "number" })}
                            type={field.type ?? "text"}
                            id={path}
                            placeholder={field.placeholder}
                            className={`p-2 liquid-glass rounded-sm blur-xs duration-300 hover:blur-none focus:blur-none`}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default SettingsCard;
