import { PlusSquareIcon, RefreshCcwIcon } from "lucide-react";
import EndpointButton from "./EndpointButton";
import EndpointItem from "./EndpointItem";
import Modal from "./Modal";
import { useEffect, useState } from "react";
import { getAllEndpoints, updateEndpoint, deleteEndpoint, createEndpoint } from "../api/endpointService";
import type { EndpointResponse, Endpoint } from "../types/EndpointCredential";

export default function EndpointItemList() {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<EndpointResponse[]>([]);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'update'>('update');
    const [selectedItem, setSelectedItem] = useState<EndpointResponse | null>(null);
    const [formData, setFormData] = useState<Endpoint>({ id: 0, url: '', username: '', password: '' });

    const fetchEndpoints = () => {
        setIsLoading(true);
        getAllEndpoints()
            .then((list) => setData(list))
            .catch((error) =>
                console.error("Failed to fetch endpoints:", error),
            )
            .finally(() => setIsLoading(false));
    };

    const handleAddClick = () => {
        setFormData({ id: 0, url: '', username: '', password: '' });
        setSelectedItem(null);
        setModalMode('create');
        setIsModalOpen(true);
    };

    const handleEditClick = (id: number) => {
        const item = data.find(d => d.id === id);
        if (item) {
            setSelectedItem(item);
            setFormData({ ...item, password: '' });
            setModalMode('update');
            setIsModalOpen(true);
        }
    };

    const handleDeleteClick = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this endpoint?")) {
            try {
                await deleteEndpoint(id);
                fetchEndpoints();
            } catch (error) {
                console.error("Failed to delete endpoint:", error);
            }
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleModalSubmit = async () => {
        try {
            if (modalMode === 'update' && selectedItem) {
                await updateEndpoint(selectedItem.id, formData);
            } else if (modalMode === 'create') {
                await createEndpoint(formData);
            }
            fetchEndpoints();
            handleModalClose();
        } catch (error) {
            console.error(`Failed to ${modalMode} endpoint:`, error);
        }
    };

    useEffect(() => {
        fetchEndpoints();
    }, []);

    return (
        <div className="shadow-2xl w-xl">
            <div className="flex justify-between items-center bg-gray-600 h-16 w-full px-4 rounded-t-lg">
                <h3 className="text-white">Endpoint List</h3>
                <div className="flex gap-2">
                    <EndpointButton
                        text="Add"
                        color="green"
                        icon={PlusSquareIcon}
                        onClick={handleAddClick}
                    />
                    <EndpointButton
                        text="Refresh"
                        color="blue"
                        icon={RefreshCcwIcon}
                        onClick={fetchEndpoints}
                    />
                </div>
            </div>
            <div className="flex flex-col gap-2 justify-start items-center min-h-156 bg-amber-200 p-3 rounded-b-lg">
                {isLoading ? (
                    <p className="text-gray-600 font-medium">
                        Loading endpoints...
                    </p>
                ) : data.length === 0 ? (
                    <p className="text-gray-600 font-medium">
                        No endpoints found!
                    </p>
                ) : (
                    data.map((endpoint) => (
                        <EndpointItem
                            key={endpoint.id}
                            id={endpoint.id}
                            url={endpoint.url}
                            username={endpoint.username}
                            onEdit={handleEditClick}
                            onDelete={handleDeleteClick}
                        />
                    ))
                )}
            </div>
            
            <Modal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                title={modalMode === 'update' ? 'Update Endpoint' : 'Add Endpoint'}
            >
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">URL</label>
                        <input
                            name="url"
                            value={formData.url}
                            onChange={handleFormChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                        <input
                            name="username"
                            value={formData.username}
                            onChange={handleFormChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleFormChange}
                            placeholder={modalMode === 'update' ? "Leave empty to keep unchanged" : ""}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            onClick={handleModalClose}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleModalSubmit}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
