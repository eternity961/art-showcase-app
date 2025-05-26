// src/api/notifications.js
import api from '../utils/api';
export async function fetchNotifications() {
  try {
    const response = await api.get('/api/notifications');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch notifications');
  }
}

export async function markNotificationRead(notificationId) {
  const response = await api.patch(`/api/notifications/${notificationId}/read`, {}); // empty body is fine
  return response.data;  // should be the updated notification now
}

