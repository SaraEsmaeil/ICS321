import './SidebarNav.css';
import React from 'react';
import { Link } from 'react-router-dom'; 
import logo from '../assets/LogoHome.png';

import { 
  FaTrophy,       
  FaFutbol,       
  FaSitemap,      
  FaSquareFull,   
  FaUsers,        
  FaUserPlus 
} from 'react-icons/fa';

const GuestSideBarNav = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={logo} alt="Logo" className="sidebar-logo" />
        <h2>Tournament Hub</h2>
      </div>
      <ul>
        <li>
          <Link to="/guest/tournaments">
            <FaTrophy /> <span>View Tournaments</span>
          </Link>
        </li>
        <li>
          <Link to="/guest/results">
            <FaFutbol /> <span>Match Results</span>
          </Link>
        </li>
        <li>
          <Link to="/guest/top-scorers">
            <FaSitemap /> <span>Top Scorers</span>
          </Link>
        </li>
        <li>
          <Link to="/guest/red-cards" className="red-card-link">
            <FaSquareFull style={{ color: 'red' }} /> <span>Red Cards</span>
          </Link>
        </li>
        <li>
          <Link to="/guest/teams-players">
            <FaUsers /> <span>Teams & Players</span>
          </Link>
        </li>
        <li>
          <Link to="/guest/join">
            <FaUserPlus /> <span>Join a Team</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default GuestSideBarNav;
