# Amberflux Assignment Reference Document

# MERN Screen Recorder Take-Home Assignment

## 1. Project Overview

This project is a web-based screen recorder application built with the MERN stack (though we are using SQL instead of MongoDB). It allows users to record their current browser tab with microphone audio, preview the recording, download it, and upload it to a Node.js backend where the metadata is stored in an SQL database.

### Core Features

- **Frontend (React):**
  - Record the current browser tab with microphone audio.
  - Start/Stop recording controls.
  - Live recording timer (max 3 minutes).
  - Video preview player after recording.
  - Download the recording as a `.webm` file.
  - Upload the recording to the backend.
  - View a list of previously uploaded recordings.
- **Backend (Node.js & Express):**
  - API endpoints to handle file uploads, list recordings, and stream specific recordings.
  - File handling using `multer`.
  - Metadata storage in an SQL database (SQLite for local development).
- **Database (SQL):**
  - A single table to store recording metadata like filename, file path, size, and creation date.

## 2. Technology Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** SQL (SQLite for simplicity in this reference)
- **File Handling:** Multer for file uploads on the backend.
- **Web APIs:** `navigator.mediaDevices.getDisplayMedia`, `MediaRecorder`

## 3. Project Structure

```
/mern-screen-recorder
|-- /frontend
|   |-- src
|   |   |-- App.jsx       # Main React component (pages are routed in index.js)
|   |-- package.json
|
|-- /backend
|   |-- /uploads          # Directory to store uploaded recordings
|   |-- server.js         # Express server and API logic
|   |-- database.db       # SQLite database file (auto-created on first run)
|   |-- package.json
|
|-- README.md             # This file
```

## 4. Local Development Setup

### Prerequisites

- Node.js and npm (or yarn) installed.
- A modern web browser that supports the `MediaRecorder` API (Chrome recommended).
- For macOS, when recording: ensure the browser has Screen Recording permission in **System Settings → Privacy & Security → Screen Recording**.

### Step 1: Backend Setup

```bash
cd backend
npm install
npm start
```

The server starts at `http://localhost:5000`, creates `database.db`, and ensures the `recordings` table exists.

### Step 2: Frontend Setup

```bash
cd frontend
npm install
npm start
```

The React app runs at `http://localhost:3000`.

> Optional: create a `.env` file in `frontend` and set `REACT_APP_API_URL` to your backend URL. Defaults to `http://localhost:5000`.

## 5. API Endpoints (Backend)

- **POST `/api/recordings`**  
  - Upload a new video recording. Field name: `video` (multipart/form-data).
  - **201** → `{ message, recording }`  
- **GET `/api/recordings`**  
  - List all uploaded recordings.  
  - **200** → `[{ id, filename, filepath, filesize, createdAt }, ...]`  
- **GET `/api/recordings/:id`**  
  - Streams a specific video recording for playback.  
  - **200** → video/webm stream  

## 6. Database Schema

A single SQL table named `recordings` is used:

| Column     | Type      | Description                              |
|------------|-----------|------------------------------------------|
| `id`       | INTEGER   | Primary Key, Auto Increment              |
| `filename` | TEXT      | Original filename for the recording      |
| `filepath` | TEXT      | Absolute path where file is stored       |
| `filesize` | INTEGER   | Size of the file in bytes                |
| `createdAt`| TIMESTAMP | Timestamp of upload                      |

## 7. Deployment Guide

### Frontend (Vercel / Netlify)

1. Push your frontend code to GitHub.
2. Create a new project in Vercel/Netlify and link the repo.
3. Build Command: `npm run build`  
   Publish Directory: `build`  
4. Set `REACT_APP_API_URL` to your backend URL in project environment variables.
5. Deploy.

### Backend (Render)

1. Push backend to GitHub.
2. Create a **Web Service** in Render → connect the repo.
3. **Build Command:** `npm install`  
   **Start Command:** `node server.js`
4. Note: Render free tier filesystem is ephemeral. For production, store files in cloud storage (S3/GCS) and keep a public URL in DB instead of local file path.

## 8. Known Limitations

- Tested on desktop Chrome; other browsers may vary.
- Render free tier may lose uploaded files after restarts; use cloud storage for persistence.
- Uses SQLite for simplicity; migrate to PostgreSQL/MySQL for production.

## 9. License

MIT
