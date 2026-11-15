const AuditLog = require('../models/AuditLog');
const ElderlyProfile = require('../models/ElderlyProfile');

// @desc    Get activity timeline for an elderly individual
// @route   GET /api/timeline/:elderlyId
// @access  Private
exports.getTimeline = async (req, res) => {
  try {
    let elderlyProfileId = req.params.elderlyId;

    if (!elderlyProfileId || elderlyProfileId === 'undefined') {
      if (req.user.role === 'elderly') {
        const profile = await ElderlyProfile.findOne({ userId: req.user._id });
        if (profile) elderlyProfileId = profile._id;
      }
    }

    if (!elderlyProfileId) {
      return res.status(200).json({ success: true, count: 0, data: [] });
    }

    const logs = await AuditLog.find({ elderlyProfileId })
      .populate('performedBy', 'name role')
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
