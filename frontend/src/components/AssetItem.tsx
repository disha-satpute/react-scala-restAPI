import type { AssetResponse } from "../types/Asset";
import { EditIcon, TrashIcon } from "lucide-react";
import AssetButton from "./AssetButton";

interface AssetItemProps extends AssetResponse {
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
}

export default function AssetItem({
    id,
    name,
    host,
    entityType,
    username,
    onEdit,
    onDelete,
}: AssetItemProps) {
    const trimmedHost = host.length > 40 ? host.substring(0, 37) + "..." : host;

    return (
        <div className="flex gap-2 justify-between items-center bg-orange-200 shadow-xl rounded-md w-full px-4 py-2">
            <div>
                <h3 className="text-lg font-bold text-gray-900">
                    {name} (ID: {id})
                </h3>
                <p className="text-gray-500 mt-1">
                    <span className="font-semibold">Host:</span>{" "}
                    <span className="text-blue-600">{trimmedHost}</span>
                </p>
                <p className="text-gray-500">
                    <span className="font-semibold">Type:</span> {entityType}
                </p>
                <p className="text-gray-500">
                    <span className="font-semibold">Username:</span> {username}
                </p>
            </div>

            <div className="flex gap-2 items-center">
                <AssetButton
                    text="Edit"
                    color="yellow"
                    icon={EditIcon}
                    onClick={() => onEdit?.(id)}
                />
                <AssetButton
                    text="Delete"
                    color="red"
                    icon={TrashIcon}
                    onClick={() => onDelete?.(id)}
                />
            </div>
        </div>
    );
}
