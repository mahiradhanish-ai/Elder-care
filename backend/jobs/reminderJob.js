const cron = require('node-cron');
const MedicationLog = require('../models/MedicationLog');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const ElderlyProfile = require('../models/ElderlyProfile');
const CareTeam = require('../models/CareTeam');
const Notification = require('../models/Notification');
const {
  sendDoseReminderEmail,
  sendCareTeamDoseReminderEmail,
  sendMissedMedicationAlert,
  sendCaretakerUnconfirmedAlert,
  sendAppointmentReminderEmail,
} = require('../services/emailService');
const { getTodayIST, getCurrentTimeIST, isPastGracePeriod } = require('../utils/dateHelper');

const initReminderJob = () => {
  // Run every minute in Asia/Kolkata timezone
  cron.schedule(
    '* * * * *',
    async () => {
      try {
        const today = getTodayIST();
        const currentTime = getCurrentTimeIST();

        // 1. Check for Pending doses scheduled for now that need reminders
        const dueLogs = await MedicationLog.find({
          scheduledDate: today,
          scheduledTime: { $lte: currentTime },
          status: 'pending',
          reminderSentAt: null,
        }).populate('elderlyUserId');

        for (const log of dueLogs) {
          if (log.elderlyUserId) {
            // Dispatch email reminder if email is available
            if (log.elderlyUserId.email) {
              await sendDoseReminderEmail(log.elderlyUserId, log);
            }

            // Create in-app notification in MongoDB for elderly user
            await Notification.create({
              recipientUserId: log.elderlyUserId._id,
              elderlyProfileId: log.elderlyProfileId,
              title: `⏰ Medication Due: ${log.medicationName}`,
              message: `It is time to take your scheduled dose of ${log.medicationName} (${log.dosage}) at ${log.scheduledTime}.`,
              type: 'reminder',
            });

            // Also dispatch dose notification to authorized care team members (caretakers & family)
            const careMembers = await CareTeam.find({
              elderlyProfileId: log.elderlyProfileId,
              status: 'active',
            }).populate('memberUserId');

            const profile = await ElderlyProfile.findById(log.elderlyProfileId);

            for (const cm of careMembers) {
              if (
                cm.memberUserId &&
                cm.memberUserId.email &&
                cm.memberUserId.email !== log.elderlyUserId.email
              ) {
                await sendCareTeamDoseReminderEmail(cm.memberUserId, profile, log);
              }
            }

            log.reminderSentAt = new Date();
            await log.save();
          } else {
            // Prevent duplicate polling loops if user ref is detached
            log.reminderSentAt = new Date();
            await log.save();
          }
        }

        // 2. Check for unconfirmed doses past grace period (e.g. 30 mins late)
        const unconfirmedLogs = await MedicationLog.find({
          scheduledDate: today,
          status: 'pending',
          alertSentAt: null,
        });

        for (const log of unconfirmedLogs) {
          if (isPastGracePeriod(log.scheduledDate, log.scheduledTime, 30)) {
            log.status = 'unconfirmed';
            log.alertSentAt = new Date();
            await log.save();

            // Find authorized caretakers and family members
            const careTeam = await CareTeam.find({
              elderlyProfileId: log.elderlyProfileId,
              status: 'active',
              memberRole: { $in: ['caretaker', 'family'] },
            }).populate('memberUserId');

            const profile = await ElderlyProfile.findById(log.elderlyProfileId);

            for (const member of careTeam) {
              if (member.memberUserId && member.memberUserId.email) {
                // Send email alert for missed/unconfirmed dose
                await sendMissedMedicationAlert(member.memberUserId, profile, log);

                // Create in-app alert notification
                await Notification.create({
                  recipientUserId: member.memberUserId._id,
                  elderlyProfileId: log.elderlyProfileId,
                  title: `🚨 Unconfirmed Dose: ${profile ? profile.fullName : 'Patient'}`,
                  message: `${log.medicationName} (${log.dosage}) scheduled at ${log.scheduledTime} is still unconfirmed.`,
                  type: 'alert',
                });
              }
            }
          }
        }

        // 3. Check for Appointments scheduled for today
        const todayAppointments = await Appointment.find({
          date: today,
          status: 'upcoming',
          reminderSentAt: null,
        }).populate('elderlyUserId');

        for (const appt of todayAppointments) {
          const profile = await ElderlyProfile.findById(appt.elderlyProfileId);
          const elderlyName = profile ? profile.fullName : 'Elderly Patient';

          if (appt.elderlyUserId && appt.elderlyUserId.email) {
            await sendAppointmentReminderEmail(appt.elderlyUserId, appt, elderlyName, 'patient');
          }

          // Also notify authorized care team members (family and caretakers)
          const careMembers = await CareTeam.find({
            elderlyProfileId: appt.elderlyProfileId,
            status: 'active',
          }).populate('memberUserId');

          for (const cm of careMembers) {
            if (
              cm.memberUserId &&
              cm.memberUserId.email &&
              cm.memberUserId.email !== (appt.elderlyUserId ? appt.elderlyUserId.email : '')
            ) {
              await sendAppointmentReminderEmail(cm.memberUserId, appt, elderlyName, cm.memberRole);
            }
          }

          appt.reminderSentAt = new Date();
          await appt.save();
        }
      } catch (cronError) {
        console.error('Reminder Cron Job Error:', cronError.message);
      }
    },
    {
      timezone: 'Asia/Kolkata',
    }
  );

  console.log('⏰ Scheduled Smart Reminder Job initialized (Asia/Kolkata)');
};

module.exports = initReminderJob;
