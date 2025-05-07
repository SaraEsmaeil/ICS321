import React from 'react';
import './SidebarNav.css';
import { Link } from 'react-router-dom'; 
import logo from '../assets/LogoHome.png';
import {
  FaTrophy, FaThList, FaUserTie, FaUserCheck,
  FaCalendarAlt, FaClipboardList, FaRegIdCard, FaStar,
  FaTrash, FaMapMarkedAlt, FaEye, FaSignOutAlt // <- Added logout icon
} from 'react-icons/fa';

const SidebarNav = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={logo} alt="Logo" className="sidebar-logo" />
        <h2>Tournament Hub</h2>
      </div>
      <ul>
        <li>
          <Link to="/admin/add-tournament"><FaTrophy /> <span>Add Tournament</span></Link>
        </li>
        <li>
          <Link to="/admin/view-tournaments"><FaEye /><span>View Tournaments</span></Link>
        </li>
        <li>
          <Link to="/admin/add-team"><FaThList /> <span>Add Team</span></Link>
        </li>
        
        <li>
          <Link to="/admin/assign-captain"><FaUserTie /> <span>Assign Captain</span></Link>
        </li>
        <li>
          <Link to="/admin/approve-player"><FaUserCheck /> <span>Approve Player</span></Link>
        </li>
        <li>
          <Link to="/admin/schedule-match"><FaCalendarAlt /> <span>Schedule Match</span></Link>
        </li>
        <li>
          <Link to="/admin/enter-results"><FaClipboardList /> <span>Enter Match Results</span></Link>
        </li>
        <li>
          <Link to="/admin/card-management"><FaRegIdCard /> <span>Card Management</span></Link>
        </li>
        <li className="delete">
          <Link to="/admin/delete-tournament"><FaTrash /> <span>Delete Tournament</span></Link>
        </li>
        <li>
          <Link to="/admin/fields"><FaMapMarkedAlt /> <span>Fields</span></Link>
        </li>
        <li className="logout">
          <Link to="/"><FaSignOutAlt /> <span>Logout</span></Link>
        </li>
      </ul>
    </div>
  );
};

export default SidebarNav;
