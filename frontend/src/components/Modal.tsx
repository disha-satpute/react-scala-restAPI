import { XIcon } from "lucide-react";
import React from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
}: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-amber-200 rounded-lg shadow-2xl w-125 overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center bg-gray-600 h-16 w-full px-4 text-white">
                    <h3 className="font-bold text-lg">{title}</h3>
                    <button
                        onClick={onClose}
                        className="hover:text-gray-300 cursor-pointer"
                    >
                        <XIcon size={24} />
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}
