import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";

const db = new Database("fsadexam.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS library (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    date TEXT,
    status TEXT
  )
`);

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  // API Routes
  app.get("/api/library", (req, res) => {
    const records = db.prepare("SELECT * FROM library ORDER BY id DESC").all();
    res.json(records);
  });

  app.post("/api/library", (req, res) => {
    const { name, description, date, status } = req.body;
    const info = db.prepare(
      "INSERT INTO library (name, description, date, status) VALUES (?, ?, ?, ?)"
    ).run(name, description, date || new Date().toISOString().split('T')[0], status || 'Active');
    
    res.json({ id: info.lastInsertRowid, message: "Record Inserted Successfully!" });
  });

  app.delete("/api/library/:id", (req, res) => {
    const { id } = req.params;
    const info = db.prepare("DELETE FROM library WHERE id = ?").run(id);
    if (info.changes > 0) {
      res.json({ message: "Record Deleted Successfully!" });
    } else {
      res.status(404).json({ message: "Record Not Found!" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
