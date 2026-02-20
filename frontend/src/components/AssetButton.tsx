import type { LucideIcon } from "lucide-react";

interface ButtonProps {
    text: string;
    color: "red" | "yellow" | "blue" | "green" | "orange" | "gray";
    icon: LucideIcon;
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
}

export default function AssetButton({
    text,
    color,
    onClick,
    icon: Icon,
    type = "button",
}: ButtonProps) {
    const colorVariants = {
        red: "bg-red-500 hover:bg-red-400",
        yellow: "bg-yellow-500 hover:bg-yellow-400",
        blue: "bg-blue-500 hover:bg-blue-400",
        green: "bg-green-500 hover:bg-green-400",
        orange: "bg-orange-500 hover:bg-orange-400",
        gray: "bg-gray-500 hover:bg-gray-400",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            className={`flex justify-center items-center gap-1.5 w-fit text-white py-2 px-4 rounded-lg active:scale-95 cursor-pointer ${colorVariants[color]}`}
        >
            <Icon size={20} />
            {text}
        </button>
    );
}
