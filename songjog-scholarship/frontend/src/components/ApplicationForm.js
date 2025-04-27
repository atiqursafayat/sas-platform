import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const ApplicationForm = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ type: 'one-time', essay: '', references: [{ name: '', contact: '' }] });

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

  const addReference = () => {
    setFormData({ ...formData, references: [...formData.references, { name: '', contact: '' }] });
  };

  return (
    <div>
      <h2>{t('scholarship_application')}</h2>
      <form onSubmit={handleSubmit}>
        <label>{t('scholarship_type')}</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        >
          <option value="one-time">{t('one_time')}</option>
          <option value="monthly">{t('monthly')}</option>
        </select>
        <label>{t('essay')}</label>
        <textarea
          value={formData.essay}
          onChange={(e) => setFormData({ ...formData, essay: e.target.value })}
          required
        />
        <label>{t('references')}</label>
        {formData.references.map((ref, idx) => (
          <div key={idx}>
            <input
              type="text"
              value={ref.name}
              onChange={(e) => {
                const newRefs = [...formData.references];
                newRefs[idx].name = e.target.value;
                setFormData({ ...formData, references: newRefs });
              }}
              placeholder={t('reference_name')}
            />
            <input
              type="text"
              value={ref.contact}
              onChange={(e) => {
                const newRefs = [...formData.references];
                newRefs[idx].contact = e.target.value;
                setFormData({ ...formData, references: newRefs });
              }}
              placeholder={t('reference_contact')}
            />
          </div>
        ))}
        <button type="button" onClick={addReference}>{t('add_reference')}</button>
        <button type="submit">{t('submit')}</button>
      </form>
    </div>
  );
};

export default ApplicationForm;