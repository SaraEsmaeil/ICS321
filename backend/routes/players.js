// 📁 routes/players.js

const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /players/by-team/:match_no/:team_id
router.get('/by-team/:match_no/:team_id', async (req, res) => {
    const { match_no, team_id } = req.params;
    try {
      const [players] = await db.promise().query(`
        SELECT p.kfupm_id AS player_id, p.name 
        FROM TEAM_PLAYER tp
        JOIN PERSON p ON tp.player_id = p.kfupm_id
        JOIN MATCH_PLAYED mp ON tp.team_id = mp.team_id1 OR tp.team_id = mp.team_id2
        WHERE tp.team_id = ? AND (mp.match_no = ?)
      `, [team_id, match_no]);
  
      res.json(players);
    } catch (err) {
      console.error('Error fetching players:', err);
      res.status(500).json({ error: 'Failed to get players' });
    }
  });
  

module.exports = router;
