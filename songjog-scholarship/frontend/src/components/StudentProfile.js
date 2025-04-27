import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const StudentProfile = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: { city: '', details: '' }, dob: '',
    academic_records: [{ semester: '', gpa: '', field: '' }], financial_status: { income: '', need_statement: '' },
    bio: '', goals: ''
  });
  const [files, setFiles] = useState({ certificates: [], profile_picture: null });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/api/students/${localStorage.getItem('userId')}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setFormData(res.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, JSON.stringify(formData[key]));
    });
    files.certificates.forEach(file => data.append('certificates', file));
    if (files.profile_picture) data.append('profile_picture', files.profile_picture);
    try {
      await axios.post('/api/students', data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert(t('profile_saved'));
    } catch (err) {
      alert(t('profile_error'));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">{t('student_profile')}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">{t('name')}</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            aria-label={t('name')}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">{t('email')}</label>
          <input
            type="email"
            className="w-full p-2 border rounded-md"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            aria-label={t('email')}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">{t('phone')}</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            aria-label={t('phone')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">{t('city')}</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            value={formData.address.city}
            onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
            aria-label={t('city')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">{t('bio')}</label>
          <textarea
            className="w-full p-2 border rounded-md"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            aria-label={t('bio')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">{t('certificates')}</label>
          <input
            type="file"
            className="w-full p-2 border rounded-md"
            multiple
            onChange={(e) => setFiles({ ...files, certificates: [...e.target.files] })}
            accept=".pdf,.jpg,.jpeg,.png"
            aria-label={t('certificates')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">{t('profile_picture')}</label>
          <input
            type="file"
            className="w-full p-2 border rounded-md"
            onChange={(e) => setFiles({ ...files, profile_picture: e.target.files[0] })}
            accept=".jpg,.jpeg,.png"
            aria-label={t('profile_picture')}
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
          {t('save')}
        </button>
      </form>
    </div>
  );
};

export default StudentProfile;