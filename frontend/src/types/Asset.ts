export type Asset = {
    id: number;
    name: string;
    host: string;
    entityType: string;
    username: string;
    password: string;
};

export type AssetResponse = {
    id: number;
    name: string;
    host: string;
    entityType: string;
    username: string;
};

export type AssetCreateRequest = {
    name: string;
    host: string;
    entityType: string;
    username: string;
    password: string;
    action?: "new" | "overwrite";
    overwriteId?: number;
};
