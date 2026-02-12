import { PlusSquareIcon, RefreshCcwIcon } from "lucide-react";
import EndpointButton from "./EndpointButton";
import EndpointItem from "./EndpointItem";

export default function EndpointItemList() {
    return (
        <div className="shadow-2xl bg-transparent">
            <div className="flex justify-between items-center bg-gray-600 h-16 w-full px-3 rounded-t-lg">
                <h3 className="text-white">Endpoint List</h3>
                <div className="flex gap-2">
                    <EndpointButton
                        text="Add"
                        color="green"
                        icon={PlusSquareIcon}
                    />
                    <EndpointButton
                        text="Refresh"
                        color="blue"
                        icon={RefreshCcwIcon}
                    />
                </div>
            </div>
            <div className="flex flex-col gap-2 justify-start items-center min-h-156 bg-amber-200 p-3 rounded-b-lg">
                <EndpointItem
                    id={1}
                    url={"urldfdfdfdfdfdfdfdfdfdfdfdfdf"}
                    username={"u1"}
                    password={"pass"}
                />
                <EndpointItem
                    id={2}
                    url={"url"}
                    username={"u1"}
                    password={"pass"}
                />
            </div>
        </div>
    );
}
