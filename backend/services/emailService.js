const nodemailer = require('nodemailer');

let cachedTransporter = null;

// Configure and return secure transporter
const getTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (user && pass && user !== 'demo@eldercareconnect.com') {
    if (!cachedTransporter) {
      cachedTransporter = nodemailer.createTransport({
        host: host || 'smtp.ethereal.email',
        port: port,
        secure: process.env.SMTP_SECURE === 'true' || port === 465,
        auth: { user, pass },
        tls: {
          rejectUnauthorized: false,
        },
      });
    }
    return cachedTransporter;
  }

  // Fallback logger transporter for testing / development without active SMTP
  return {
    sendMail: async (options) => {
      console.log('----------------------------------------------------');
      console.log('📧 [MOCK EMAIL DISPATCHED] (Configure SMTP in .env for real delivery)');
      console.log(`To: ${options.to}`);
      console.log(`Subject: ${options.subject}`);
      if (options.text) console.log(`Body: ${options.text}`);
      console.log('----------------------------------------------------');
      return { messageId: `mock-${Date.now()}` };
    },
  };
};

// Verify live SMTP connection
const verifySmtpConnection = async () => {
  const t = getTransporter();
  if (t && typeof t.verify === 'function') {
    try {
      await t.verify();
      console.log('✅ [SMTP Success] Transporter verified and ready for delivery');
      return { success: true };
    } catch (err) {
      console.error('❌ [SMTP Verification Error]:', err.message);
      return { success: false, error: err.message };
    }
  }
  return { success: true, mock: true };
};

