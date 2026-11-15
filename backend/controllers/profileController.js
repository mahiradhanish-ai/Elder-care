const ElderlyProfile = require('../models/ElderlyProfile');
const CareTeam = require('../models/CareTeam');
const AuditLog = require('../models/AuditLog');

// @desc    Get current elderly profile
// @route   GET /api/profiles/my-profile
// @access  Private (Elderly)
exports.getMyProfile = async (req, res) => {
  try {
    let profile = await ElderlyProfile.findOne({ userId: req.user._id });
    if (!profile) {
      // Auto-create if missing
      profile = await ElderlyProfile.create({
        userId: req.user._id,
        fullName: req.user.name,
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update elderly profile
// @route   PUT /api/profiles/my-profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    let targetProfile;

    if (req.user.role === 'elderly') {
      targetProfile = await ElderlyProfile.findOne({ userId: req.user._id });
    } else {
      const profileId = req.params.id || req.body.profileId;
      targetProfile = await ElderlyProfile.findById(profileId);
    }

    if (!targetProfile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    const {
      fullName,
      dateOfBirth,
      gender,
      bloodGroup,
      address,
      emergencyContact,
      medicalConditions,
      allergies,
      notes,
    } = req.body;

    if (fullName) targetProfile.fullName = fullName;
    if (dateOfBirth) targetProfile.dateOfBirth = dateOfBirth;
    if (gender) targetProfile.gender = gender;
    if (bloodGroup) targetProfile.bloodGroup = bloodGroup;
    if (address) targetProfile.address = { ...targetProfile.address, ...address };
    if (emergencyContact) targetProfile.emergencyContact = { ...targetProfile.emergencyContact, ...emergencyContact };
    if (medicalConditions) targetProfile.medicalConditions = medicalConditions;
    if (allergies) targetProfile.allergies = allergies;
    if (notes !== undefined) targetProfile.notes = notes;

    await targetProfile.save();

    // Log update in AuditLog
    await AuditLog.create({
      elderlyProfileId: targetProfile._id,
      performedBy: req.user._id,
      action: 'PROFILE_UPDATED',
      details: `${req.user.name} updated the healthcare profile.`,
    });

    res.status(200).json({
      success: true,
      data: targetProfile,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get profiles managed by caretaker/family
// @route   GET /api/profiles/managed
// @access  Private (Caretaker/Family)
exports.getManagedProfiles = async (req, res) => {
  try {
    const careTeams = await CareTeam.find({
      memberUserId: req.user._id,
      status: 'active',
    }).populate('elderlyProfileId');

    const profiles = careTeams.map((ct) => ct.elderlyProfileId).filter(Boolean);

    res.status(200).json({
      success: true,
      count: profiles.length,
      data: profiles,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get profile by ID
// @route   GET /api/profiles/:id
// @access  Private
exports.getProfileById = async (req, res) => {
  try {
    const profile = await ElderlyProfile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
