import type { LucideIcon } from "lucide-react";

interface ButtonProps {
    text: string;
    color: "red" | "yellow" | "blue" | "green";
    icon: LucideIcon;
    onClick: () => void;
}

export default function AssetButton({
    text,
    color,
    onClick,
    icon: Icon,
}: ButtonProps) {
    const colorVariants = {
        red: "bg-red-500 hover:bg-red-400",
        yellow: "bg-yellow-500 hover:bg-yellow-400",
        blue: "bg-blue-500 hover:bg-blue-400",
        green: "bg-green-500 hover:bg-green-400",
    };

    return (
        <button
            onClick={onClick}
            className={`flex justify-center items-center gap-1.5 w-fit text-white py-2 px-4 rounded-lg active:scale-95 cursor-pointer ${colorVariants[color]}`}
        >
            <Icon size={20} />
            {text}
        </button>
    );
}
