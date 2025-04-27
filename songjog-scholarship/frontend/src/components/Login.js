import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.userId);
      history.push(`/${res.data.role}`);
    } catch (err) {
      alert(t('login_error'));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4">{t('login')}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <label className="block text-sm font-medium">{t('password')}</label>
          <input
            type="password"
            className="w-full p-2 border rounded-md"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            aria-label={t('password')}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
        >
          {t('login')}
        </button>
      </form>
    </div>
  );
};

export default Login;