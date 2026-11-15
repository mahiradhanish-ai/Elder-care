const mongoose = require('mongoose');

const MedicationSchema = new mongoose.Schema(
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
    name: {
      type: String,
      required: [true, 'Please provide medication name'],
      trim: true,
    },
    dosage: {
      type: String,
      required: [true, 'Please provide dosage (e.g., 500mg, 1 tablet)'],
      trim: true,
    },
    frequency: {
      type: String,
      required: true,
      default: 'Once Daily',
    },
    times: {
      type: [String],
      required: [true, 'Please provide at least one scheduled time'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'At least one scheduled time (HH:mm) is required',
      },
    },
    instructions: {
      type: String,
      default: 'Take with water after food',
    },
    prescribingDoctor: {
      type: String,
      default: 'Primary Care Physician',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    colorTag: {
      type: String,
      default: '#0c87eb',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Medication', MedicationSchema);
