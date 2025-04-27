import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import StudentProfile from './components/StudentProfile';
import SponsorDashboard from './components/SponsorDashboard';
import CoordinatorPanel from './components/CoordinatorPanel';
import Login from './components/Login';
import ApplicationForm from './components/ApplicationForm';
import MessageCenter from './components/MessageCenter';
import './assets/styles.css';
import './i18n';
import io from 'socket.io-client';

const socket = io();

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div className="container mx-auto p-4">
        <header className="bg-blue-600 text-white p-4 rounded-lg mb-4">
          <h1 className="text-2xl font-bold">Songjog Scholarship Platform</h1>
        </header>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/student" component={StudentProfile} />
          <Route path="/sponsor" component={SponsorDashboard} />
          <Route path="/coordinator" component={CoordinatorPanel} />
          <Route path="/apply" component={ApplicationForm} />
          <Route path="/messages" component={MessageCenter} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;