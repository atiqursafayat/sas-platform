import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const CoordinatorPanel = () => {
  const { t } = useTranslation();
  const [payments, setPayments] = useState([]);
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [reportFormat, setReportFormat] = useState('json');

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

  const approvePayment = async (id) => {
    try {
      await axios.post('/api/payments/approve', { paymentId: id }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPayments(payments.map(p => p.id === id ? { ...p, status: 'completed' } : p));
    } catch (err) {
      alert(t('payment_error'));
    }
  };

  const reviewApplication = async (id, status, comments, assignedSponsorId) => {
    try {
      await axios.post('/api/applications/review', { applicationId: id, status, comments, assignedSponsorId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setApplications(applications.map(a => a.id === id ? { ...a, status, comments, assignedSponsorId } : a));
    } catch (err) {
      alert(t('application_error'));
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`/api/auth/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      alert(t('user_error'));
    }
  };

  const downloadReport = async (type) => {
    try {
      const res = await axios.get(`/api/reports/${type}?format=${reportFormat}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}.${reportFormat}`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert(t('report_error'));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">{t('coordinator_panel')}</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium">{t('report_format')}</label>
        <select
          className="p-2 border rounded-md"
          value={reportFormat}
          onChange={(e) => setReportFormat(e.target.value)}
        >
          <option value="json">JSON</option>
          <option value="csv">CSV</option>
          <option value="pdf">PDF</option>
        </select>
        <button
          className="ml-2 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
          onClick={() => downloadReport('payments')}
        >
          {t('download_payment_report')}
        </button>
        <button
          className="ml-2 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
          onClick={() => downloadReport('students')}
        >
          {t('download_student_report')}
        </button>
      </div>
      <h3 className="text-lg font-semibold mb-2">{t('payments')}</h3>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">{t('student')}</th>
            <th className="p-2">{t('sponsor')}</th>
            <th className="p-2">{t('amount')}</th>
            <th className="p-2">{t('status')}</th>
            <th className="p-2">{t('action')}</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(payment => (
            <tr key={payment.id} className="border-b">
              <td className="p-2">{payment.Student?.name}</td>
              <td className="p-2">{payment.Sponsor?.name}</td>
              <td className="p-2">{payment.amount}</td>
              <td className="p-2">{payment.status}</td>
              <td className="p-2">
                {payment.status === 'pending' && (
                  <button
                    className="bg-green-600 text-white p-1 rounded-md hover:bg-green-700"
                    onClick={() => approvePayment(payment.id)}
                  >
                    {t('approve')}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3 className="text-lg font-semibold mt-4 mb-2">{t('applications')}</h3>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">{t('student')}</th>
            <th className="p-2">{t('type')}</th>
            <th className="p-2">{t('status')}</th>
            <th className="p-2">{t('action')}</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(app => (
            <tr key={app.id} className="border-b">
              <td className="p-2">{app.Student?.name}</td>
              <td className="p-2">{app.type}</td>
              <td className="p-2">{app.status}</td>
              <td className="p-2">
                <button
                  className="bg-blue-600 text-white p-1 rounded-md hover:bg-blue-700 mr-2"
                  onClick={() => reviewApplication(app.id, 'approved', 'Approved', app.assignedSponsorId)}
                >
                  {t('approve')}
                </button>
                <button
                  className="bg-red-600 text-white p-1 rounded-md hover:bg-red-700"
                  onClick={() => reviewApplication(app.id, 'rejected', 'Rejected', null)}
                >
                  {t('reject')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3 className="text-lg font-semibold mt-4 mb-2">{t('users')}</h3>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">{t('email')}</th>
            <th className="p-2">{t('role')}</th>
            <th className="p-2">{t('action')}</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-b">
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.role}</td>
              <td className="p-2">
                <button
                  className="bg-red-600 text-white p-1 rounded-md hover:bg-red-700"
                  onClick={() => deleteUser(user.id)}
                >
                  {t('delete')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CoordinatorPanel;