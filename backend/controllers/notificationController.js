const Notification = require('../models/Notification');

// controllers/NotificationController.js
exports.createNotification = async ({ recipientId, senderId, type, message, postId }) => {
  try {
    const notification = new Notification({
      user: recipientId,             // recipient
      fromUser: senderId,            // sender
      type,
      content: message,              // content field, not message
      relatedId: postId || null,     // match your schema
    });

    await notification.save();
  } catch (err) {
    console.error('Error creating notification:', err.message);
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notifications', error: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    console.log('Notification User:', notification.user.toString());
    console.log('Request User:', req.user.id);

    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    notification.read = true;
    await notification.save();
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Error marking notification', error: err.message });
  }
};