// 1. Send Dose Reminder to Elderly User with One-Click Confirmation link
const sendDoseReminderEmail = async (elderlyUser, log) => {
  if (!elderlyUser || !elderlyUser.email) return;

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const confirmUrl = `${clientUrl}/confirm-dose/${log.confirmationToken}`;
  const sender = process.env.SMTP_FROM || '"ElderCare Connect" <no-reply@eldercareconnect.com>';

  const mailOptions = {
    from: sender,
    to: elderlyUser.email,
    subject: `⏰ Medication Reminder: Time to take your ${log.medicationName}`,
    text: `Hello ${elderlyUser.name}, It is time for your scheduled medication dose: ${log.medicationName} (${log.dosage}) at ${log.scheduledTime} (IST). Confirm here: ${confirmUrl}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #0c87eb; margin: 0;">ElderCare Connect</h2>
          <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Medication Due Reminder</p>
        </div>
        <p>Hello <strong>${elderlyUser.name}</strong>,</p>
        <p>It is time for your scheduled medication dose:</p>
        <div style="background-color: #f0f7ff; border-left: 4px solid #0c87eb; padding: 16px; margin: 20px 0; border-radius: 8px;">
          <h3 style="margin: 0 0 8px 0; color: #0f172a; font-size: 18px;">${log.medicationName} (${log.dosage})</h3>
          <p style="margin: 0 0 6px 0; color: #334155;">Scheduled Time: <strong>${log.scheduledTime} (Asia/Kolkata IST)</strong></p>
          <p style="margin: 0; color: #64748b; font-style: italic;">Instructions: ${log.reason || 'Take with water after meals'}</p>
        </div>
        <p>If you have taken this dose, please confirm below with one click:</p>
        <div style="text-align: center; margin: 28px 0;">
          <a href="${confirmUrl}" style="background-color: #10b981; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
            ✅ Mark as Taken
          </a>
        </div>
        <p style="font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 16px; margin-top: 24px;">
          This secure link records your dose in ElderCare Connect. No automatic changes are made.
        </p>
      </div>
    `,
  };

  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ [Email Sent] Dose reminder dispatched to ${elderlyUser.email} (MessageId: ${info.messageId})`);
    if (nodemailer.getTestMessageUrl && nodemailer.getTestMessageUrl(info)) {
      console.log(`   🔗 Ethereal Preview: ${nodemailer.getTestMessageUrl(info)}`);
    }
    return { success: true, messageId: info.messageId, info };
  } catch (err) {
    console.error(`❌ [Email Delivery Error] Failed to send dose reminder to ${elderlyUser.email}:`, err.message);
    return { success: false, error: err.message };
  }
};

// 2. Send Dose Due Notification to Authorized Care Team (Family & Caretakers)
const sendCareTeamDoseReminderEmail = async (recipientUser, elderlyProfile, log) => {
  if (!recipientUser || !recipientUser.email) return;

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const sender = process.env.SMTP_FROM || '"ElderCare Connect" <no-reply@eldercareconnect.com>';

  const mailOptions = {
    from: sender,
    to: recipientUser.email,
    subject: `⏰ Medication Due for ${elderlyProfile ? elderlyProfile.fullName : 'Patient'}: ${log.medicationName}`,
    text: `Hello ${recipientUser.name}, This is a notification that ${elderlyProfile ? elderlyProfile.fullName : 'your patient'} has a scheduled dose of ${log.medicationName} (${log.dosage}) at ${log.scheduledTime} (IST).`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <h2 style="color: #0c87eb; margin-top: 0;">Care Circle Medication Notice</h2>
        <p>Hello <strong>${recipientUser.name}</strong>,</p>
        <p>This is to inform you that a medication dose is now due for <strong>${elderlyProfile ? elderlyProfile.fullName : 'your patient'}</strong>:</p>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; margin: 16px 0; border-radius: 8px;">
          <p style="margin: 0 0 6px 0;"><strong>Patient:</strong> ${elderlyProfile ? elderlyProfile.fullName : 'Patient'}</p>
          <p style="margin: 0 0 6px 0;"><strong>Medication:</strong> ${log.medicationName} (${log.dosage})</p>
          <p style="margin: 0;"><strong>Scheduled Time:</strong> ${log.scheduledTime} (Asia/Kolkata IST)</p>
        </div>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${clientUrl}/dashboard" style="background-color: #0c87eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Open Care Dashboard
          </a>
        </div>
      </div>
    `,
  };

  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ [Email Sent] Care team due notice dispatched to ${recipientUser.email} (MessageId: ${info.messageId})`);
    if (nodemailer.getTestMessageUrl && nodemailer.getTestMessageUrl(info)) {
      console.log(`   🔗 Ethereal Preview: ${nodemailer.getTestMessageUrl(info)}`);
    }
    return { success: true, messageId: info.messageId, info };
  } catch (err) {
    console.error(`❌ [Email Delivery Error] Failed to send care team reminder to ${recipientUser.email}:`, err.message);
    return { success: false, error: err.message };
  }
};

// 3. Send Missed Medication Alert to Family & Caretakers
const sendMissedMedicationAlert = async (recipientUser, elderlyProfile, log) => {
  if (!recipientUser || !recipientUser.email) return;

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const sender = process.env.SMTP_FROM || '"ElderCare Connect Alerts" <alerts@eldercareconnect.com>';

  const mailOptions = {
    from: sender,
    to: recipientUser.email,
    subject: `⚠️ Missed Medication Alert: ${elderlyProfile ? elderlyProfile.fullName : 'Patient'} - ${log.medicationName}`,
    text: `URGENT ALERT: A medication dose was marked missed or unconfirmed for ${elderlyProfile ? elderlyProfile.fullName : 'Patient'}: ${log.medicationName} (${log.dosage}) scheduled at ${log.scheduledTime} (IST).`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 2px solid #ef4444; border-radius: 16px; background-color: #fffaf0;">
        <div style="display: flex; align-items: center; margin-bottom: 16px;">
          <h2 style="color: #dc2626; margin: 0;">⚠️ Missed Medication Alert</h2>
        </div>
        <p>Hello <strong>${recipientUser.name}</strong>,</p>
        <p>A medication dose has been recorded as <strong>MISSED</strong> for <strong>${elderlyProfile ? elderlyProfile.fullName : 'Patient'}</strong>:</p>
        <div style="background-color: #fee2e2; border-left: 4px solid #dc2626; padding: 16px; margin: 20px 0; border-radius: 8px;">
          <h3 style="margin: 0 0 8px 0; color: #991b1b; font-size: 18px;">${log.medicationName} (${log.dosage})</h3>
          <p style="margin: 0 0 6px 0; color: #7f1d1d;">Scheduled Time: <strong>${log.scheduledTime} (Asia/Kolkata IST)</strong> on <strong>${log.scheduledDate}</strong></p>
          <p style="margin: 0 0 6px 0; color: #7f1d1d;">Status: <span style="font-weight: bold; text-transform: uppercase; color: #dc2626;">MISSED</span></p>
          ${log.reason ? `<p style="margin: 0; color: #7f1d1d;">Recorded Reason: <em>${log.reason}</em></p>` : ''}
        </div>
        <p style="color: #334155;">Please contact ${elderlyProfile ? elderlyProfile.fullName : 'the patient'} or verify their wellbeing.</p>
        <div style="text-align: center; margin: 28px 0;">
          <a href="${clientUrl}/dashboard" style="background-color: #dc2626; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block;">
            Open Dashboard & Review
          </a>
        </div>
      </div>
    `,
  };

  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ [Email Sent] Missed medication alert dispatched to ${recipientUser.email} (MessageId: ${info.messageId})`);
    if (nodemailer.getTestMessageUrl && nodemailer.getTestMessageUrl(info)) {
      console.log(`   🔗 Ethereal Preview: ${nodemailer.getTestMessageUrl(info)}`);
    }
    return { success: true, messageId: info.messageId, info };
  } catch (err) {
    console.error(`❌ [Email Delivery Error] Failed to send missed medication alert to ${recipientUser.email}:`, err.message);
    return { success: false, error: err.message };
  }
};

// 4. Send Alert to Caretakers & Family when dose is unconfirmed past grace period
const sendCaretakerUnconfirmedAlert = async (caretakerUser, elderlyProfile, log) => {
  if (!caretakerUser || !caretakerUser.email) return;

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const sender = process.env.SMTP_FROM || '"ElderCare Connect Alerts" <alerts@eldercareconnect.com>';

  const mailOptions = {
    from: sender,
    to: caretakerUser.email,
    subject: `🚨 Unconfirmed Dose Alert: ${elderlyProfile ? elderlyProfile.fullName : 'Patient'} - ${log.medicationName}`,
    text: `ALERT: A scheduled medication dose has not been confirmed within the grace period for ${elderlyProfile ? elderlyProfile.fullName : 'Patient'}: ${log.medicationName} (${log.dosage}) at ${log.scheduledTime} (IST).`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #fee2e2; border-radius: 16px; background-color: #fffaf0;">
        <h2 style="color: #ef4444; margin-top: 0;">🚨 Unconfirmed Dose Alert</h2>
        <p>Hello <strong>${caretakerUser.name}</strong>,</p>
        <p>A scheduled medication dose has not been confirmed within the grace period for <strong>${elderlyProfile ? elderlyProfile.fullName : 'Patient'}</strong>:</p>
        <div style="background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 16px; margin: 20px 0; border-radius: 8px;">
          <h3 style="margin: 0 0 8px 0; color: #991b1b; font-size: 18px;">${log.medicationName} (${log.dosage})</h3>
          <p style="margin: 0 0 6px 0; color: #7f1d1d;">Scheduled Time: <strong>${log.scheduledTime} (Asia/Kolkata IST)</strong> on <strong>${log.scheduledDate}</strong></p>
          <p style="margin: 0; color: #7f1d1d;">Status: <span style="font-weight: bold; text-transform: uppercase;">UNCONFIRMED</span></p>
        </div>
        <p>Please check in with ${elderlyProfile ? elderlyProfile.fullName : 'the patient'} or update the dose status from your Dashboard.</p>
        <div style="text-align: center; margin: 25px 0;">
          <a href="${clientUrl}/dashboard" style="background-color: #0c87eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Open Care Dashboard
          </a>
        </div>
      </div>
    `,
  };

  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ [Email Sent] Unconfirmed alert dispatched to ${caretakerUser.email} (MessageId: ${info.messageId})`);
    if (nodemailer.getTestMessageUrl && nodemailer.getTestMessageUrl(info)) {
      console.log(`   🔗 Ethereal Preview: ${nodemailer.getTestMessageUrl(info)}`);
    }
    return { success: true, messageId: info.messageId, info };
  } catch (err) {
    console.error(`❌ [Email Delivery Error] Failed to send unconfirmed alert to ${caretakerUser.email}:`, err.message);
    return { success: false, error: err.message };
  }
};

// 5. Send Appointment Reminder (to Elderly Patient, Caretaker, or Family Member)
const sendAppointmentReminderEmail = async (user, appointment, elderlyName, role = 'patient') => {
  if (!user || !user.email) return;

  const sender = process.env.SMTP_FROM || '"ElderCare Connect" <no-reply@eldercareconnect.com>';
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  const isElderly = role === 'elderly' || role === 'patient';
  const roleLabel = isElderly ? 'your upcoming' : `upcoming doctor appointment for ${elderlyName}`;

  const mailOptions = {
    from: sender,
    to: user.email,
    subject: `📅 Doctor Appointment Reminder: Dr. ${appointment.doctorName} for ${elderlyName}`,
    text: `Hello ${user.name}, This is a reminder for the ${roleLabel}: Dr. ${appointment.doctorName} (${appointment.specialty}) on ${appointment.date} at ${appointment.time} (IST) at ${appointment.hospitalOrClinic}.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #0c87eb; margin: 0;">ElderCare Connect</h2>
          <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Clinical Appointment Reminder</p>
        </div>
        <p>Hello <strong>${user.name}</strong>,</p>
        <p>This is a reminder for the ${roleLabel}:</p>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 18px; margin: 20px 0; border-radius: 10px;">
          <h3 style="margin: 0 0 10px 0; color: #0f172a; font-size: 18px;">Dr. ${appointment.doctorName}</h3>
          <p style="margin: 0 0 6px 0; color: #334155;"><strong>Specialty:</strong> ${appointment.specialty}</p>
          <p style="margin: 0 0 6px 0; color: #334155;"><strong>Location:</strong> 📍 ${appointment.hospitalOrClinic}</p>
          <p style="margin: 0 0 6px 0; color: #0c87eb; font-weight: bold;"><strong>Date & Time:</strong> 🗓️ ${appointment.date} at ${appointment.time} (Asia/Kolkata IST)</p>
          <p style="margin: 0; color: #64748b;"><strong>Purpose:</strong> ${appointment.purpose || 'Clinical consultation'}</p>
        </div>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${clientUrl}/appointments" style="background-color: #4f46e5; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            View Appointment Details
          </a>
        </div>
      </div>
    `,
  };

  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ [Email Sent] Appointment reminder dispatched to ${user.email} (MessageId: ${info.messageId})`);
    if (nodemailer.getTestMessageUrl && nodemailer.getTestMessageUrl(info)) {
      console.log(`   🔗 Ethereal Preview: ${nodemailer.getTestMessageUrl(info)}`);
    }
    return { success: true, messageId: info.messageId, info };
  } catch (err) {
    console.error(`❌ [Email Delivery Error] Failed to send appointment reminder to ${user.email}:`, err.message);
    return { success: false, error: err.message };
  }
};

module.exports = {
  getTransporter,
  verifySmtpConnection,
  sendDoseReminderEmail,
  sendCareTeamDoseReminderEmail,
  sendMissedMedicationAlert,
  sendCaretakerUnconfirmedAlert,
  sendAppointmentReminderEmail,
};
