// 📁 routes/stats.js

const express = require('express');
const router = express.Router();
const db = require('../db');

// GET top goal scorer across all tournaments
router.get('/top-scorer', async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT gd.player_id, COUNT(*) AS goals, p.name
      FROM GOAL_DETAILS gd
      JOIN PLAYER pl ON gd.player_id = pl.player_id
      JOIN PERSON p ON pl.player_id = p.kfupm_id
      GROUP BY gd.player_id
      ORDER BY goals DESC
      LIMIT 1;
    `);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'No goal data found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Top scorer fetch error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /stats/red-cards
router.get('/red-cards', async (req, res) => {
    try {
      const [rows] = await db.promise().query(`
        SELECT 
          pb.team_id,
          pb.player_id,
          pb.match_no,
          pb.booking_time,
          pb.play_half,
          p.name
        FROM PLAYER_BOOKED pb
        JOIN PERSON p ON pb.player_id = p.kfupm_id
        WHERE pb.sent_off = 'Y';
      `);
      res.json(rows);
    } catch (err) {
      console.error('Red card fetch error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  

module.exports = router;
