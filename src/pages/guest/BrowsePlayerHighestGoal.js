import React, { useEffect, useState } from 'react';
import './BrowsePlayerHighestGoal.css';

const BrowsePlayerHighestGoal = () => {
  const [topScorer, setTopScorer] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/stats/top-scorer")
      .then((res) => res.json())
      .then((data) => setTopScorer(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  return (
    <div className="player-highest-goals-container">
      <h1>Top Goal Scorer</h1>

      {topScorer ? (
        <div className="player-info">
          <p><strong>Name:</strong> {topScorer.name}</p>
          <p><strong>Player ID:</strong> {topScorer.player_id}</p>
          <p><strong>Total Goals:</strong> {topScorer.goals}</p>
        </div>
      ) : (
        <p className="loading-message">Loading top scorer...</p>
      )}
    </div>
  );
};

export default BrowsePlayerHighestGoal;
