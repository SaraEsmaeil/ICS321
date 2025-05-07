import React, { useState, useEffect } from 'react';
import './ApprovePlayer.css';

const ApprovePlayer = () => {
  const [players, setPlayers] = useState([]);
  const [jerseyNumbers, setJerseyNumbers] = useState({});

  // 🔄 Load pending join requests
  useEffect(() => {
    fetch('http://localhost:3001/join_requests/pending')
      .then(res => res.json())
      .then(data => setPlayers(data))
      .catch(err => console.error('Error loading players:', err));
  }, []);

  // 🧠 Handle jersey number input for a player
  const handleJerseyChange = (playerId, value) => {
    setJerseyNumbers({ ...jerseyNumbers, [playerId]: value });
  };

  // ✅ Approve player
  const handleApprove = async (playerId, teamId, trId) => {
    const jersey_no = jerseyNumbers[playerId];
    if (!jersey_no) {
      alert('Please assign a jersey number before approving.');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/join_requests/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player_id: playerId, team_id: teamId, tr_id: trId, jersey_no })
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ Player approved and added to team!');
        setPlayers(players.filter(p => p.player_id !== playerId));
      } else {
        alert(data.error || 'Approval failed.');
      }
    } catch (err) {
      console.error('❌ Approval error:', err);
      alert('Server error.');
    }
  };

  return (
    <div className="approve-player-container">
      <h2 className="page-title">Pending Player Approvals</h2>
      <div className="player-grid">
        {players.map(player => (
          <div key={player.player_id} className="player-card">
            <h4>{player.name}</h4>
            <p className="light">Position: {player.position_to_play}</p>
            <p className="team-label">Team: <strong>{player.team_name}</strong></p>
            <p className="team-label">Tournament: <strong>{player.tr_name}</strong></p>
            <p className="pending">Requested on: {new Date(player.request_date).toLocaleDateString()}</p>
            <label>Assign Jersey Number</label>
            <input
              type="number"
              className="jersey-input"
              value={jerseyNumbers[player.player_id] || ''}
              onChange={(e) => handleJerseyChange(player.player_id, e.target.value)}
              required
            />
            <button
              className="approve-btn"
              onClick={() => handleApprove(player.player_id, player.team_id, player.tr_id)}
            >
              Approve
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApprovePlayer;
