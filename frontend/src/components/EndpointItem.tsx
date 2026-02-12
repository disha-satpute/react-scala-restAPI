import type { Endpoint } from "../types/EndpointCredential";
import { EditIcon, TrashIcon } from "lucide-react";
import EndpointButton from "./EndpointButton";

export default function EndpointItem({ id, url }: Endpoint) {

	const trimmedUrl = (url.length > 20) ? url.substring(0, 17) + "..." : url;
    return (
        <div className="flex gap-2 justify-between items-center bg-orange-200 shadow-xl rounded-md w-100 px-4 py-2">
            <div>
                <h3 className="text-lg font-bold text-gray-900">id: {id}</h3>
                <p className="text-gray-500 mt-2 mb-4">
                    url:{" "}
                    <a className="text-blue-400" href={trimmedUrl}>
                        {url}
                    </a>
                </p>
            </div>

            <div className="flex gap-2 items-center">
                <EndpointButton text="Edit" color="yellow" icon={EditIcon} />
                <EndpointButton text="Delete" color="red" icon={TrashIcon} />
            </div>
        </div>
    );
}
