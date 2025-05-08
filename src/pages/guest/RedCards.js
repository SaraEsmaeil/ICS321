import React, { useEffect, useState } from 'react';
import './RedCards.css';
import { FaRegTimesCircle } from 'react-icons/fa';

const RedCards = () => {
  const [redCards, setRedCards] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/stats/red-cards')
      .then(res => res.json())
      .then(data => setRedCards(data))
      .catch(err => console.error('Fetch error:', err));
  }, []);

  return (
    <div className="red-cards-container">
      <h1 className="red-cards-title">Players with Red Cards</h1>

      <div className="red-cards-list">
        {redCards.length === 0 ? (
          <p>No red cards issued.</p>
        ) : (
          redCards.map((player, index) => (
            <div className="red-card" key={index}>
              <div className="card-header">
                <FaRegTimesCircle className="red-card-icon" color="#D00000" />
                <div className="player-info">
                  <h2>{player.name}</h2>
                  <div className="team-match">
                    <span className="team">Team #{player.team_id}</span>
                    <span className="match">Player ID: {player.player_id}</span>
                  </div>
                </div>
              </div>

              <div className="card-details">
                <div className="card-badge">
                  <span className="badge-label">RED —</span>
                  <span className="badge-time">{player.booking_time}'</span>
                  <span className="badge-half">| Play Half: {player.play_half}</span>
                </div>
                <div className="match-context">
                  <span className="match-id">Match #{player.match_no}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RedCards;
