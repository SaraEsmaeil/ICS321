import React, { useState, useEffect } from 'react';
import './AssignCaptain.css';

const AssignCaptain = () => {
  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [formData, setFormData] = useState({ match_no: '', team_id: '', player_id: '' });

  useEffect(() => {
    fetch('http://localhost:3001/matches/list')
      .then(res => res.json())
      .then(setMatches)
      .catch(console.error);
  }, []);

  const loadPlayers = (teamId) => {
    fetch(`http://localhost:3001/players/by-team/${teamId}`)
      .then(res => res.json())
      .then(setPlayers)
      .catch(console.error);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'team_id') loadPlayers(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:3001/captain/assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (res.ok) alert(data.message);
    else alert(data.error);
  };

  return (
    <div className="assign-captain-container">
      <h2>Assign Team Captain</h2>
      <form onSubmit={handleSubmit}>
        <label>Match</label>
        <select name="match_no" onChange={handleChange} required>
          <option value="">Select Match</option>
          {matches.map(m => (
            <option key={m.match_no} value={m.match_no}>
              Match #{m.match_no} – {m.team_id1} vs {m.team_id2}
            </option>
          ))}
        </select>

        <label>Team ID</label>
        <input type="number" name="team_id" onChange={handleChange} required />

        <label>Player</label>
        <select name="player_id" onChange={handleChange} required>
          <option value="">Select Player</option>
          {players.map(p => (
            <option key={p.player_id} value={p.player_id}>
              {p.name} (#{p.jersey_no})
            </option>
          ))}
        </select>

        <button type="submit">Assign Captain</button>
      </form>
    </div>
  );
};

export default AssignCaptain;
