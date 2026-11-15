const mongoose = require('mongoose');
const crypto = require('crypto');

const MedicationLogSchema = new mongoose.Schema(
  {
    medicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medication',
      required: true,
    },
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
    medicationName: {
      type: String,
      required: true,
    },
    dosage: {
      type: String,
      required: true,
    },
    scheduledDate: {
      type: String, // YYYY-MM-DD in IST
      required: true,
    },
    scheduledTime: {
      type: String, // HH:mm in IST (e.g. "08:00")
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'taken', 'missed', 'unconfirmed', 'skipped'],
      default: 'pending',
    },
    reason: {
      type: String,
      default: '',
    },
    confirmedAt: {
      type: Date,
    },
    confirmedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    confirmedMethod: {
      type: String,
      enum: ['dashboard', 'one_click_email', 'voice_assistant', 'caretaker_override'],
      default: 'dashboard',
    },
    confirmationToken: {
      type: String,
      unique: true,
      sparse: true,
      default: () => crypto.randomBytes(24).toString('hex'),
    },
    tokenExpiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours expiry
    },
    reminderSentAt: {
      type: Date,
    },
    alertSentAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure uniqueness for a scheduled dose on a specific date/time
MedicationLogSchema.index(
  { medicationId: 1, scheduledDate: 1, scheduledTime: 1 },
  { unique: true }
);

module.exports = mongoose.model('MedicationLog', MedicationLogSchema);
