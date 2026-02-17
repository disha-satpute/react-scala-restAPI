import { PlusSquareIcon, RefreshCcwIcon } from "lucide-react";
import AssetButton from "./AssetButton";
import AssetItem from "./AssetItem";
import Modal from "./Modal";
import { useEffect, useState } from "react";
import { getAllAssets, updateAsset, deleteAsset, createAsset } from "../api/assetService";
import type { AssetResponse, Asset, AssetCreateRequest } from "../types/Asset";

export default function AssetItemList() {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<AssetResponse[]>([]);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'update'>('update');
    const [selectedItem, setSelectedItem] = useState<AssetResponse | null>(null);
    const [formData, setFormData] = useState<Asset>({ 
        id: 0, 
        name: '', 
        host: '', 
        entityType: '', 
        username: '', 
        password: '' 
    });

    // Duplicate handling state
    const [showDuplicateModal, setShowDuplicateModal] = useState(false);
    const [duplicateAssets, setDuplicateAssets] = useState<AssetResponse[]>([]);
    const [pendingRequest, setPendingRequest] = useState<AssetCreateRequest | null>(null);

    const fetchAssets = () => {
        setIsLoading(true);
        getAllAssets()
            .then((list) => setData(list))
            .catch((error) =>
                console.error("Failed to fetch assets:", error),
            )
            .finally(() => setIsLoading(false));
    };

    const handleAddClick = () => {
        setFormData({ 
            id: 0, 
            name: '', 
            host: '', 
            entityType: '', 
            username: '', 
            password: '' 
        });
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
        if (window.confirm("Are you sure you want to delete this asset?")) {
            try {
                await deleteAsset(id);
                fetchAssets();
            } catch (error) {
                console.error("Failed to delete asset:", error);
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
                await updateAsset(selectedItem.id, formData);
                fetchAssets();
                handleModalClose();
            } else if (modalMode === 'create') {
                const request: AssetCreateRequest = {
                    name: formData.name,
                    host: formData.host,
                    entityType: formData.entityType,
                    username: formData.username,
                    password: formData.password,
                };
                
                const result = await createAsset(request);
                
                if (result === "duplicate") {
                    // Handle duplicate - show duplicate modal
                    const duplicates = data.filter(a => a.name === formData.name);
                    setDuplicateAssets(duplicates);
                    setPendingRequest(request);
                    setShowDuplicateModal(true);
                } else {
                    fetchAssets();
                    handleModalClose();
                }
            }
        } catch (error) {
            console.error(`Failed to ${modalMode} asset:`, error);
        }
    };

    const handleDuplicateAction = async (action: "new" | "overwrite", overwriteId?: number) => {
        if (!pendingRequest) return;

        try {
            const request: AssetCreateRequest = {
                ...pendingRequest,
                action,
                overwriteId,
            };

            await createAsset(request);
            fetchAssets();
            setShowDuplicateModal(false);
            setPendingRequest(null);
            setDuplicateAssets([]);
            handleModalClose();
        } catch (error) {
            console.error("Failed to handle duplicate:", error);
        }
    };

    useEffect(() => {
        fetchAssets();
    }, []);

    return (
        <div className="shadow-2xl w-xl">
            <div className="flex justify-between items-center bg-gray-600 h-16 w-full px-4 rounded-t-lg">
                <h3 className="text-white">Asset List</h3>
                <div className="flex gap-2">
                    <AssetButton
                        text="Add"
                        color="green"
                        icon={PlusSquareIcon}
                        onClick={handleAddClick}
                    />
                    <AssetButton
                        text="Refresh"
                        color="blue"
                        icon={RefreshCcwIcon}
                        onClick={fetchAssets}
                    />
                </div>
            </div>
            <div className="flex flex-col gap-2 justify-start items-center min-h-156 bg-amber-200 p-3 rounded-b-lg">
                {isLoading ? (
                    <p className="text-gray-600 font-medium">
                        Loading assets...
                    </p>
                ) : data.length === 0 ? (
                    <p className="text-gray-600 font-medium">
                        No assets found!
                    </p>
                ) : (
                    data.map((asset) => (
                        <AssetItem
                            key={asset.id}
                            id={asset.id}
                            name={asset.name}
                            host={asset.host}
                            entityType={asset.entityType}
                            username={asset.username}
                            onEdit={handleEditClick}
                            onDelete={handleDeleteClick}
                        />
                    ))
                )}
            </div>
            
            <Modal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                title={modalMode === 'update' ? 'Update Asset' : 'Add Asset'}
            >
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleFormChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Host</label>
                        <input
                            name="host"
                            value={formData.host}
                            onChange={handleFormChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Entity Type</label>
                        <input
                            name="entityType"
                            value={formData.entityType}
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

            <Modal
                isOpen={showDuplicateModal}
                onClose={() => {
                    setShowDuplicateModal(false);
                    setPendingRequest(null);
                    setDuplicateAssets([]);
                }}
                title="Duplicate Asset Name Found"
            >
                <div className="flex flex-col gap-4">
                    <p className="text-gray-700">
                        An asset with the name "{pendingRequest?.name}" already exists. 
                        What would you like to do?
                    </p>
                    
                    <div className="bg-gray-100 p-3 rounded">
                        <h4 className="font-semibold mb-2">Existing Assets:</h4>
                        {duplicateAssets.map((asset) => (
                            <div key={asset.id} className="mb-2 p-2 bg-white rounded">
                                <p><span className="font-semibold">ID:</span> {asset.id}</p>
                                <p><span className="font-semibold">Host:</span> {asset.host}</p>
                                <p><span className="font-semibold">Type:</span> {asset.entityType}</p>
                                <p><span className="font-semibold">Username:</span> {asset.username}</p>
                                <button
                                    onClick={() => handleDuplicateAction("overwrite", asset.id)}
                                    className="mt-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-1 px-3 rounded cursor-pointer"
                                >
                                    Overwrite This
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            onClick={() => {
                                setShowDuplicateModal(false);
                                setPendingRequest(null);
                                setDuplicateAssets([]);
                            }}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => handleDuplicateAction("new")}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                        >
                            Create New Entry
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
