import React, { createContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      const newSocket = io(process.env.REACT_APP_SOCKET_URL, {
        auth: { token },
      });
      setSocket(newSocket);
      newSocket.on('connect', () => {
        newSocket.emit('join', parsedUser.id);
      });
      newSocket.on('notification', (notification) => {
        setNotifications((prev) => [notification, ...prev]);
      });
      return () => newSocket.disconnect();
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    const newSocket = io(process.env.REACT_APP_SOCKET_URL, {
      auth: { token },
    });
    setSocket(newSocket);
    newSocket.emit('join', userData.id);
    newSocket.on('notification', (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    if (socket) socket.disconnect();
    setSocket(null);
    setNotifications([]);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, socket, notifications, setNotifications }}>
      {children}
    </AuthContext.Provider>
  );
};