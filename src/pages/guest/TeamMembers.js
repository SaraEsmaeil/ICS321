import React, { useState, useEffect } from 'react';
import './TeamMembers.css';

const TeamMembers = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [teamData, setTeamData] = useState(null);

  // Fetch all teams for the dropdown
  useEffect(() => {
    fetch('http://localhost:3001/teams/list')
      .then(res => res.json())
      .then(data => setTeams(data))
      .catch(err => console.error('Error fetching teams:', err));
  }, []);

  // Fetch members when team is selected
  const handleTeamChange = async (e) => {
    const teamId = e.target.value;
    setSelectedTeam(teamId);

    try {
      const res = await fetch(`http://localhost:3001/teams/${teamId}/members`);
      const data = await res.json();
      setTeamData(data);
    } catch (err) {
      console.error('Error loading team members:', err);
      setTeamData(null);
    }
  };

  return (
    <div className="team-members-container">
      <h2 className="team-members-title">Browse Team Members</h2>

      <label className="team-members-label">Select a Team</label>
      <select className="team-members-select" value={selectedTeam} onChange={handleTeamChange}>
        <option value="">Select Team</option>
        {teams.map((team) => (
          <option key={team.team_id} value={team.team_id}>{team.team_name}</option>
        ))}
      </select>

      {teamData && (
        <div className="team-info">
          <h3 className="team-members-subtitle">Team Overview</h3>
          <p><strong>Team Name:</strong> {teamData.team_name}</p>
          <p><strong>Group:</strong> {teamData.group}</p>
          <p><strong>Matches Played:</strong> {teamData.matchesPlayed}</p>

          <h3 className="team-members-subtitle">Team Members</h3>

          <div className="team-role manager">
            <h4>Manager</h4>
            <p>{teamData.manager}</p>
          </div>

          <div className="team-role coach">
            <h4>Coach</h4>
            <p>{teamData.coach}</p>
          </div>

          <div className="team-role captain">
            <h4>Captain</h4>
            <p>{teamData.captain}</p>
          </div>

          <h4>Players</h4>
          {teamData.players && teamData.players.length > 0 ? (
            <ul className="players-list">
              {teamData.players.map((player, index) => (
                <li key={index} className="player-card">
                  <p>{player.name} - #{player.jersey_no} - {player.position_desc}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No players found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamMembers;