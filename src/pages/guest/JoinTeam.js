import React, { useState, useEffect } from 'react';
import './JoinTeam.css';

const JoinTeam = () => {
  const [formData, setFormData] = useState({
    player_id: '',
    name: '',
    date_of_birth: '',
    team_id: '',
    position_to_play: ''
  });

  const [teams, setTeams] = useState([]);
  const [tournaments, setTournaments] = useState([]);

  // 🔄 Load teams initially
  useEffect(() => {
    fetch('http://localhost:3001/teams/list')
      .then(res => res.json())
      .then(data => setTeams(data))
      .catch(err => console.error('❌ Error fetching teams:', err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/join_requests/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        alert('✅ Join request submitted successfully!');
        setFormData({
          player_id: '',
          name: '',
          date_of_birth: '',
          team_id: '',
          tr_id: '',
          position_to_play: ''
        });
        setTournaments([]);
      } else {
        alert(result.error || '❌ Submission failed.');
      }
    } catch (err) {
      console.error('❌ Error submitting form:', err);
      alert('Server error. Please try again later.');
    }
  };

  return (
    <div className="join-team-container">
      <h2>Request to Join a Team</h2>
      <form onSubmit={handleSubmit}>
        <label>Student ID</label>
        <input
          type="number"
          name="player_id"
          value={formData.player_id}
          onChange={handleChange}
          required
        />

        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Date of Birth</label>
        <input
          type="date"
          name="date_of_birth"
          value={formData.date_of_birth}
          onChange={handleChange}
          required
        />

        <label>Select Team</label>
        <select
          name="team_id"
          value={formData.team_id}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Team --</option>
          {teams.map(team => (
            <option key={team.team_id} value={team.team_id}>
              {team.team_name}
            </option>
          ))}
        </select>


        <label>Position to Play</label>
        <select
          name="position_to_play"
          value={formData.position_to_play}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Position --</option>
          <option value="GK">Goalkeeper</option>
          <option value="DF">Defender</option>
          <option value="MF">Midfielder</option>
          <option value="FD">Forward</option>
        </select>

        <button type="submit" className="btn-submit">Submit Request</button>
      </form>
    </div>
  );
};

export default JoinTeam;
