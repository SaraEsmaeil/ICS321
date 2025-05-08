import React, { useState } from 'react';
import axios from 'axios';
import './GuestJoinRequestForm.css';

const GuestJoinRequestForm = () => {
  const [playerId, setPlayerId] = useState('');
  const [teamId, setTeamId] = useState('');
  const [tournamentId, setTournamentId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/joinRequests/request', {
        player_id: playerId,
        team_id: teamId,
        tr_id: tournamentId
      });
      alert(response.data.message || 'Request submitted!');
      setPlayerId('');
      setTeamId('');
      setTournamentId('');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Submission failed.');
    }
  };

  return (
    <div className="join-request-container">
      <div className="join-request-card">
        <h2 className="join-request-title">Request to Join Team</h2>
        <p className="join-request-subtitle">Fill in the required information to submit your join request</p>
        
        <form onSubmit={handleSubmit} className="join-request-form">
          <div className="form-group">
            <label htmlFor="playerId" className="form-label">Player ID</label>
            <input
              id="playerId"
              type="text"
              value={playerId}
              onChange={e => setPlayerId(e.target.value)}
              placeholder="Enter your Player ID"
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="teamId" className="form-label">Team ID</label>
            <input
              id="teamId"
              type="text"
              value={teamId}
              onChange={e => setTeamId(e.target.value)}
              placeholder="Enter Team ID"
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="tournamentId" className="form-label">Tournament ID</label>
            <input
              id="tournamentId"
              type="text"
              value={tournamentId}
              onChange={e => setTournamentId(e.target.value)}
              placeholder="Enter Tournament ID"
              className="form-input"
              required
            />
          </div>
          
          <button type="submit" className="submit-button">Submit Request</button>
        </form>
      </div>
    </div>
  );
};

export default GuestJoinRequestForm;