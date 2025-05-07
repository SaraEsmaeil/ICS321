import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { format } from 'date-fns';

const ViewTournament = () => {
  const [tournaments, setTournaments] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('http://localhost:3001/tournaments/list')
      .then(res => res.json())
      .then(data => setTournaments(data))
      .catch(err => console.error('Error fetching tournaments:', err));
  }, []);

  const filterTournaments = () => {
    const currentDate = new Date();
    return tournaments.filter(t => {
      const start = new Date(t.start_date);
      const end = new Date(t.end_date);

      if (filter === 'future') return start > currentDate;
      if (filter === 'ongoing') return start <= currentDate && end >= currentDate;
      if (filter === 'finished') return end < currentDate;
      return true;
    });
  };

  const getStatus = (tournament) => {
    const current = new Date();
    const start = new Date(tournament.start_date);
    const end = new Date(tournament.end_date);

    if (start > current) return 'future';
    if (end < current) return 'finished';
    return 'ongoing';
  };

  const statusColors = {
    future: 'primary',
    ongoing: 'success',
    finished: 'secondary'
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-center" style={{ color: '#002B5B' }}>Tournament Viewer</h1>

      <div className="row mb-4">
        <div className="col-md-6 mx-auto">
          <div className="d-flex gap-2 justify-content-center">
            {['all', 'future', 'ongoing', 'finished'].map((f) => (
              <button
                key={f}
                className={`btn btn-${f === filter ? (statusColors[f] || 'dark') : 'outline-dark'}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {filterTournaments().map((tournament) => (
          <div className="col" key={tournament.tr_id}>
            <div className="card h-100 shadow-sm border-0">
              <div className="card-header" style={{ backgroundColor: '#002B5B', color: 'white' }}>
                <h5 className="mb-0">{tournament.tr_name}</h5>
              </div>

              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className={`badge bg-${statusColors[getStatus(tournament)]}`}>
                    {getStatus(tournament).toUpperCase()}
                  </span>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between">
                    <div>
                      <small className="text-muted">Starts:</small>
                      <div className="fw-bold">
                        {format(new Date(tournament.start_date), 'MMM dd, yyyy')}
                      </div>
                    </div>
                    <div>
                      <small className="text-muted">Ends:</small>
                      <div className="fw-bold">
                        {format(new Date(tournament.end_date), 'MMM dd, yyyy')}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="progress" style={{ height: '5px' }}>
                  <div
                    className={`progress-bar bg-${statusColors[getStatus(tournament)]}`}
                    style={{
                      width:
                        getStatus(tournament) === 'finished'
                          ? '100%'
                          : getStatus(tournament) === 'ongoing'
                          ? '50%'
                          : '30%'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewTournament;
