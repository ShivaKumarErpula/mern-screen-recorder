import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import "./index.css";
import Recorder from "./pages/Recorder";
import List from "./pages/List";

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Screen Recorder</h1>
          <nav className="space-x-4">
            <NavLink className={({isActive}) => (isActive ? "text-blue-600 font-medium" : "text-gray-700")} to="/">Record</NavLink>
            <NavLink className={({isActive}) => (isActive ? "text-blue-600 font-medium" : "text-gray-700")} to="/recordings">Recordings</NavLink>
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        <Routes>
          <Route path="/" element={<Recorder />} />
          <Route path="/recordings" element={<List />} />
        </Routes>
      </main>
      <footer className="border-t bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4 text-sm text-gray-500">
          Built with MediaRecorder API · Max 3 minutes per recording
        </div>
      </footer>
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Layout />
  </BrowserRouter>
);
