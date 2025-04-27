import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import StudentProfile from './components/StudentProfile';
import SponsorDashboard from './components/SponsorDashboard';
import CoordinatorPanel from './components/CoordinatorPanel';
import Login from './components/Login';
import ApplicationForm from './components/ApplicationForm';
import MessageCenter from './components/MessageCenter';
import './assets/styles.css';

const App = () => {
  return (
    <Router>
      <div>
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
};

export default App;