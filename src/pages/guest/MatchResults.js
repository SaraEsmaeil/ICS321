import React, { useEffect, useState } from 'react';
import './MatchResults.css';

const MatchResults = () => {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState('');
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/tournaments/list')
      .then(res => res.json())
      .then(data => setTournaments(data))
      .catch(err => console.error('Error fetching tournaments:', err));
  }, []);

  const handleTournamentChange = (e) => {
    const tr_id = e.target.value;
    setSelectedTournament(tr_id);
    fetch(`http://localhost:3001/matches/by-tournament/${tr_id}`)
      .then(res => res.json())
      .then(data => setMatches(data))
      .catch(err => console.error('Error fetching match results:', err));
  };

  return (
    <div className="match-results-container">
      <h1 className="page-title">Match Results</h1>

      <label>Select Tournament</label>
      <select
        value={selectedTournament}
        onChange={handleTournamentChange}
        className="tournament-select"
      >
        <option value="">-- Select a Tournament --</option>
        {tournaments.map(t => (
          <option key={t.tr_id} value={t.tr_id}>{t.tr_name}</option>
        ))}
      </select>

      <div className="matches-grid">
        {matches.map(match => (
          <div key={match.match_no} className="match-card">
            <div className="match-header">
              <span className="team-name">{match.team1_name}</span>
              <div className="match-center">
                <span className="match-status">FT</span>
                <div className="score">{match.score}</div>
                <span className="match-date">{new Date(match.play_date).toLocaleDateString()}</span>
              </div>
              <span className="team-name">{match.team2_name}</span>
            </div>

            <div className="match-details">
              {match.goals.length > 0 ? (
                <div className="goals-column">
                  {match.goals.map((goal, index) => (
                    <div key={index} className="goal-event">
                      <span className="goal-time">{goal.goal_time}'</span>
                      <span className="scorer">{goal.player_name} #{goal.jersey_no}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-goals">No goals scored in this match</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchResults;
