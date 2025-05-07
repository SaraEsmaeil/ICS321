import React, { useState } from 'react';
import './AddTournament.css';
import { FaPlus } from 'react-icons/fa';

const AddTournament = () => {
  const [formData, setFormData] = useState({
    tr_id: '',
    tr_name: '',
    start_date: '',
    end_date: ''
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/tournaments/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({ tr_id: '', tr_name: '', start_date: '', end_date: '' });
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert(data.error || 'Error adding tournament');
      }
    } catch (err) {
      console.error('Error submitting:', err);
      alert('Server error.');
    }
  };

  return (
    <div className="add-tournament-container">
      <div className="form-card">
        <h2 className="form-title">Add New Tournament</h2>
        {success && <p className="success-message">✅ Tournament added successfully!</p>}

        <form onSubmit={handleSubmit}>
          <label>Tournament ID</label>
          <input
            type="number"
            name="tr_id"
            placeholder="Enter tournament ID"
            value={formData.tr_id}
            onChange={handleChange}
            required
          />

          <label>Tournament Name</label>
          <input
            type="text"
            name="tr_name"
            placeholder="Enter tournament name"
            value={formData.tr_name}
            onChange={handleChange}
            required
          />

          <div className="date-fields">
            <div>
              <label>Start Date</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>End Date</label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-submit">
            <FaPlus /> Add Tournament
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTournament;
