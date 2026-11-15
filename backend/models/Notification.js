const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    recipientUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    elderlyProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ElderlyProfile',
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['reminder', 'alert', 'appointment', 'care_team', 'system'],
      default: 'reminder',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Notification', NotificationSchema);
