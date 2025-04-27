import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SponsorDashboard = () => {
  const { t } = useTranslation();
  const [students, setStudents] = useState([]);
  const [analytics, setAnalytics] = useState({ labels: [], datasets: [] });
  const [search, setSearch] = useState('');
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, matchesRes] = await Promise.all([
          axios.get('/api/students', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
          axios.post('/api/match', { sponsorId: localStorage.getItem('userId') }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
        ]);
        setStudents(studentsRes.data);
        setMatches(matchesRes.data);
        setAnalytics({
          labels: studentsRes.data.map(s => s.name),
          datasets: [{
            label: t('gpa_trend'),
            data: studentsRes.data.map(s => s.academic_records?.[0]?.gpa || 0),
            borderColor: 'blue',
            fill: false,
          }],
        });
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, [t]);

  const sponsorStudent = async (studentId) => {
    try {
      await axios.post('/api/sponsors/sponsor', { sponsorId: localStorage.getItem('userId'), studentId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert(t('sponsor_success'));
    } catch (err) {
      alert(t('sponsor_error'));
    }
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.academic_records?.field?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">{t('sponsor_dashboard')}</h2>
      <input
        type="text"
        className="w-full p-2 border rounded-md mb-4"
        placeholder={t('search_students')}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label={t('search_students')}
      />
      <h3 className="text-lg font-semibold mb-2">{t('recommended_students')}</h3>
      <ul className="space-y-2">
        {matches.map(({ student, score }) => (
          <li key={student.id} className="p-2 border rounded-md flex justify-between">
            <span>{student.name} - {student.bio} (Match: {(score * 100).toFixed(0)}%)</span>
            <button
              className="bg-green-600 text-white p-1 rounded-md hover:bg-green-700"
              onClick={() => sponsorStudent(student.id)}
            >
              {t('sponsor')}
            </button>
          </li>
        ))}
      </ul>
      <h3 className="text-lg font-semibold mt-4">{t('all_students')}</h3>
      <ul className="space-y-2">
        {filteredStudents.map(student => (
          <li key={student.id} className="p-2 border rounded-md flex justify-between">
            <span>{student.name} - {student.bio}</span>
            <button
              className="bg-green-600 text-white p-1 rounded-md hover:bg-green-700"
              onClick={() => sponsorStudent(student.id)}
            >
              {t('sponsor')}
            </button>
          </li>
        ))}
      </ul>
      <h3 className="text-lg font-semibold mt-4">{t('analytics')}</h3>
      <Line data={analytics} />
    </div>
  );
};

export default SponsorDashboard;