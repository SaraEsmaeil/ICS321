const express = require('express');
const router = express.Router();
const db = require('../db'); // MySQL connection

// 📌 GET all tournament IDs, names, and dates
router.get('/list', async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      'SELECT tr_id, tr_name, start_date, end_date FROM TOURNAMENT'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tournaments' });
  }
});

// ✅ POST add a new tournament
router.post('/add', async (req, res) => {
  const { tr_id, tr_name, start_date, end_date } = req.body;

  if (!tr_id || !tr_name || !start_date || !end_date) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    await db.promise().query(
      'INSERT INTO TOURNAMENT (tr_id, tr_name, start_date, end_date) VALUES (?, ?, ?, ?)',
      [tr_id, tr_name, start_date, end_date]
    );
    res.json({ message: 'Tournament added successfully!' });
  } catch (err) {
    console.error('❌ Error inserting tournament:', err);
    res.status(500).json({ error: 'Server error while adding tournament' });
  }
});


module.exports = router;
