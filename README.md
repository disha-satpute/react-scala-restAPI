# BMC Internship - Asset Management System

A full-stack web application for managing assets, built with a Scala backend (ZIO) and a React frontend (Vite + TypeScript).

## Prerequisites

Ensure you have the following installed on your machine:

-   **Java JDK** (Version 11 or 17 recommended) - Required for Scala/SBT.
-   **Scala & SBT** (Simple Build Tool) - For running the backend.
    -   [Install SBT](https://www.scala-sbt.org/download.html)
-   **Bun** - For running the frontend.
    -   [Install Bun](https://bun.sh/)

## Project Structure

-   `backend/`: Scala ZIO application serving the REST API.
-   `frontend/`: React application with Vite, TypeScript, and Tailwind CSS.

---

## 🚀 Getting Started

### 1. Backend Setup (Scala/ZIO)

The backend runs on port **8080** and uses a file-based storage system (JSON).

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Run the application:
    ```bash
    sbt run
    ```
    
    *The first run may take a few minutes to download dependencies.*

    The server will start at: `http://localhost:8080`

### 2. Frontend Setup (React/Vite)

The frontend runs on port **5173** and proxies requests to the backend.

1.  Open a new terminal and navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    bun install
    ```

3.  Start the development server:
    ```bash
    bun run dev
    ```

    The application will be available at: `http://localhost:5173`

---

## ⚙️ Configuration

### Environment Variables

**Frontend (`frontend/src/config/env.ts`)**
-   `VITE_API_URL`: URL of the backend API.
    -   Default: `http://localhost:8080`
    ```bash
    cp .env.example .env
    ```
 




## 🛠 Tech Stack

**Backend:**
-   Scala 2.13
-   ZIO 2.x (Concurrency & Effects)
-   ZIO HTTP (Web Server)
-   ZIO JSON (JSON Parsing)

**Frontend:**
-   React 19
-   TypeScript
-   Vite
-   Tailwind CSS 4
-   Bun (Runtime/Package Manager)