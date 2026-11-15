const MedicationLog = require('../models/MedicationLog');
const Appointment = require('../models/Appointment');
const ElderlyProfile = require('../models/ElderlyProfile');

// @desc    Get adherence analytics for an elderly individual
// @route   GET /api/analytics/:elderlyId
// @access  Private
exports.getAnalytics = async (req, res) => {
  try {
    let elderlyProfileId = req.params.elderlyId;

    if (!elderlyProfileId || elderlyProfileId === 'undefined') {
      if (req.user.role === 'elderly') {
        const profile = await ElderlyProfile.findOne({ userId: req.user._id });
        if (profile) elderlyProfileId = profile._id;
      }
    }

    if (!elderlyProfileId) {
      return res.status(200).json({
        success: true,
        data: {
          adherenceRate: 0,
          totalDoses: 0,
          takenCount: 0,
          missedCount: 0,
          unconfirmedCount: 0,
          skippedCount: 0,
          pendingCount: 0,
          weeklyTrends: [],
        },
      });
    }

    // Fetch all logs from the last 30 days
    const logs = await MedicationLog.find({
      elderlyProfileId,
    }).sort({ scheduledDate: -1 });

    const totalDoses = logs.length;
    let takenCount = 0;
    let missedCount = 0;
    let unconfirmedCount = 0;
    let skippedCount = 0;
    let pendingCount = 0;

    const dateMap = {};

    logs.forEach((log) => {
      if (log.status === 'taken') takenCount++;
      else if (log.status === 'missed') missedCount++;
      else if (log.status === 'unconfirmed') unconfirmedCount++;
      else if (log.status === 'skipped') skippedCount++;
      else if (log.status === 'pending') pendingCount++;

      // Weekly trend grouping
      if (!dateMap[log.scheduledDate]) {
        dateMap[log.scheduledDate] = { date: log.scheduledDate, taken: 0, missed: 0, total: 0 };
      }
      dateMap[log.scheduledDate].total++;
      if (log.status === 'taken') dateMap[log.scheduledDate].taken++;
      if (log.status === 'missed' || log.status === 'unconfirmed') dateMap[log.scheduledDate].missed++;
    });

    // Only count taken vs actionable total (taken + missed + unconfirmed + skipped) for real adherence rate
    const decidedDoses = takenCount + missedCount + unconfirmedCount + skippedCount;
    const adherenceRate = decidedDoses > 0 ? Math.round((takenCount / decidedDoses) * 100) : (totalDoses > 0 && takenCount > 0 ? 100 : 0);

    // Convert dateMap to sorted array (last 7 days)
    const weeklyTrends = Object.values(dateMap)
      .slice(0, 7)
      .reverse();

    // Upcoming appointments count
    const upcomingAppointmentsCount = await Appointment.countDocuments({
      elderlyProfileId,
      status: 'upcoming',
    });

    res.status(200).json({
      success: true,
      data: {
        adherenceRate,
        totalDoses,
        takenCount,
        missedCount,
        unconfirmedCount,
        skippedCount,
        pendingCount,
        weeklyTrends,
        upcomingAppointmentsCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
