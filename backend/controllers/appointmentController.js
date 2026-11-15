const Appointment = require('../models/Appointment');
const ElderlyProfile = require('../models/ElderlyProfile');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');
const CareTeam = require('../models/CareTeam');

const resolveElderlyInfo = async (req) => {
  let elderlyProfileId = req.query.elderlyId || req.body.elderlyProfileId;
  let elderlyUserId = req.user._id;

  if (req.user.role === 'elderly') {
    const profile = await ElderlyProfile.findOne({ userId: req.user._id });
    if (profile) elderlyProfileId = profile._id;
  } else if (elderlyProfileId) {
    const profile = await ElderlyProfile.findById(elderlyProfileId);
    if (profile) elderlyUserId = profile.userId;
  }

  return { elderlyProfileId, elderlyUserId };
};

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private
exports.getAppointments = async (req, res) => {
  try {
    const { elderlyProfileId } = await resolveElderlyInfo(req);

    const query = {};
    if (elderlyProfileId) {
      query.elderlyProfileId = elderlyProfileId;
    }

    const appointments = await Appointment.find(query).sort({ date: 1, time: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create doctor appointment
// @route   POST /api/appointments
// @access  Private
exports.createAppointment = async (req, res) => {
  try {
    const { elderlyProfileId, elderlyUserId } = await resolveElderlyInfo(req);

    if (!elderlyProfileId) {
      return res.status(400).json({
        success: false,
        message: 'Elderly profile ID is required to schedule appointment.',
      });
    }

    const {
      doctorName,
      specialty,
      hospitalOrClinic,
      date,
      time,
      purpose,
      notes,
    } = req.body;

    const appointment = await Appointment.create({
      elderlyProfileId,
      elderlyUserId,
      createdBy: req.user._id,
      doctorName,
      specialty: specialty || 'General Physician',
      hospitalOrClinic,
      date,
      time,
      purpose: purpose || 'Consultation',
      notes: notes || '',
      status: 'upcoming',
    });

    // Audit Log
    await AuditLog.create({
      elderlyProfileId,
      performedBy: req.user._id,
      action: 'APPOINTMENT_SCHEDULED',
      details: `${req.user.name} scheduled doctor visit with Dr. ${doctorName} on ${date} at ${time}.`,
    });

    // Notify Care Team
    const careMembers = await CareTeam.find({
      elderlyProfileId,
      status: 'active',
    });

    for (const member of careMembers) {
      if (member.memberUserId.toString() !== req.user._id.toString()) {
        await Notification.create({
          recipientUserId: member.memberUserId,
          elderlyProfileId,
          title: 'New Appointment Scheduled',
          message: `Dr. ${doctorName} at ${hospitalOrClinic} on ${date} at ${time}.`,
          type: 'appointment',
        });
      }
    }

    res.status(201).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
exports.updateAppointment = async (req, res) => {
  try {
    let appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    await AuditLog.create({
      elderlyProfileId: appointment.elderlyProfileId,
      performedBy: req.user._id,
      action: 'APPOINTMENT_UPDATED',
      details: `${req.user.name} updated appointment with Dr. ${appointment.doctorName}. Status: ${appointment.status}.`,
    });

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete / Cancel appointment
// @route   DELETE /api/appointments/:id
// @access  Private
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
