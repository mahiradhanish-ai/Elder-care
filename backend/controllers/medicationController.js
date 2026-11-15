const Medication = require('../models/Medication');
const MedicationLog = require('../models/MedicationLog');
const ElderlyProfile = require('../models/ElderlyProfile');
const AuditLog = require('../models/AuditLog');
const { getTodayIST } = require('../utils/dateHelper');

// Helper to resolve elderly profile and user IDs
const resolveElderlyInfo = async (req) => {
  let elderlyProfileId = req.query.elderlyId || req.body.elderlyProfileId;
  let elderlyUserId = req.user._id;

  if (req.user.role === 'elderly') {
    const profile = await ElderlyProfile.findOne({ userId: req.user._id });
    if (profile) {
      elderlyProfileId = profile._id;
    }
  } else if (elderlyProfileId) {
    const profile = await ElderlyProfile.findById(elderlyProfileId);
    if (profile) {
      elderlyUserId = profile.userId;
    }
  }

  return { elderlyProfileId, elderlyUserId };
};

// @desc    Get all medications
// @route   GET /api/medications
// @access  Private
exports.getMedications = async (req, res) => {
  try {
    const { elderlyProfileId } = await resolveElderlyInfo(req);

    const query = { isActive: true };
    if (elderlyProfileId) {
      query.elderlyProfileId = elderlyProfileId;
    }

    const medications = await Medication.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: medications.length,
      data: medications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add a new medication
// @route   POST /api/medications
// @access  Private (Elderly or Caretaker)
exports.createMedication = async (req, res) => {
  try {
    const { elderlyProfileId, elderlyUserId } = await resolveElderlyInfo(req);

    if (!elderlyProfileId) {
      return res.status(400).json({
        success: false,
        message: 'Elderly profile ID is required to add medication.',
      });
    }

    const {
      name,
      dosage,
      frequency,
      times,
      instructions,
      prescribingDoctor,
      startDate,
      endDate,
      colorTag,
    } = req.body;

    // Normalizing times: support comma-separated string (e.g. "08:30, 13:00, 20:30") or array
    let normalizedTimes = [];
    if (Array.isArray(times)) {
      normalizedTimes = times.map((t) => (typeof t === 'string' ? t.trim() : t)).filter(Boolean);
    } else if (typeof times === 'string') {
      normalizedTimes = times.split(',').map((t) => t.trim()).filter(Boolean);
    }
    if (normalizedTimes.length === 0) {
      normalizedTimes = ['09:00'];
    }

    const medication = await Medication.create({
      elderlyProfileId,
      elderlyUserId,
      createdBy: req.user._id,
      name,
      dosage,
      frequency: frequency || 'Once Daily',
      times: normalizedTimes,
      instructions: instructions || 'Take with water after meals',
      prescribingDoctor: prescribingDoctor || 'Doctor',
      startDate: startDate || new Date(),
      endDate,
      colorTag: colorTag || '#0c87eb',
    });

    // Create today's scheduled dose logs immediately so they appear in today's dashboard
    const today = getTodayIST();
    for (const time of medication.times) {
      try {
        await MedicationLog.create({
          medicationId: medication._id,
          elderlyProfileId,
          elderlyUserId,
          medicationName: medication.name,
          dosage: medication.dosage,
          scheduledDate: today,
          scheduledTime: time,
          status: 'pending',
        });
      } catch (logErr) {
        // Ignore duplicate index errors if already generated
      }
    }

    // Create Audit Log
    await AuditLog.create({
      elderlyProfileId,
      performedBy: req.user._id,
      action: 'MEDICATION_ADDED',
      details: `${req.user.name} added prescription: ${medication.name} (${medication.dosage}) at ${medication.times.join(', ')}.`,
    });

    res.status(201).json({
      success: true,
      data: medication,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update medication
// @route   PUT /api/medications/:id
// @access  Private
exports.updateMedication = async (req, res) => {
  try {
    let medication = await Medication.findById(req.params.id);
    if (!medication) {
      return res.status(404).json({ success: false, message: 'Medication not found' });
    }

    // Support comma-separated times string in updates as well
    if (req.body.times && typeof req.body.times === 'string') {
      req.body.times = req.body.times.split(',').map((t) => t.trim()).filter(Boolean);
    }

    medication = await Medication.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    await AuditLog.create({
      elderlyProfileId: medication.elderlyProfileId,
      performedBy: req.user._id,
      action: 'MEDICATION_UPDATED',
      details: `${req.user.name} updated prescription details for ${medication.name}.`,
    });

    res.status(200).json({
      success: true,
      data: medication,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Discontinue or delete medication
// @route   DELETE /api/medications/:id
// @access  Private
exports.deleteMedication = async (req, res) => {
  try {
    const medication = await Medication.findById(req.params.id);
    if (!medication) {
      return res.status(404).json({ success: false, message: 'Medication not found' });
    }

    medication.isActive = false;
    await medication.save();

    await AuditLog.create({
      elderlyProfileId: medication.elderlyProfileId,
      performedBy: req.user._id,
      action: 'MEDICATION_DISCONTINUED',
      details: `${req.user.name} discontinued medication ${medication.name}.`,
    });

    res.status(200).json({
      success: true,
      message: 'Medication discontinued successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
