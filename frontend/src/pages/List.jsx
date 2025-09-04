import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function fmtBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B","KB","MB","GB","TB"];
  const i = Math.floor(Math.log(bytes)/Math.log(k));
  return parseFloat((bytes/Math.pow(k,i)).toFixed(2)) + " " + sizes[i];
}

export default function List() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API_URL}/api/recordings`);
        setItems(res.data);
      } catch (e) {
        console.error(e);
        setError("Failed to load recordings.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="text-lg font-medium">Uploaded Recordings</div>
      <div className="grid gap-4">
        {items.length === 0 && <div className="text-gray-600">No recordings yet.</div>}
        {items.map(r => (
          <div key={r.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{r.filename}</div>
                <div className="text-sm text-gray-500">
                  {fmtBytes(r.filesize)} · {new Date(r.createdAt).toLocaleString()}
                </div>
              </div>
              <a className="text-blue-600 underline" href={`${API_URL}/api/recordings/${r.id}`} target="_blank" rel="noreferrer">Open</a>
            </div>
            <video className="w-full mt-3 rounded" controls src={`${API_URL}/api/recordings/${r.id}`}></video>
          </div>
        ))}
      </div>
    </div>
  );
}
