const CareTeam = require('../models/CareTeam');
const ElderlyProfile = require('../models/ElderlyProfile');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');

// @desc    Get care team members for elderly user
// @route   GET /api/care-team
// @access  Private
exports.getCareTeam = async (req, res) => {
  try {
    let elderlyProfileId = req.query.elderlyId;

    if (!elderlyProfileId && req.user.role === 'elderly') {
      const profile = await ElderlyProfile.findOne({ userId: req.user._id });
      if (profile) elderlyProfileId = profile._id;
    }

    if (!elderlyProfileId) {
      return res.status(200).json({ success: true, count: 0, data: [] });
    }

    const members = await CareTeam.find({
      elderlyProfileId,
      status: { $ne: 'revoked' },
    }).populate('memberUserId', 'name email role phone');

    res.status(200).json({
      success: true,
      count: members.length,
      data: members,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Join Care Team by entering Elderly Profile 6-digit Passcode
// @route   POST /api/care-team/join-by-passcode
// @access  Private (Caretaker or Family)
exports.joinByPasscode = async (req, res) => {
  try {
    const { passcode, memberRole } = req.body;

    if (!passcode) {
      return res.status(400).json({
        success: false,
        message: 'Please provide the 6-digit access passcode.',
      });
    }

    const profile = await ElderlyProfile.findOne({
      accessPasscode: passcode.trim(),
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Invalid access passcode. No matching elderly profile found.',
      });
    }

    // Check if already in care team
    let careTeamEntry = await CareTeam.findOne({
      elderlyProfileId: profile._id,
      memberUserId: req.user._id,
    });

    const roleToAssign = memberRole || req.user.role;

    if (careTeamEntry) {
      careTeamEntry.status = 'active';
      careTeamEntry.memberRole = roleToAssign;
      await careTeamEntry.save();
    } else {
      careTeamEntry = await CareTeam.create({
        elderlyProfileId: profile._id,
        elderlyUserId: profile.userId,
        memberUserId: req.user._id,
        memberRole: roleToAssign,
        status: 'active',
      });
    }

    // Audit Log
    await AuditLog.create({
      elderlyProfileId: profile._id,
      performedBy: req.user._id,
      action: 'CARE_TEAM_JOINED',
      details: `${req.user.name} joined the care team as a ${roleToAssign}.`,
    });

    // Notify Elderly User
    await Notification.create({
      recipientUserId: profile.userId,
      elderlyProfileId: profile._id,
      title: 'New Care Team Member',
      message: `${req.user.name} has joined your care team as a ${roleToAssign}.`,
      type: 'care_team',
    });

    res.status(200).json({
      success: true,
      message: `Successfully connected to ${profile.fullName}'s care team!`,
      profile,
      careTeam: careTeamEntry,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Invite Care Team Member by Email
// @route   POST /api/care-team/invite
// @access  Private
exports.inviteMember = async (req, res) => {
  try {
    const { email, role, elderlyProfileId } = req.body;

    const targetUser = await User.findOne({ email: email.toLowerCase() });
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User with this email not registered yet. Ask them to sign up first.',
      });
    }

    const profile = await ElderlyProfile.findById(elderlyProfileId);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Elderly profile not found' });
    }

    const careTeamEntry = await CareTeam.findOneAndUpdate(
      {
        elderlyProfileId: profile._id,
        memberUserId: targetUser._id,
      },
      {
        elderlyProfileId: profile._id,
        elderlyUserId: profile.userId,
        memberUserId: targetUser._id,
        memberRole: role || targetUser.role,
        status: 'active',
      },
      { upsert: true, new: true }
    );

    // Audit Log
    await AuditLog.create({
      elderlyProfileId: profile._id,
      performedBy: req.user._id,
      action: 'MEMBER_INVITED',
      details: `${req.user.name} invited ${targetUser.name} as ${role || targetUser.role}.`,
    });

    res.status(200).json({
      success: true,
      message: `Added ${targetUser.name} to care team`,
      data: careTeamEntry,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Revoke member access
// @route   DELETE /api/care-team/:id
// @access  Private
exports.revokeAccess = async (req, res) => {
  try {
    const careTeam = await CareTeam.findById(req.params.id);
    if (!careTeam) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    careTeam.status = 'revoked';
    await careTeam.save();

    await AuditLog.create({
      elderlyProfileId: careTeam.elderlyProfileId,
      performedBy: req.user._id,
      action: 'MEMBER_REVOKED',
      details: `${req.user.name} revoked care team member access.`,
    });

    res.status(200).json({
      success: true,
      message: 'Access revoked successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
