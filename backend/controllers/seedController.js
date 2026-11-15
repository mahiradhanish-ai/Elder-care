const User = require('../models/User');
const ElderlyProfile = require('../models/ElderlyProfile');
const CareTeam = require('../models/CareTeam');
const Medication = require('../models/Medication');
const MedicationLog = require('../models/MedicationLog');
const Appointment = require('../models/Appointment');
const AuditLog = require('../models/AuditLog');
const { getTodayIST } = require('../utils/dateHelper');

// @desc    Seed realistic demo data for quick testing and evaluation
// @route   POST /api/auth/seed-demo
// @access  Public
exports.seedDemoData = async (req, res) => {
  try {
    const today = getTodayIST();

    // 1. Create or Find Elderly User (Ramesh Patel)
    let elderlyUser = await User.findOne({ email: 'ramesh@eldercare.com' });
    if (!elderlyUser) {
      elderlyUser = await User.create({
        name: 'Ramesh Patel',
        email: 'ramesh@eldercare.com',
        password: 'password123',
        role: 'elderly',
        phone: '+91 98765 43210',
        languagePreference: 'en',
      });
    }

    // 2. Create or Find Elderly Profile
    let elderlyProfile = await ElderlyProfile.findOne({ userId: elderlyUser._id });
    if (!elderlyProfile) {
      elderlyProfile = await ElderlyProfile.create({
        userId: elderlyUser._id,
        fullName: 'Ramesh Patel',
        dateOfBirth: new Date('1954-08-15'),
        gender: 'Male',
        bloodGroup: 'B+',
        address: {
          street: '14, Gandhi Road, T. Nagar',
          city: 'Chennai',
          state: 'Tamil Nadu',
          postalCode: '600017',
        },
        emergencyContact: {
          name: 'Arun Patel (Son)',
          relationship: 'Son',
          phone: '+91 98401 23456',
          email: 'arun@eldercare.com',
        },
        medicalConditions: ['Type 2 Diabetes', 'Hypertension'],
        allergies: ['Penicillin', 'Sulfa drugs'],
        notes: 'Takes morning walk daily. Needs low sodium diet.',
        accessPasscode: '849201',
      });
    }

    // 3. Create or Find Caretaker User (Nurse Priya Sharma)
    let caretakerUser = await User.findOne({ email: 'priya@eldercare.com' });
    if (!caretakerUser) {
      caretakerUser = await User.create({
        name: 'Priya Sharma (Nurse)',
        email: 'priya@eldercare.com',
        password: 'password123',
        role: 'caretaker',
        phone: '+91 91234 56789',
        languagePreference: 'en',
      });
    }

    // 4. Create or Find Family Member User (Arun Patel)
    let familyUser = await User.findOne({ email: 'arun@eldercare.com' });
    if (!familyUser) {
      familyUser = await User.create({
        name: 'Arun Patel',
        email: 'arun@eldercare.com',
        password: 'password123',
        role: 'family',
        phone: '+91 98401 23456',
        languagePreference: 'en',
      });
    }

    // 5. Connect Care Team
    await CareTeam.findOneAndUpdate(
      { elderlyProfileId: elderlyProfile._id, memberUserId: caretakerUser._id },
      {
        elderlyProfileId: elderlyProfile._id,
        elderlyUserId: elderlyUser._id,
        memberUserId: caretakerUser._id,
        memberRole: 'caretaker',
        status: 'active',
      },
      { upsert: true }
    );

    await CareTeam.findOneAndUpdate(
      { elderlyProfileId: elderlyProfile._id, memberUserId: familyUser._id },
      {
        elderlyProfileId: elderlyProfile._id,
        elderlyUserId: elderlyUser._id,
        memberUserId: familyUser._id,
        memberRole: 'family',
        status: 'active',
      },
      { upsert: true }
    );

    // 6. Seed Sample Medications
    const medsData = [
      {
        name: 'Metformin Hydrochloride',
        dosage: '500 mg',
        frequency: 'Twice Daily',
        times: ['08:30', '20:30'],
        instructions: 'Take with or after breakfast and dinner',
        prescribingDoctor: 'Dr. K. Swaminathan (Diabetologist)',
        colorTag: '#0c87eb',
      },
      {
        name: 'Telmisartan (Micardis)',
        dosage: '40 mg',
        frequency: 'Once Daily',
        times: ['09:00'],
        instructions: 'Take in the morning with a full glass of water',
        prescribingDoctor: 'Dr. V. Ramanathan (Cardiologist)',
        colorTag: '#14b8a6',
      },
      {
        name: 'Atorvastatin',
        dosage: '10 mg',
        frequency: 'Once Daily',
        times: ['21:00'],
        instructions: 'Take at bedtime',
        prescribingDoctor: 'Dr. V. Ramanathan (Cardiologist)',
        colorTag: '#8b5cf6',
      },
    ];

    for (const item of medsData) {
      let med = await Medication.findOne({
        elderlyProfileId: elderlyProfile._id,
        name: item.name,
      });

      if (!med) {
        med = await Medication.create({
          elderlyProfileId: elderlyProfile._id,
          elderlyUserId: elderlyUser._id,
          createdBy: caretakerUser._id,
          ...item,
        });
      }

      // Generate today's logs
      for (const time of med.times) {
        await MedicationLog.findOneAndUpdate(
          {
            medicationId: med._id,
            scheduledDate: today,
            scheduledTime: time,
          },
          {
            $setOnInsert: {
              medicationId: med._id,
              elderlyProfileId: elderlyProfile._id,
              elderlyUserId: elderlyUser._id,
              medicationName: med.name,
              dosage: med.dosage,
              scheduledDate: today,
              scheduledTime: time,
              status: time.startsWith('08') ? 'taken' : 'pending',
              confirmedAt: time.startsWith('08') ? new Date() : null,
            },
          },
          { upsert: true }
        );
      }
    }

    // 7. Seed Sample Appointment
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    const apptDate = tomorrow.toISOString().split('T')[0];

    await Appointment.findOneAndUpdate(
      { elderlyProfileId: elderlyProfile._id, doctorName: 'Dr. V. Ramanathan' },
      {
        elderlyProfileId: elderlyProfile._id,
        elderlyUserId: elderlyUser._id,
        createdBy: caretakerUser._id,
        doctorName: 'Dr. V. Ramanathan',
        specialty: 'Cardiologist',
        hospitalOrClinic: 'Apollo Specialty Hospital, Greams Road',
        date: apptDate,
        time: '11:00',
        purpose: 'Quarterly blood pressure & cardiovascular checkup',
        status: 'upcoming',
      },
      { upsert: true }
    );

    // 8. Audit Log
    await AuditLog.create({
      elderlyProfileId: elderlyProfile._id,
      performedBy: caretakerUser._id,
      action: 'SYSTEM_SEEDED',
      details: 'Demo environment initialized with sample elderly profile, prescriptions, and care team.',
    });

    res.status(200).json({
      success: true,
      message: 'Demo dataset successfully initialized in MongoDB!',
      credentials: {
        elderly: { email: 'ramesh@eldercare.com', password: 'password123', name: 'Ramesh Patel' },
        caretaker: { email: 'priya@eldercare.com', password: 'password123', name: 'Priya Sharma (Nurse)' },
        family: { email: 'arun@eldercare.com', password: 'password123', name: 'Arun Patel' },
      },
      passcode: '849201',
    });
  } catch (error) {
    console.error('Seed Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
