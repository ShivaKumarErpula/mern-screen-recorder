# MERN Screen Recorder App

# 📌 Setup Instructions (Run Locally)
# Prerequisites

- Node.js and npm installed.

- A modern browser (Chrome recommended, with support for MediaRecorder).

## 1. Backend Setup
```
cd backend
npm install
npm start
```

- Starts the backend server on http://localhost:5000.

- Creates database.db automatically (SQLite).

- An empty uploads/ folder is used to store recordings.

## 2. Frontend Setup
```
cd frontend
npm install
npm start
```

- Runs the React app on http://localhost:3000.

- By default, it connects to the backend at http://localhost:5000.

- You can override this by creating a .env file in frontend/:
```
REACT_APP_API_URL=http://localhost:5000
```
## 3. Usage

- Go to http://localhost:3000.

# Click Start to begin recording your current browser tab + mic.

Stop recording to see a preview.

Download or upload the recording to the backend.

Visit /recordings page to view and play uploaded videos.
