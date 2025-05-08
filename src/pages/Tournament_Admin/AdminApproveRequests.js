import React, { useState, useEffect } from 'react';
import './AdminApproveRequests.css';

const AdminApproveRequests = () => {
  const [players, setPlayers] = useState([]);
  const [jerseyNumbers, setJerseyNumbers] = useState({});
  const [availableJerseys, setAvailableJerseys] = useState({});

  useEffect(() => {
    fetch('http://localhost:3001/joinRequests/pending')
      .then(res => res.json())
      .then(data => {
        setPlayers(data);
        data.forEach(player => fetchAvailableJerseys(player));
      })
      .catch(err => console.error('Error loading players:', err));
  }, []);

  const fetchAvailableJerseys = async (player) => {
    try {
      const res = await fetch(`http://localhost:3001/joinRequests/available-jerseys?team_id=${player.team_id}&tr_id=${player.tr_id}`);
      const data = await res.json();
      setAvailableJerseys(prev => ({ ...prev, [player.player_id]: data }));
    } catch (err) {
      console.error('Error fetching jersey numbers:', err);
    }
  };

  const handleJerseyChange = (playerId, value) => {
    setJerseyNumbers({ ...jerseyNumbers, [playerId]: value });
  };

  const handleApprove = async (playerId, teamId, trId, requestId) => {
    const jersey_no = jerseyNumbers[playerId];
    if (!jersey_no) {
      alert('Please assign a jersey number before approving.');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/joinRequests/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player_id: playerId,
          team_id: teamId,
          tr_id: trId,
          jersey_no
        })
      });
    

      const data = await res.json();
      if (res.ok) {
        alert('✅ Player approved and added!');
        setPlayers(players.filter(p => p.player_id !== playerId));
      } else {
        alert(data.error || 'Approval failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Server error.');
    }
  };

  return (
    <div className="approve-page">
      <h2 className="approve-title">Pending Player Approvals</h2>
      <div className="approve-grid">
        {players.map(player => (
          <div key={player.player_id} className="approve-card">
            <div className="approve-header">
            <div className="approve-avatar-text">
  {player.name.charAt(0).toUpperCase()}
</div>

              <div>
                <h4 className="approve-name">{player.name}</h4>
                <p className="approve-position">{getPositionLabel(player.position_to_play)}</p>
              </div>
            </div>
            <p className="approve-line"><strong>🧑‍🤝‍🧑 Team:</strong> {player.team_name}</p>
            <p className="approve-line"><strong>🏆 Tournament:</strong> {player.tr_name}</p>
            <p className="approve-line"><strong>📅 Requested:</strong> {new Date(player.request_date).toLocaleDateString()}</p>

            <label className="approve-label">Jersey Number</label>
            <select
              className="approve-input"
              value={jerseyNumbers[player.player_id] || ''}
              onChange={(e) => handleJerseyChange(player.player_id, e.target.value)}
            >
              <option value="">Select Jersey</option>
              {(availableJerseys[player.player_id] || []).map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>


            <button
              className="approve-button"
              onClick={() => handleApprove(player.player_id, player.team_id, player.tr_id)}
            >
              ✓ Approve Player
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const getPositionLabel = (code) => {
  switch (code) {
    case 'GK': return 'Goalkeeper';
    case 'DF': return 'Defender';
    case 'MF': return 'Midfielder';
    case 'FD': return 'Forward';
    default: return code;
  }
};

export default AdminApproveRequests;
