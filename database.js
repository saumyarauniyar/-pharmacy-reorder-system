const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./pharmacy.db');

db.serialize(() => {
  // Create Users Table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT
  )`);

  // Create Orders Table
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_email TEXT,
    medication TEXT,
    dosage TEXT,
    status TEXT,
    ai_status TEXT,
    ai_confidence TEXT,
    pharmacist_notes TEXT
  )`);

  // Seed sample users if they don't exist yet
  db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
    if (row && row.count === 0) {
      db.run("INSERT INTO users (email, password, role) VALUES ('patient@test.com', 'password123', 'PATIENT')");
      db.run("INSERT INTO users (email, password, role) VALUES ('pharmacist@test.com', 'password123', 'PHARMACIST')");
    }
  });

  // Seed baseline sample orders to avoid the "empty app" trap
  db.get("SELECT COUNT(*) as count FROM orders", (err, row) => {
    if (row && row.count === 0) {
      db.run("INSERT INTO orders (patient_email, medication, dosage, status, ai_status, ai_confidence, pharmacist_notes) VALUES ('patient@test.com', 'Amoxicillin', '500mg', 'APPROVED', 'Safe - Clear match', 'High (98%)', 'Auto-passed safety check')");
      db.run("INSERT INTO orders (patient_email, medication, dosage, status, ai_status, ai_confidence, pharmacist_notes) VALUES ('patient@test.com', 'Lisinopril', '200mg', 'PENDING_PHARMACIST', 'Warning - High Dosage Flagged', 'Low (45%)', '')");
    }
  });
});

module.exports = db;
