const MedicationLog = require('../models/MedicationLog');
const Medication = require('../models/Medication');
const ElderlyProfile = require('../models/ElderlyProfile');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');
const CareTeam = require('../models/CareTeam');
const { getTodayIST } = require('../utils/dateHelper');
const { sendMissedMedicationAlert } = require('../services/emailService');

// Helper to resolve elderly profile ID
const resolveElderlyId = async (req) => {
  let elderlyProfileId = req.query.elderlyId;
  if (!elderlyProfileId && req.user && req.user.role === 'elderly') {
    const profile = await ElderlyProfile.findOne({ userId: req.user._id });
    if (profile) elderlyProfileId = profile._id;
  }
  return elderlyProfileId;
};

// @desc    Get today's medication doses (generates pending records if not already created)
// @route   GET /api/medication-logs/today
// @access  Private
exports.getTodayDoses = async (req, res) => {
  try {
    const elderlyProfileId = await resolveElderlyId(req);
    if (!elderlyProfileId) {
      return res.status(200).json({ success: true, count: 0, data: [] });
    }

    const today = getTodayIST();

    // 1. Fetch all active medications for this elderly user
    const activeMeds = await Medication.find({
      elderlyProfileId,
      isActive: true,
    });

    // 2. Ensure a log entry exists for each scheduled time today
    for (const med of activeMeds) {
      for (const time of med.times) {
        try {
          await MedicationLog.findOneAndUpdate(
            {
              medicationId: med._id,
              scheduledDate: today,
              scheduledTime: time,
            },
            {
              $setOnInsert: {
                medicationId: med._id,
                elderlyProfileId: med.elderlyProfileId,
                elderlyUserId: med.elderlyUserId,
                medicationName: med.name,
                dosage: med.dosage,
                scheduledDate: today,
                scheduledTime: time,
                status: 'pending',
              },
            },
            { upsert: true, new: true }
          );
        } catch (e) {
          // ignore duplicate race
        }
      }
    }

    // 3. Fetch today's dose logs sorted by scheduled time
    const logs = await MedicationLog.find({
      elderlyProfileId,
      scheduledDate: today,
    }).sort({ scheduledTime: 1 });

    res.status(200).json({
      success: true,
      count: logs.length,
      date: today,
      data: logs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update dose status (Taken, Missed, Skipped, Pending)
// @route   POST /api/medication-logs/:id/status
// @access  Private
exports.updateDoseStatus = async (req, res) => {
  try {
    const { status, reason, method } = req.body;
    const validStatuses = ['pending', 'taken', 'missed', 'unconfirmed', 'skipped'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const log = await MedicationLog.findById(req.params.id);
    if (!log) {
      return res.status(404).json({ success: false, message: 'Dose log not found' });
    }

    log.status = status;
    if (reason) log.reason = reason;

    if (status === 'taken') {
      log.confirmedAt = new Date();
      log.confirmedBy = req.user._id;
      log.confirmedMethod = method || 'dashboard';

      // Audit Log
      await AuditLog.create({
        elderlyProfileId: log.elderlyProfileId,
        performedBy: req.user._id,
        action: 'DOSE_TAKEN',
        details: `${req.user.name} confirmed dose of ${log.medicationName} (${log.dosage}) taken.`,
      });

      // Notify Care Team members
      const careMembers = await CareTeam.find({
        elderlyProfileId: log.elderlyProfileId,
        status: 'active',
      });

      for (const member of careMembers) {
        if (member.memberUserId.toString() !== req.user._id.toString()) {
          await Notification.create({
            recipientUserId: member.memberUserId,
            elderlyProfileId: log.elderlyProfileId,
            title: 'Dose Confirmed Taken',
            message: `${log.medicationName} (${log.dosage}) was taken at ${log.scheduledTime}.`,
            type: 'reminder',
          });
        }
      }
    } else if (status === 'missed' || status === 'skipped') {
      await AuditLog.create({
        elderlyProfileId: log.elderlyProfileId,
        performedBy: req.user._id,
        action: `DOSE_${status.toUpperCase()}`,
        details: `Dose of ${log.medicationName} marked as ${status}${reason ? `: ${reason}` : ''}.`,
      });

      // If dose is marked missed, notify authorized care team members via email
      if (status === 'missed') {
        const careMembers = await CareTeam.find({
          elderlyProfileId: log.elderlyProfileId,
          status: 'active',
        }).populate('memberUserId');

        const profile = await ElderlyProfile.findById(log.elderlyProfileId);

        for (const member of careMembers) {
          if (member.memberUserId && member.memberUserId.email) {
            await sendMissedMedicationAlert(member.memberUserId, profile, log);

            await Notification.create({
              recipientUserId: member.memberUserId._id,
              elderlyProfileId: log.elderlyProfileId,
              title: `⚠️ Dose Missed: ${profile ? profile.fullName : 'Patient'}`,
              message: `${log.medicationName} (${log.dosage}) scheduled at ${log.scheduledTime} was marked as missed.`,
              type: 'alert',
            });
          }
        }
      }
    }

    await log.save();

    res.status(200).json({
      success: true,
      message: `Dose marked as ${status}`,
      data: log,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Public One-Click dose confirmation from Email link
// @route   GET /api/medication-logs/confirm/:token
// @access  Public
exports.confirmDoseByToken = async (req, res) => {
  try {
    const { token } = req.params;

    const log = await MedicationLog.findOne({
      confirmationToken: token,
    });

    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Invalid or expired confirmation link.',
      });
    }

    if (log.status === 'taken') {
      return res.status(200).json({
        success: true,
        alreadyConfirmed: true,
        message: 'This dose was already confirmed as taken!',
        medicationName: log.medicationName,
        dosage: log.dosage,
        time: log.scheduledTime,
      });
    }

    log.status = 'taken';
    log.confirmedAt = new Date();
    log.confirmedMethod = 'one_click_email';
    await log.save();

    // Create Audit Log
    await AuditLog.create({
      elderlyProfileId: log.elderlyProfileId,
      performedBy: log.elderlyUserId,
      action: 'DOSE_TAKEN_EMAIL_LINK',
      details: `Dose of ${log.medicationName} confirmed taken via 1-click email link.`,
    });

    res.status(200).json({
      success: true,
      message: `Thank you! Dose for ${log.medicationName} (${log.dosage}) recorded as TAKEN.`,
      medicationName: log.medicationName,
      dosage: log.dosage,
      time: log.scheduledTime,
      date: log.scheduledDate,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dose history for adherence calculation
// @route   GET /api/medication-logs/history
// @access  Private
exports.getHistory = async (req, res) => {
  try {
    const elderlyProfileId = await resolveElderlyId(req);
    const limit = parseInt(req.query.limit) || 100;

    const query = {};
    if (elderlyProfileId) {
      query.elderlyProfileId = elderlyProfileId;
    }

    const logs = await MedicationLog.find(query)
      .sort({ scheduledDate: -1, scheduledTime: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
