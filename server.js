const express = require('express');
const path = require('path');
const db = require('./database');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 1. Login Endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.get("SELECT * FROM users WHERE email = ? AND password = ?", [email, password], (err, user) => {
    if (user) {
      res.json({ success: true, role: user.role, email: user.email });
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  });
});

// 2. Fetch Orders Endpoint
app.get('/api/orders', (req, res) => {
  db.all("SELECT * FROM orders", [], (err, rows) => {
    res.json(rows);
  });
});

// 3. Submit Reorder Endpoint (With Mock AI Verification Logic)
app.post('/api/reorder', (req, res) => {
  const { email, medication, dosage } = req.body;
  
  // Rule-based Core Build Automation: If dosage contains numbers over 100, simulate an AI error/warning state
  let ai_status = "Safe - No conflicts found";
  let ai_confidence = "High (92%)";
  let final_status = "APPROVED";

  const numericDosage = parseInt(dosage);
  if (!isNaN(numericDosage) && numericDosage > 100) {
    ai_status = "Unsure - Extreme dosage flagged for verification";
    ai_confidence = "Low (35%)";
    final_status = "PENDING_PHARMACIST"; 
  }

  const query = `INSERT INTO orders (patient_email, medication, dosage, status, ai_status, ai_confidence, pharmacist_notes) VALUES (?, ?, ?, ?, ?, ?, '')`;
  db.run(query, [email, medication, dosage, final_status, ai_status, ai_confidence], function(err) {
    res.json({ success: true, orderId: this.lastID, status: final_status });
  });
});

// 4. Pharmacist Action Endpoint (Approve/Reject)
app.post('/api/orders/action', (req, res) => {
  const { id, action, notes } = req.body;
  db.run("UPDATE orders SET status = ?, pharmacist_notes = ? WHERE id = ?", [action, notes, id], (err) => {
    res.json({ success: true });
  });
});

app.listen(3000, () => console.log('Server running perfectly on http://localhost:3000'));
