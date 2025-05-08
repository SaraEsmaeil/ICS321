const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /matches
router.get('/', async (req, res) => {
    try {
      const [matches] = await db.promise().query(`
        SELECT match_no, play_date 
        FROM MATCH_PLAYED 
        ORDER BY play_date DESC
      `);
      res.json(matches);
    } catch (err) {
      console.error('Error fetching matches:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
module.exports = router;
