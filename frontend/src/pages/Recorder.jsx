import React, { useRef, useState } from "react";
import axios from "axios";
import Timer from "../components/Timer";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function Recorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [previewURL, setPreviewURL] = useState(null);
  const [status, setStatus] = useState("");
  const mediaRecorderRef = useRef(null);
  const dataChunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);

  const startRecording = async () => {
    setStatus("");
    setPreviewURL(null);
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 30 },
        audio: true
      });
      streamRef.current = stream;
      const mr = new MediaRecorder(stream, { mimeType: "video/webm; codecs=vp9,opus" });
      dataChunksRef.current = [];

      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) dataChunksRef.current.push(e.data);
      };

      mr.onstop = () => {
        const blob = new Blob(dataChunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setPreviewURL(url);
        dataChunksRef.current = [];
        // Stop all tracks
        streamRef.current.getTracks().forEach(t => t.stop());
      };

      mr.start(250); // collect data in chunks
      mediaRecorderRef.current = mr;
      setIsRecording(true);
      setSeconds(0);

      // Timer + 3 min cap
      let s = 0;
      timerRef.current = setInterval(() => {
        s += 1;
        setSeconds(s);
        if (s >= 180) stopRecording();
      }, 1000);
    } catch (err) {
      console.error(err);
      setStatus("Permission denied or unsupported browser.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    clearInterval(timerRef.current);
    setSeconds(0);
  };

  const downloadRecording = () => {
    if (!previewURL) return;
    const a = document.createElement("a");
    a.href = previewURL;
    a.download = "recording.webm";
    a.click();
  };

  const uploadRecording = async () => {
    if (!previewURL) return;
    try {
      setStatus("Uploading...");
      const blob = await fetch(previewURL).then(r => r.blob());
      const form = new FormData();
      form.append("video", blob, `recording-${Date.now()}.webm`);
      const res = await axios.post(`${API_URL}/api/recordings`, form, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.status === 201) {
        setStatus("✅ Uploaded successfully.");
      } else {
        setStatus("Upload failed.");
      }
    } catch (e) {
      console.error(e);
      setStatus("Upload failed.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-white rounded-lg shadow flex items-center justify-between">
        <div className="space-y-1">
          <div className="text-lg font-medium">Recorder</div>
          <div className="text-sm text-gray-500">Record current tab + mic · Max 3 minutes</div>
        </div>
        <div className="flex items-center gap-3">
          <div className={"text-sm px-2 py-1 rounded " + (isRecording ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600")}>
            {isRecording ? "Recording..." : "Idle"}
          </div>
          <div className="font-mono text-lg"><Timer seconds={seconds} /></div>
          {!isRecording ? (
            <button onClick={startRecording} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Start</button>
          ) : (
            <button onClick={stopRecording} className="px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-900">Stop</button>
          )}
        </div>
      </div>

      {status && <div className="text-sm text-gray-600">{status}</div>}

      {previewURL && (
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="mb-3 font-medium">Preview</div>
          <video src={previewURL} controls className="w-full max-w-3xl rounded"></video>
          <div className="mt-3 flex gap-3">
            <button onClick={downloadRecording} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Download</button>
            <button onClick={uploadRecording} className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">Upload</button>
          </div>
        </div>
      )}
    </div>
  );
}
