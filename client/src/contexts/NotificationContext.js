// src/contexts/NotificationContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { fetchNotifications, markNotificationRead } from '../api/notifications';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();

    // Optional: Poll every 30 seconds for new notifications
    const interval = setInterval(() => {
      loadNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, [loadNotifications]);

  const markAsRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, loading, loadNotifications, markAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
