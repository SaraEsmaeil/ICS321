import React, { useEffect, useState } from 'react';
import './Fields.css';

const Fields = () => {
  const [venues, setVenues] = useState([]);
  const [fields] = useState([
    { id: 'Field 1' },
    { id: 'Field 2' },
    { id: 'Field 3' }
  ]);

  useEffect(() => {
    fetch('http://localhost:3001/venues')
      .then(res => res.json())
      .then(data => setVenues(data))
      .catch(err => console.error('Error fetching venues:', err));
  }, []);

  const handleAssign = async (venueId, fieldId) => {
    try {
      const res = await fetch(`http://localhost:3001/venues/${venueId}/assign-field`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fieldId })
      });

      const data = await res.json();
      if (res.ok) {
        alert(`✅ Field ${fieldId} assigned to Venue ID ${venueId}`);
        setVenues(prev =>
          prev.map(v => v.venue_id === venueId ? { ...v, venue_description: fieldId } : v)
        );
      } else {
        alert(data.error || 'Assignment failed');
      }
    } catch (err) {
      console.error('Assignment error:', err);
      alert('Server error while assigning field.');
    }
  };

  return (
    <div className="fields-container">
      <h2>Assign Fields to Venues</h2>
      <table className="fields-table">
        <thead>
          <tr>
            <th>Venue ID</th>
            <th>Venue Name</th>
            <th>Current Field</th>
            <th>Status</th>
            <th>Assign Field</th>
          </tr>
        </thead>
        <tbody>
          {venues.map(venue => (
            <tr key={venue.venue_id}>
              <td>{venue.venue_id}</td>
              <td>{venue.venue_name}</td>
              <td>{venue.venue_description || '-'}</td>
              <td>
                <span className={venue.venue_status === 'Y' ? 'available' : 'inactive'}>
                  {venue.venue_status === 'Y' ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td>
                <select
                  onChange={(e) => handleAssign(venue.venue_id, e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>Select Field</option>
                  {fields.map(field => (
                    <option key={field.id} value={field.id}>{field.id}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Fields;
