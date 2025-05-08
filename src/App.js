import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login'; 
import AdminDashboard from './pages/Tournament_Admin/AdminDashboard';
import AddTournament from './pages/Tournament_Admin/AddTournament'; 
import ViewTournament from './pages/Tournament_Admin/ViewTournament';
import AssignCaptain from './pages/Tournament_Admin/AssignCaptain';
import AddTeam from './pages/Tournament_Admin/AddTeam';
import ScheduleMatch from './pages/Tournament_Admin/ScheduleMatch';
import EnterMatchResults from './pages/Tournament_Admin/EnterMatchResults';
import CardManagement from './pages/Tournament_Admin/CardManagement';
import Fields from './pages/Tournament_Admin/Fields';
import DeleteTournament from './pages/Tournament_Admin/DeleteTournament';
import AdminApproveRequests from './pages/Tournament_Admin/AdminApproveRequests';
import GuestDashboard from './pages/guest/GuestDashboard';
import BrowsePlayerHighestGoal from './pages/guest/BrowsePlayerHighestGoal';
import MatchResults from './pages/guest/MatchResults';
import TeamMembers from './pages/guest/TeamMembers';
import RedCards from './pages/guest/RedCards';
import GuestJoinRequestForm from './pages/guest/GuestJoinRequestForm'; 


import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* General */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Admin */}

          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/approve-requests" element={<AdminApproveRequests />} />
          <Route path="/admin/add-tournament" element={<AddTournament />} />
          <Route path="/admin/view-tournaments" element={<ViewTournament />} />
          <Route path="/admin/assign-captain" element={<AssignCaptain />} />
          <Route path="/admin/add-team" element={<AddTeam />} />
          <Route path="/admin/schedule-match" element={<ScheduleMatch />} />
          <Route path="/admin/enter-results" element={<EnterMatchResults />} />
          <Route path="/admin/card-management" element={<CardManagement />} />
          <Route path="/admin/fields" element={<Fields />} />
          <Route path="/admin/delete-tournament" element={<DeleteTournament />} />

          {/* Guest */}
          <Route path="/guest" element={<GuestDashboard />} />
          <Route path="/guest/tournaments" element={<ViewTournament />} />
          <Route path="/guest/top-scorers" element={<BrowsePlayerHighestGoal />} />
          <Route path="/guest/match-results" element={<MatchResults />} />
          <Route path="/guest/teams-players" element={<TeamMembers />} />
          <Route path="/guest/red-cards" element={<RedCards />} />
          <Route path="/guest/join" element={<GuestJoinRequestForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
