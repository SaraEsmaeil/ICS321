import React, { useState, useEffect } from 'react';
import './AddTeam.css';

const AddTeam = () => {
  const [formData, setFormData] = useState({
    tournament: '',
    teamName: '',
    teamId: '',
    group: ''
  });

  const [tournaments, setTournaments] = useState([]);

  // 🔄 Fetch tournament list from backend
  useEffect(() => {
    fetch('http://localhost:3001/tournaments/list')
      .then(res => res.json())
      .then(data => setTournaments(data))
      .catch(err => console.error('Error fetching tournaments:', err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/teams/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error adding team. Please try again.');
    }
  };

  return (
    <div className="add-team-container">
      <div className="form-card">
        <h2 className="form-title">Add Team to Tournament</h2>
        <form onSubmit={handleSubmit}>
          <label>Tournament</label>
          <select name="tournament" value={formData.tournament} onChange={handleChange} required>
            <option value="">Select Tournament</option>
            {tournaments.map(t => (
              <option key={t.tr_id} value={t.tr_name}>{t.tr_name}</option>
            ))}
          </select>

          <label>Team Name</label>
          <input
            type="text"
            name="teamName"
            placeholder="Team Name"
            value={formData.teamName}
            onChange={handleChange}
            required
          />

          <label>Team ID</label>
          <input
            type="text"
            name="teamId"
            placeholder="Team ID"
            value={formData.teamId}
            onChange={handleChange}
            required
          />

          <label>Group</label>
          <select name="group" value={formData.group} onChange={handleChange} required>
            <option value="">Select Group</option>
            <option value="A">Group A</option>
            <option value="B">Group B</option>
            <option value="C">Group C</option>
          </select>

          <div className="form-buttons">
            <button type="submit" className="btn-primary">Submit</button>
            <button
              type="reset"
              className="btn-secondary"
              onClick={() =>
                setFormData({ tournament: '', teamName: '', teamId: '', group: '' })
              }
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTeam;
