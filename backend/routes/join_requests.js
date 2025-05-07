const express = require('express');
const router = express.Router();
const db = require('../db');

// ✅ Submit a join request
router.post('/add', async (req, res) => {
  const { player_id, name, date_of_birth, team_id, tr_id, position_to_play } = req.body;

  if (!player_id || !name || !date_of_birth || !team_id || !tr_id || !position_to_play) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // ❌ Make sure team is part of the tournament
    const [[exists]] = await db.promise().query(
      'SELECT * FROM TOURNAMENT_TEAM WHERE team_id = ? AND tr_id = ?',
      [team_id, tr_id]
    );

    if (!exists) {
      return res.status(400).json({ error: 'This team is not in the selected tournament.' });
    }

    await db.promise().query(`
      INSERT INTO JOIN_REQUEST 
      (player_id, name, date_of_birth, team_id, tr_id, position_to_play) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [player_id, name, date_of_birth, team_id, tr_id, position_to_play]);

    res.json({ message: 'Join request submitted!' });
  } catch (err) {
    console.error('❌ Error inserting join request:', err);
    res.status(500).json({ error: 'Server error while submitting request' });
  }
});

// ✅ Fetch all pending requests
router.get('/pending', async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT jr.*, t.team_name, p.position_desc 
      FROM JOIN_REQUEST jr
      JOIN TEAM t ON jr.team_id = t.team_id
      JOIN PLAYING_POSITION p ON jr.position_to_play = p.position_id
      WHERE jr.approved = 'N'
    `);
    res.json(rows);
  } catch (err) {
    console.error('❌ Fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch pending requests' });
  }
});

// ✅ Approve a player request
router.post('/approve/:player_id', async (req, res) => {
  const player_id = req.params.player_id;
  const { jersey_no } = req.body;

  if (!jersey_no) return res.status(400).json({ error: 'Jersey number is required' });

  try {
    const [[request]] = await db.promise().query(`
      SELECT * FROM JOIN_REQUEST 
      WHERE player_id = ? AND approved = 'N'`, 
      [player_id]);

    if (!request) return res.status(404).json({ error: 'Join request not found or already approved' });

    const conn = await db.promise().getConnection();
    await conn.beginTransaction();

    // ✅ Insert into PERSON if not already
    await conn.query(`
      INSERT IGNORE INTO PERSON (kfupm_id, name, date_of_birth) 
      VALUES (?, ?, ?)`,
      [request.player_id, request.name, request.date_of_birth]);

    // ✅ Insert into PLAYER
    await conn.query(`
      INSERT INTO PLAYER (player_id, jersey_no, position_to_play) 
      VALUES (?, ?, ?)`,
      [request.player_id, jersey_no, request.position_to_play]);

    // ✅ Insert into TEAM_PLAYER
    await conn.query(`
      INSERT INTO TEAM_PLAYER (player_id, team_id, tr_id) 
      VALUES (?, ?, ?)`,
      [request.player_id, request.team_id, request.tr_id]);

    // ✅ Mark as approved
    await conn.query(`
      UPDATE JOIN_REQUEST SET approved = 'Y' 
      WHERE player_id = ? AND team_id = ? AND tr_id = ?`,
      [request.player_id, request.team_id, request.tr_id]);

    await conn.commit();
    conn.release();

    res.json({ message: '✅ Player approved and registered.' });
  } catch (err) {
    console.error('❌ Approval error:', err);
    res.status(500).json({ error: 'Error while approving player.' });
  }
});

module.exports = router;
