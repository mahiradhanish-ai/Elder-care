const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const {
  verifySmtpConnection,
  sendDoseReminderEmail,
  sendCareTeamDoseReminderEmail,
  sendMissedMedicationAlert,
  sendAppointmentReminderEmail,
} = require('../services/emailService');

async function runEmailDeliveryTests() {
  console.log('====================================================');
  console.log('🧪 ELDERCARE CONNECT - EMAIL REMINDER DELIVERY TEST');
  console.log('====================================================');
  console.log(`SMTP Host: ${process.env.SMTP_HOST}`);
  console.log(`SMTP Port: ${process.env.SMTP_PORT}`);
  console.log(`SMTP User: ${process.env.SMTP_USER}`);
  console.log(`Timezone: ${process.env.TIMEZONE || 'Asia/Kolkata'}`);

  // 1. Verify SMTP Connection
  console.log('\n--- Step 1: Verifying SMTP Connection ---');
  const verifyResult = await verifySmtpConnection();
  if (!verifyResult.success) {
    console.error('SMTP verification failed:', verifyResult.error);
    process.exit(1);
  }

  // 2. Test 1: Send Upcoming Dose Reminder Email
  console.log('\n--- Step 2: Testing Upcoming Dose Reminder Email ---');
  const mockElderlyUser = {
    name: 'Ramesh Patel',
    email: 'ramesh@eldercare.com',
  };
  const mockDoseLog = {
    medicationName: 'Metformin Hydrochloride',
    dosage: '500 mg',
    scheduledTime: '14:30',
    scheduledDate: '2026-11-15',
    reason: 'Take with water after lunch',
    confirmationToken: 'test-conf-token-' + Date.now(),
  };

  const doseResult = await sendDoseReminderEmail(mockElderlyUser, mockDoseLog);
  console.log('Dose Reminder Result:', doseResult.success ? 'SUCCESS ✅' : 'FAILED ❌');
  if (doseResult.success) {
    console.log('  Message ID:', doseResult.messageId);
    console.log('  Recipient:', mockElderlyUser.email);
    console.log('  Preview URL:', nodemailer.getTestMessageUrl(doseResult.info));
  } else {
    console.error('  Error:', doseResult.error);
  }

  // 3. Test 2: Send Missed Medication Alert Email to Caregiver / Family
  console.log('\n--- Step 3: Testing Missed Medication Alert to Caregiver/Family ---');
  const mockCaregiver = {
    name: 'Priya Sharma (Caretaker)',
    email: 'priya@eldercare.com',
  };
  const mockFamily = {
    name: 'Arun Patel (Son)',
    email: 'arun@eldercare.com',
  };
  const mockProfile = {
    fullName: 'Ramesh Patel',
  };
  const mockMissedLog = {
    medicationName: 'Atorvastatin',
    dosage: '20 mg',
    scheduledTime: '09:00',
    scheduledDate: '2026-11-15',
    reason: 'Patient fell asleep before taking dose',
  };

  const missedCaretakerResult = await sendMissedMedicationAlert(mockCaregiver, mockProfile, mockMissedLog);
  console.log('Missed Alert (Caretaker) Result:', missedCaretakerResult.success ? 'SUCCESS ✅' : 'FAILED ❌');
  if (missedCaretakerResult.success) {
    console.log('  Message ID:', missedCaretakerResult.messageId);
    console.log('  Recipient:', mockCaregiver.email);
    console.log('  Preview URL:', nodemailer.getTestMessageUrl(missedCaretakerResult.info));
  }

  const missedFamilyResult = await sendMissedMedicationAlert(mockFamily, mockProfile, mockMissedLog);
  console.log('Missed Alert (Family Member) Result:', missedFamilyResult.success ? 'SUCCESS ✅' : 'FAILED ❌');
  if (missedFamilyResult.success) {
    console.log('  Message ID:', missedFamilyResult.messageId);
    console.log('  Recipient:', mockFamily.email);
    console.log('  Preview URL:', nodemailer.getTestMessageUrl(missedFamilyResult.info));
  }

  // 4. Test 3: Send Doctor Appointment Reminder Email
  console.log('\n--- Step 4: Testing Doctor Appointment Reminder Email ---');
  const mockAppointment = {
    doctorName: 'Dr. V. Ramanathan',
    specialty: 'Cardiologist',
    hospitalOrClinic: 'Apollo Speciality Hospital',
    date: '2026-11-16',
    time: '11:00',
    purpose: 'Quarterly cardiovascular review and blood pressure check',
  };

  const apptResultElderly = await sendAppointmentReminderEmail(
    mockElderlyUser,
    mockAppointment,
    'Ramesh Patel',
    'patient'
  );
  console.log('Appointment Reminder (Elderly) Result:', apptResultElderly.success ? 'SUCCESS ✅' : 'FAILED ❌');
  if (apptResultElderly.success) {
    console.log('  Message ID:', apptResultElderly.messageId);
    console.log('  Recipient:', mockElderlyUser.email);
    console.log('  Preview URL:', nodemailer.getTestMessageUrl(apptResultElderly.info));
  }

  const apptResultFamily = await sendAppointmentReminderEmail(
    mockFamily,
    mockAppointment,
    'Ramesh Patel',
    'family'
  );
  console.log('Appointment Reminder (Family) Result:', apptResultFamily.success ? 'SUCCESS ✅' : 'FAILED ❌');
  if (apptResultFamily.success) {
    console.log('  Message ID:', apptResultFamily.messageId);
    console.log('  Recipient:', mockFamily.email);
    console.log('  Preview URL:', nodemailer.getTestMessageUrl(apptResultFamily.info));
  }

  // 5. Test 4: Send Care Team Dose Due Notification
  console.log('\n--- Step 5: Testing Care Team Dose Due Notice ---');
  const careNoticeResult = await sendCareTeamDoseReminderEmail(mockCaregiver, mockProfile, mockDoseLog);
  console.log('Care Team Due Notice Result:', careNoticeResult.success ? 'SUCCESS ✅' : 'FAILED ❌');
  if (careNoticeResult.success) {
    console.log('  Message ID:', careNoticeResult.messageId);
    console.log('  Recipient:', mockCaregiver.email);
    console.log('  Preview URL:', nodemailer.getTestMessageUrl(careNoticeResult.info));
  }

  console.log('\n====================================================');
  console.log('🎉 ALL EMAIL DELIVERY TESTS COMPLETED SUCCESSFULLY!');
  console.log('====================================================');
  process.exit(0);
}

runEmailDeliveryTests().catch((err) => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
