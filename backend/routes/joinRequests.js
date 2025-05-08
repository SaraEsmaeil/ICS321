const express = require('express');
const router = express.Router();
const pool = require('../db');

// Guest: Submit Join Request
router.post('/request', async (req, res) => {
  const { player_id, team_id, tr_id } = req.body;
  try {
    const query = `
      INSERT INTO JOIN_REQUEST (player_id, team_id, tr_id)
      VALUES (?, ?, ?)
    `;
    await pool.promise().query(query, [player_id, team_id, tr_id]);
    res.status(201).json({ message: 'Join request submitted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit request.' });
  }
});

// Admin: Get available jersey numbers
// Get available jersey numbers for a team in a tournament
router.get('/available-jerseys', async (req, res) => {
  const { team_id, tr_id } = req.query;

  try {
    const [rows] = await pool.promise().query(`
      SELECT pl.jersey_no
      FROM TEAM_PLAYER tp
      JOIN PLAYER pl ON tp.player_id = pl.player_id
      WHERE tp.team_id = ? AND tp.tr_id = ?
    `, [team_id, tr_id]);

    const taken = rows.map(row => row.jersey_no);
    const all = Array.from({ length: 99 }, (_, i) => i + 1);
    const available = all.filter(num => !taken.includes(num));

    res.json(available);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch jersey numbers' });
  }
});


// Admin: View Pending Requests
router.get('/pending', async (req, res) => {
  try {
    const [rows] = await pool.promise().query(`
      SELECT 
        jr.request_id,
        jr.player_id,
        jr.team_id,
        jr.tr_id,
        jr.request_date,
        p.name,
        pl.position_to_play,
        t.team_name,
        tr.tr_name
      FROM JOIN_REQUEST jr
      JOIN PLAYER pl ON jr.player_id = pl.player_id
      JOIN PERSON p ON p.kfupm_id = jr.player_id
      JOIN TEAM t ON t.team_id = jr.team_id
      JOIN TOURNAMENT tr ON tr.tr_id = jr.tr_id
      WHERE jr.request_status = 'PENDING'
    `);
    res.json(rows);
  } catch (err) {
    console.error('❌ Failed to fetch join requests:', err);
    res.status(500).json({ error: 'Failed to fetch join requests.' });
  }
});

// Admin: Approve Request
// POST: Approve player and assign jersey
router.post('/approve', async (req, res) => {
  const { player_id, team_id, tr_id, jersey_no } = req.body;

  try {
    // Add to TEAM_PLAYER
    await pool.promise().query(`
      INSERT INTO TEAM_PLAYER (player_id, team_id, tr_id)
      VALUES (?, ?, ?)
    `, [player_id, team_id, tr_id]);

    // Update jersey_no in PLAYER
    await pool.promise().query(`
      UPDATE PLAYER SET jersey_no = ? WHERE player_id = ?
    `, [jersey_no, player_id]);

    // Update JOIN_REQUEST to approved
    await pool.promise().query(`
      UPDATE JOIN_REQUEST SET request_status = 'APPROVED'
      WHERE player_id = ? AND team_id = ? AND tr_id = ?
    `, [player_id, team_id, tr_id]);

    res.status(200).json({ message: 'Player approved and jersey assigned.' });
  } catch (err) {
    console.error('❌ Approval failed:', err);
    res.status(500).json({ error: 'Approval failed.' });
  }
});


module.exports = router;
