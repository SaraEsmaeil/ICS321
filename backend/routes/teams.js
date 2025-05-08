const express = require('express');
const router = express.Router();
const db = require('../db');


// ✅ GET all teams (for dropdowns)
router.get('/list', async (req, res) => {
    try {
      const [rows] = await db.promise().query('SELECT team_id, team_name FROM TEAM');
      res.json(rows);
    } catch (err) {
      console.error('❌ Failed to fetch teams:', err);
      res.status(500).json({ error: 'Server error while fetching teams' });
    }
  });
  
  // ✅ GET tournaments joined by a specific team (for filtering in JoinTeam form)
  router.get('/:team_id/tournaments', async (req, res) => {
    const { team_id } = req.params;
      try {
      const [rows] = await db.promise().query(
        `SELECT T.tr_id, TR.tr_name 
         FROM TOURNAMENT_TEAM T
         JOIN TOURNAMENT TR ON T.tr_id = TR.tr_id
         WHERE T.team_id = ?`,
        [team_id]
      );
      res.json(rows);
    } catch (err) {
      console.error('❌ Failed to get tournaments for team:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });
  // 📌 Get full team details: manager, coach, captain, players
router.get('/:team_id/members', async (req, res) => {
    const team_id = req.params.team_id;
  
    try {
      // Get basic team info from the latest tournament it played
      const [[teamInfo]] = await db.promise().query(
        `SELECT TT.team_id, T.team_name, TT.team_group, TT.match_played, TT.tr_id
         FROM TOURNAMENT_TEAM TT
         JOIN TEAM T ON T.team_id = TT.team_id
         WHERE TT.team_id = ?
         ORDER BY TT.tr_id DESC LIMIT 1`, [team_id]
      );
      if (!teamInfo) return res.status(404).json({ error: 'Team not found in any tournament.' });
  
      const tr_id = teamInfo.tr_id;
  
      // Manager
      const [[manager]] = await db.promise().query(
        `SELECT P.name FROM TEAM_SUPPORT TS
         JOIN PERSON P ON TS.support_id = P.kfupm_id
         WHERE TS.team_id = ? AND TS.tr_id = ? AND TS.support_type = 'CH'`, [team_id, tr_id]
      );
  
      // Coach
      const [[coach]] = await db.promise().query(
        `SELECT P.name FROM TEAM_SUPPORT TS
         JOIN PERSON P ON TS.support_id = P.kfupm_id
         WHERE TS.team_id = ? AND TS.tr_id = ? AND TS.support_type = 'AC'`, [team_id, tr_id]
      );
  
      // Captain
      const [[captain]] = await db.promise().query(
        `SELECT P.name FROM MATCH_CAPTAIN MC
         JOIN PLAYER PL ON MC.player_captain = PL.player_id
         JOIN PERSON P ON PL.player_id = P.kfupm_id
         WHERE MC.team_id = ? ORDER BY match_no DESC LIMIT 1`, [team_id]
      );
  
      // Players
      const [players] = await db.promise().query(
        `SELECT P.name, PL.jersey_no, PP.position_desc
         FROM TEAM_PLAYER TP
         JOIN PLAYER PL ON TP.player_id = PL.player_id
         JOIN PERSON P ON TP.player_id = P.kfupm_id
         JOIN PLAYING_POSITION PP ON PL.position_to_play = PP.position_id
         WHERE TP.team_id = ? AND TP.tr_id = ?`, [team_id, tr_id]
      );
  
      res.json({
        team_name: teamInfo.team_name,
        group: teamInfo.team_group,
        matchesPlayed: teamInfo.match_played,
        manager: manager ? manager.name : 'Not Assigned',
        coach: coach ? coach.name : 'Not Assigned',
        captain: captain ? captain.name : 'Not Assigned',
        players
      });
  
    } catch (err) {
      console.error('❌ Error fetching team members:', err);
      res.status(500).json({ error: 'Server error fetching team details' });
    }
  });
  

// ✅ POST add a team to a tournament
router.post('/add', async (req, res) => {
  const {
    tournament, teamId, teamName, group,
    coachName, coachPhone, managerName, managerPhone, address
  } = req.body;

  try {
    // Check if tournament exists
    const [tournamentExists] = await db.promise().query(
      'SELECT tr_id FROM TOURNAMENT WHERE tr_name = ?',
      [tournament]
    );

    if (tournamentExists.length === 0) {
      return res.status(400).json({ error: 'Tournament not found. Please add it first.' });
    }

    const tr_id = tournamentExists[0].tr_id;

    // Insert into TEAM
    await db.promise().query(
      'INSERT INTO TEAM (team_id, team_name) VALUES (?, ?)',
      [teamId, teamName]
    );

    // Insert into TOURNAMENT_TEAM
    await db.promise().query(
      `INSERT INTO TOURNAMENT_TEAM 
        (team_id, tr_id, team_group, match_played, won, draw, lost, goal_for, goal_against, goal_diff, points, group_position)
        VALUES (?, ?, ?, 0, 0, 0, 0, 0, 0, 0, 0, 0)`,
      [teamId, tr_id, group]
    );

    res.json({ message: 'Team successfully added to tournament!' });
  } catch (err) {
    console.error('❌ Error adding team:', err);
    res.status(500).json({ error: 'Server error while adding team.' });
  }
});

module.exports = router;