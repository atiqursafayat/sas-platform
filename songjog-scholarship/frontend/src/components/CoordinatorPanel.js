import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const CoordinatorPanel = () => {
  const { t } = useTranslation();
  const [payments, setPayments] = useState([]);
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [paymentsRes, applicationsRes, usersRes] = await Promise.all([
          axios.get('/api/payments', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
          axios.get('/api/applications', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
          axios.get('/api/auth/users', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
        ]);
        setPayments(paymentsRes.data);
        setApplications(applicationsRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">{t('coordinator_panel')}</h2>
      {/* Add UI for managing payments, applications, and users */}
    </div>
  );
};

export default CoordinatorPanel;