import { API_BASE_URL } from "../config/env"
import type { Asset, AssetResponse, AssetCreateRequest } from "../types/Asset"

// GET ALL ASSETS
export async function getAllAssets(): Promise<AssetResponse[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/assets`)
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        return data
    } catch (error) {
        console.error("Failed to fetch assets:", error)
        throw error
    }
}

// GET ASSET BY ID
export async function getAssetById(id: number): Promise<AssetResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/assets/${id}`)
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        return data
    } catch (error) {
        console.error(`Failed to fetch asset ${id}:`, error)
        throw error
    }
}

// CREATE ASSET (with duplicate handling)
export async function createAsset(request: AssetCreateRequest): Promise<AssetResponse | string> {
    try {
        const response = await fetch(`${API_BASE_URL}/assets`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
        })
        
        if (response.status === 409) {
            // Duplicate name found
            return "duplicate"
        }
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        return data
    } catch (error) {
        console.error("Failed to create asset:", error)
        throw error
    }
}

// UPDATE ASSET
export async function updateAsset(id: number, asset: Asset): Promise<void> {
    try {
        const response = await fetch(`${API_BASE_URL}/assets/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(asset),
        })
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
    } catch (error) {
        console.error(`Failed to update asset ${id}:`, error)
        throw error
    }
}

// DELETE ASSET
export async function deleteAsset(id: number): Promise<void> {
    try {
        const response = await fetch(`${API_BASE_URL}/assets/${id}`, {
            method: "DELETE",
        })
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
    } catch (error) {
        console.error(`Failed to delete asset ${id}:`, error)
        throw error
    }
}
