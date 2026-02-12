import { API_BASE_URL } from "../config/env"
import type { Endpoint, EndpointResponse } from "../types/EndpointCredential"

// GET ALL ENDPOINTS
export async function getAllEndpoints(): Promise<EndpointResponse[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/users`)
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        return data
    } catch (error) {
        console.error("Failed to fetch endpoints:", error)
        throw error
    }
}

// GET ENDPOINT BY ID
export async function getEndpointById(id: number): Promise<EndpointResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${id}`)
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        return data
    } catch (error) {
        console.error(`Failed to fetch endpoint ${id}:`, error)
        throw error
    }
}

// CREATE ENDPOINT
export async function createEndpoint(endpoint: Endpoint): Promise<EndpointResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(endpoint),
        })
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        return data
    } catch (error) {
        console.error("Failed to create endpoint:", error)
        throw error
    }
}

// UPDATE ENDPOINT
export async function updateEndpoint(id: number, endpoint: Endpoint): Promise<void> {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(endpoint),
        })
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
    } catch (error) {
        console.error(`Failed to update endpoint ${id}:`, error)
        throw error
    }
}

// DELETE ENDPOINT
export async function deleteEndpoint(id: number): Promise<void> {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
            method: "DELETE",
        })
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
    } catch (error) {
        console.error(`Failed to delete endpoint ${id}:`, error)
        throw error
    }
}
