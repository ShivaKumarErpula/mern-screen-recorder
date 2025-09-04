const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const morgan = require("morgan");
const db = require("./db");

const app = express();
app.use(cors());
app.use(morgan("dev"));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const safe = Date.now() + "-" + file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    cb(null, safe);
  }
});
const upload = multer({ storage });

// Upload endpoint
app.post("/api/recordings", upload.single("video"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  const { filename, path: filepath, size } = req.file;
  db.run(
    "INSERT INTO recordings (filename, filepath, filesize) VALUES (?, ?, ?)",
    [filename, filepath, size],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "DB insert failed" });
      }
      db.get("SELECT * FROM recordings WHERE id = ?", [this.lastID], (err2, row) => {
        if (err2) return res.status(500).json({ message: "DB read failed" });
        return res.status(201).json({ message: "Recording uploaded successfully", recording: row });
      });
    }
  );
});

// List endpoint
app.get("/api/recordings", (req, res) => {
  db.all("SELECT * FROM recordings ORDER BY createdAt DESC", (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "DB query failed" });
    }
    res.json(rows);
  });
});

// Stream endpoint
app.get("/api/recordings/:id", (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM recordings WHERE id = ?", [id], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "DB query failed" });
    }
    if (!row) return res.status(404).json({ message: "Not found" });
    const filepath = row.filepath;
    if (!fs.existsSync(filepath)) return res.status(404).json({ message: "File missing" });
    // Stream the file with proper headers
    const stat = fs.statSync(filepath);
    res.writeHead(200, {
      "Content-Type": "video/webm",
      "Content-Length": stat.size,
      "Accept-Ranges": "bytes",
      "Content-Disposition": `inline; filename="${row.filename}"`
    });
    const readStream = fs.createReadStream(filepath);
    readStream.pipe(res);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));
