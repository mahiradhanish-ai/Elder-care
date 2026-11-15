const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema(
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctorName: {
      type: String,
      required: [true, 'Please provide doctor name'],
      trim: true,
    },
    specialty: {
      type: String,
      default: 'General Physician',
      trim: true,
    },
    hospitalOrClinic: {
      type: String,
      required: [true, 'Please provide hospital or clinic name'],
      trim: true,
    },
    date: {
      type: String, // YYYY-MM-DD in IST
      required: [true, 'Please provide appointment date'],
    },
    time: {
      type: String, // HH:mm in IST
      required: [true, 'Please provide appointment time'],
    },
    purpose: {
      type: String,
      default: 'Routine health checkup',
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['upcoming', 'completed', 'cancelled'],
      default: 'upcoming',
    },
    reminderSentAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Appointment', AppointmentSchema);
