const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema(
  {
    elderlyProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ElderlyProfile',
      required: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AuditLog', AuditLogSchema);
