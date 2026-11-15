const mongoose = require('mongoose');

const ElderlyProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
      default: 'Prefer not to say',
    },
    bloodGroup: {
      type: String,
      trim: true,
      default: 'Unknown',
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: 'Chennai' },
      state: { type: String, default: 'Tamil Nadu' },
      postalCode: { type: String, default: '' },
    },
    emergencyContact: {
      name: { type: String, default: '' },
      relationship: { type: String, default: 'Family' },
      phone: { type: String, default: '' },
      email: { type: String, default: '' },
    },
    medicalConditions: {
      type: [String],
      default: [],
    },
    allergies: {
      type: [String],
      default: [],
    },
    notes: {
      type: String,
      default: '',
    },
    accessPasscode: {
      type: String,
      unique: true,
      required: true,
      default: () => Math.floor(100000 + Math.random() * 900000).toString(),
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ElderlyProfile', ElderlyProfileSchema);
