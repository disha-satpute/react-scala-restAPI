import type { EndpointResponse } from "../types/EndpointCredential";
import { EditIcon, TrashIcon } from "lucide-react";
import EndpointButton from "./EndpointButton";

interface EndpointItemProps extends EndpointResponse {
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
}

export default function EndpointItem({
    id,
    url,
    onEdit,
    onDelete,
}: EndpointItemProps) {
    const trimmedUrl = url.length > 40 ? url.substring(0, 37) + "..." : url;

    return (
        <div className="flex gap-2 justify-between items-center bg-orange-200 shadow-xl rounded-md w-full px-4 py-2">
            <div>
                <h3 className="text-lg font-bold text-gray-900">id: {id}</h3>
                <p className="text-gray-500 mt-2 mb-4">
                    url:{" "}
                    <a
                        className="text-blue-400"
                        href={url}
                        target="_blank"
                    >
                        {trimmedUrl}
                    </a>
                </p>
            </div>

            <div className="flex gap-2 items-center">
                <EndpointButton
                    text="Edit"
                    color="yellow"
                    icon={EditIcon}
                    onClick={() => onEdit?.(id)}
                />
                <EndpointButton
                    text="Delete"
                    color="red"
                    icon={TrashIcon}
                    onClick={() => onDelete?.(id)}
                />
            </div>
        </div>
    );
}
