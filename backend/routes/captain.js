const express = require('express');
const router = express.Router();
const db = require('../db');

// Assign a captain
router.post('/assign', async (req, res) => {
  const { match_no, team_id, player_id } = req.body;

  if (!match_no || !team_id || !player_id) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // Optional: Check if the player belongs to that team and tournament
    await db.promise().query(
      'INSERT INTO MATCH_CAPTAIN (match_no, team_id, player_captain) VALUES (?, ?, ?)',
      [match_no, team_id, player_id]
    );
    res.json({ message: 'Captain assigned successfully ✅' });
  } catch (err) {
    console.error('Captain assignment error:', err);
    res.status(500).json({ error: 'Failed to assign captain.' });
  }
});

module.exports = router;
