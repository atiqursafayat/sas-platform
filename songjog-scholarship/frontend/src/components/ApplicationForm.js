import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const ApplicationForm = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    type: 'one-time',
    essay: '',
    references: [{ name: '', contact: '' }]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/applications', {
        studentId: localStorage.getItem('userId'),
        type: formData.type,
        essay: formData.essay,
        references: formData.references
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert(t('application_submitted'));
    } catch (err) {
      alert(t('application_error'));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">{t('scholarship_application')}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">{t('scholarship_type')}</label>
          <select
            className="w-full p-2 border rounded-md"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            aria-label={t('scholarship_type')}
          >
            <option value="one-time">{t('one_time')}</option>
            <option value="monthly">{t('monthly')}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">{t('essay')}</label>
          <textarea
            className="w-full p-2 border rounded-md"
            value={formData.essay}
            onChange={(e) => setFormData({ ...formData, essay: e.target.value })}
            aria-label={t('essay')}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
        >
          {t('submit')}
        </button>
      </form>
    </div>
  );
};

export default ApplicationForm;