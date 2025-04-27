import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      login: 'Login',
      email: 'Email',
      password: 'Password',
      student_profile: 'Student Profile',
      sponsor_dashboard: 'Sponsor Dashboard',
      coordinator_panel: 'Coordinator Panel',
      scholarship_application: 'Scholarship Application',
      message_center: 'Message Center',
      save: 'Save',
      submit: 'Submit',
      send: 'Send',
      search_students: 'Search Students',
      recommended_students: 'Recommended Students',
      all_students: 'All Students',
      analytics: 'Analytics',
      profile_saved: 'Profile saved successfully!',
      profile_error: 'Error saving profile.',
      sponsor_success: 'Student sponsored successfully!',
      sponsor_error: 'Error sponsoring student.',
      application_submitted: 'Application submitted successfully!',
      application_error: 'Error submitting application.',
      message_error: 'Error sending message.',
      notifications: 'Notifications',
      messages: 'Messages',
      receiver_id: 'Receiver ID',
      message: 'Message',
      scholarship_type: 'Scholarship Type',
      one_time: 'One-Time',
      monthly: 'Monthly',
      essay: 'Essay',
      city: 'City',
      bio: 'Bio',
      certificates: 'Certificates',
      profile_picture: 'Profile Picture',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;