const mongoose = require('mongoose');

const CareTeamSchema = new mongoose.Schema(
  {
    elderlyProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ElderlyProfile',
      required: true,
    },
    elderlyUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    memberUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    memberRole: {
      type: String,
      enum: ['caretaker', 'family'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'revoked'],
      default: 'active',
    },
    permissions: {
      type: [String],
      default: ['view_medications', 'mark_doses', 'manage_medications', 'view_appointments', 'manage_appointments', 'receive_alerts'],
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate membership for the same elderly user and member
CareTeamSchema.index({ elderlyProfileId: 1, memberUserId: 1 }, { unique: true });

module.exports = mongoose.model('CareTeam', CareTeamSchema);
