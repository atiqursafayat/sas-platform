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
    <div>
      <h2>{t('message_center')}</h2>
      <form onSubmit={sendMessage}>
        <label>{t('receiver_id')}</label>
        <input
          type="text"
          value={newMessage.receiverId}
          onChange={(e) => setNewMessage({ ...newMessage, receiverId: e.target.value })}
          required
        />
        <label>{t('message')}</label>
        <textarea
          value={newMessage.content}
          onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
          required
        />
        <button type="submit">{t('send')}</button>
      </form>
      <h3>{t('messages')}</h3>
      <ul>
        {messages.map((msg, idx) => (
          <li key={idx}>{msg.content} - {new Date(msg.timestamp).toLocaleString()}</li>
        ))}
      </ul>
      <h3>{t('notifications')}</h3>
      <ul>
        {notifications.map((note, idx) => (
          <li key={idx}>{note}</li>
        ))}
      </ul>
    </div>
  );
};

export default MessageCenter;