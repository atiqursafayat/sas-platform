import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import io from 'socket.io-client';

const socket = io();

const MessageCenter = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState({ receiverId: '', content: '' });
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/api/messages/${localStorage.getItem('userId')}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setMessages(res.data);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };
    fetchMessages();

    socket.on('notification', (data) => {
      if (data.userId === localStorage.getItem('userId')) {
        setNotifications([...notifications, data.message]);
      }
    });

    return () => socket.off('notification');
  }, [notifications]);

  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/messages', newMessage, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessages([...messages, { ...newMessage, timestamp: new Date() }]);
      setNewMessage({ receiverId: '', content: '' });
    } catch (err) {
      alert(t('message_error'));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">{t('message_center')}</h2>
      <form onSubmit={sendMessage} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">{t('receiver_id')}</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            value={newMessage.receiverId}
            onChange={(e) => setNewMessage({ ...newMessage, receiverId: e.target.value })}
            aria-label={t('receiver_id')}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">{t('message')}</label>
          <textarea
            className="w-full p-2 border rounded-md"
            value={newMessage.content}
            onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
            aria-label={t('message')}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
        >
          {t('send')}
        </button>
      </form>
      <h3 className="text-lg font-semibold mt-4">{t('messages')}</h3>
      <ul className="space-y-2">
        {messages.map(msg => (
          <li key={msg.id} className="p-2 border rounded-md">
            {msg.content} - {new Date(msg.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>
      <h3 className="text-lg font-semibold mt-4">{t('notifications')}</h3>
      <ul className="space-y-2">
        {notifications.map((note, idx) => (
          <li key={idx} className="p-2 bg-yellow-100 rounded-md">{note}</li>
        ))}
      </ul>
    </div>
  );
};

export default MessageCenter;