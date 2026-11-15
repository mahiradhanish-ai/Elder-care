import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', speechCode: 'en-IN' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்', speechCode: 'ta-IN' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', speechCode: 'hi-IN' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు', speechCode: 'te-IN' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ', speechCode: 'kn-IN' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം', speechCode: 'ml-IN' },
];

export const translations = {
  en: {
    // Nav & Common
    dashboard: 'Dashboard',
    medications: 'Medications',
    appointments: 'Appointments',
    careTeam: 'Care Team',
    adherence: 'Medication Adherence',
    auditTimeline: 'Audit Timeline',
    profileSettings: 'Profile & Health Settings',
    mainNav: 'Main Navigation',
    signOut: 'Sign Out',
    patient: 'Patient',
    notifications: 'Notifications',
    markAllRead: 'Mark all read',
    noNotifications: 'No notifications right now',
    save: 'Save',
    cancel: 'Cancel',
    loading: 'Loading...',
    refresh: 'Refresh',

    // Elderly Dashboard
    personalCompanion: 'Personal Care Companion',
    welcome: 'Welcome',
    todaySchedule: "Today's Medication Schedule",
    tapGreenButton: 'Tap the large green button as soon as you take each dose',
    markTaken: 'Mark as Taken',
    taken: 'Taken',
    pending: 'Pending',
    missed: 'Missed',
    skipped: 'Skipped',
    unconfirmed: 'Unconfirmed',
    noDosesToday: 'No medication doses scheduled for today!',
    enjoyDay: 'Enjoy your morning and stay well-rested.',
    dosage: 'Dosage',
    clickToTalk: 'Voice Assistant',
    voiceHelp: 'Voice Guidance',
    nextAppointment: 'Next Doctor Visit',
    upcomingCheckup: 'Upcoming clinical checkup',
    emergencyContact: 'Emergency Contact',
    fastDial: 'Family & Caregiver Fast-Dial',
    callNow: 'Call Now',
    careTeamPasscode: 'Care Team Passcode',
    doseConfirmedTaken: 'marked as taken. Great job!',

    // Medication Due Reminder Banner & Alarm
    medicationDueNow: 'Medication Due Now',
    timeToTakeMed: 'It is time to take your scheduled dose:',
    scheduledTime: 'Scheduled Time',
    snoozeDismiss: 'Dismiss Reminder',
    alarmSounding: 'Audible alarm active',
    muteAlarm: 'Mute Sound',
    enableNotifications: 'Enable Browser Notifications',
    notificationsEnabled: 'Notifications Enabled',

    // Caretaker Dashboard
    caretakerConsole: 'Caretaker Supervision Console',
    monitoringPatient: 'Monitoring',
    addMedication: 'Add Medication',
    takenDoses: 'Taken Doses',
    pendingToday: 'Pending Today',
    unconfirmedDoses: 'Unconfirmed',
    adherenceRate: 'Adherence Rate',
    todaysDoseLogs: "Today's Dose Logs",
    viewAllPrescriptions: 'View All Prescriptions',
    overrideTaken: 'Override: Taken',
    markMissed: 'Mark Missed',
    unconfirmedGraceAlert: 'Unconfirmed Doses Exceeding Grace Period',

    // Family Dashboard
    familyHub: 'Family Peace of Mind Hub',
    complianceRate: 'Compliance Rate',
    verifiedTaken: 'Verified Taken',
    weeklyAdherence: 'Weekly Adherence Progress',
    activityAuditTrail: 'Real-time Care Activity Audit Trail',
    callPatientNow: 'Call Patient Now',

    // Prescriptions Management
    prescriptionManagement: 'Prescription Management',
    addNewMedicine: 'Add New Medicine',
    activePrescriptions: 'Active Prescriptions',
    noActiveMeds: 'No active medications registered.',
    medName: 'Medication Name',
    frequency: 'Frequency',
    instructions: 'Instructions',
    prescribingDoctor: 'Prescribing Doctor',
    scheduledTimesList: 'Scheduled Times (Comma-separated 24h format, e.g. 08:30, 13:00, 20:30)',

    // Appointments
    doctorAppointments: 'Doctor Appointments',
    scheduleAppointment: 'Schedule Appointment',
    specialty: 'Specialty',
    hospitalClinic: 'Hospital / Clinic',
    date: 'Date',
    time: 'Time (IST)',
    purpose: 'Purpose',
    markCompleted: 'Mark Completed',
    cancelAppointment: 'Cancel',

    // Care Team
    careCircle: 'Family & Caretaker Circle',
    accessPasscodeLabel: '6-Digit Access Passcode',
    linkWithPasscode: 'Link with Passcode',
    inviteMember: 'Invite Member',
    enterPasscodePrompt: 'Enter the 6-digit code shown on your elderly family member dashboard.',

    // Emergency SOS
    emergencyAssistance: 'EMERGENCY ASSISTANCE',
    needImmediateHelp: 'Need Immediate Help or Medical Attention?',
    emergencySirenSounding: 'Emergency Siren Sounding & Care Team Notified',
    sosButton: 'EMERGENCY SOS',
    confirmSosTitle: 'Emergency SOS Confirmation',
    confirmSosQuestion: 'Do you need immediate medical assistance?',
    activateSosNow: '🚨 ACTIVATE SOS NOW',
    accidentalTap: 'Cancel / Accidental Tap',
    sosActiveNotice: 'An active emergency alert was recorded in your healthcare record.',
    markSosResolved: 'I Am Safe Now — Mark SOS Resolved',
    dial112: 'Dial 112 / 108',
  },

  ta: {
    // Nav & Common
    dashboard: 'முகப்பு பலகை',
    medications: 'மருந்துகள்',
    appointments: 'மருத்துவர் சந்திப்புகள்',
    careTeam: 'பராமரிப்புக் குழு',
    adherence: 'மருந்து ஒழுங்குமுறை',
    auditTimeline: 'செயல்பாட்டு வரலாறு',
    profileSettings: 'சுயவிவரம் & உடல்நலம்',
    mainNav: 'முதன்மை வழிசெலுத்தல்',
    signOut: 'வெளியேறு',
    patient: 'நோயாளி',
    notifications: 'அறிவிப்புகள்',
    markAllRead: 'அனைத்தையும் படித்ததாகக் குறி',
    noNotifications: 'இப்போது புதிய அறிவிப்புகள் இல்லை',
    save: 'சேமிக்க',
    cancel: 'ரத்து செய்',
    loading: 'ஏற்றுகிறது...',
    refresh: 'புதுப்பி',

    // Elderly Dashboard
    personalCompanion: 'தனிப்பட்ட பராமரிப்பு துணை',
    welcome: 'வணக்கம்',
    todaySchedule: 'இன்றைய மருந்து அட்டவணை',
    tapGreenButton: 'மருந்தை எடுத்தவுடன் பெரிய பச்சை பொத்தானைத் தட்டவும்',
    markTaken: 'எடுத்துக்கொண்டேன்',
    taken: 'எடுக்கப்பட்டது',
    pending: 'நிலுவையில்',
    missed: 'தவறியது',
    skipped: 'தவிர்க்கப்பட்டது',
    unconfirmed: 'உறுதிப்படுத்தப்படவில்லை',
    noDosesToday: 'இன்று உங்களுக்கு எந்த மருந்துகளும் திட்டமிடப்படவில்லை!',
    enjoyDay: 'இன்றைய நாளை மகிழ்ச்சியாகவும் ஆரோக்கியமாகவும் கழியுங்கள்.',
    dosage: 'அளவு',
    clickToTalk: 'குரல் உதவியாளர்',
    voiceHelp: 'குரல் வழிகாட்டுதல்',
    nextAppointment: 'அடுத்த மருத்துவர் சந்திப்பு',
    upcomingCheckup: 'வரவிருக்கும் மருத்துவ பரிசோதனை',
    emergencyContact: 'அவசர தொடர்பு',
    fastDial: 'குடும்பம் & பராமரிப்பாளர் அழைப்பு',
    callNow: 'அழைக்கவும்',
    careTeamPasscode: 'பராமரிப்புக் குழு கடவுச்சொல்',
    doseConfirmedTaken: 'எடுக்கப்பட்டதாக பதிவு செய்யப்பட்டது. நன்று!',

    // Medication Due Reminder Banner & Alarm
    medicationDueNow: 'மருந்து எடுக்க வேண்டிய நேரம்',
    timeToTakeMed: 'உங்கள் திட்டமிடப்பட்ட மருந்தை எடுக்க வேண்டிய நேரம் வந்துவிட்டது:',
    scheduledTime: 'திட்டமிடப்பட்ட நேரம்',
    snoozeDismiss: 'நினைவூட்டலை மூடு',
    alarmSounding: 'எச்சரிக்கை ஒலி ஒலிக்கிறது',
    muteAlarm: 'ஒலியை முடக்கு',
    enableNotifications: 'உலாவி அறிவிப்புகளை இயக்கு',
    notificationsEnabled: 'அறிவிப்புகள் இயக்கப்பட்டது',

    // Caretaker Dashboard
    caretakerConsole: 'பராமரிப்பாளர் மேற்பார்வை பலகை',
    monitoringPatient: 'கண்காணிப்பு',
    addMedication: 'மருந்து சேர்க்க',
    takenDoses: 'எடுக்கப்பட்ட மருந்துகள்',
    pendingToday: 'இன்று நிலுவையில் உள்ளவை',
    unconfirmedDoses: 'உறுதிப்படுத்தப்படாதவை',
    adherenceRate: 'கடைபிடிப்பு விகிதம்',
    todaysDoseLogs: 'இன்றைய மருந்து பதிவுகள்',
    viewAllPrescriptions: 'அனைத்து மருந்துச்சீட்டுகளையும் பார்க்க',
    overrideTaken: 'எடுக்கப்பட்டதாக மாற்று',
    markMissed: 'தவறியதாகக் குறி',
    unconfirmedGraceAlert: 'அனுமதிக்கப்பட்ட நேரத்தைத் தாண்டிய மருந்துகள்',

    // Family Dashboard
    familyHub: 'குடும்ப மன அமைதி மையம்',
    complianceRate: 'கடைபிடிப்பு விகிதம்',
    verifiedTaken: 'சரிபார்க்கப்பட்டது',
    weeklyAdherence: 'வாராந்திர மருந்து முன்னேற்றம்',
    activityAuditTrail: 'நேரலை பராமரிப்பு பதிவு',
    callPatientNow: 'நோயாளியை அழைக்கவும்',

    // Prescriptions Management
    prescriptionManagement: 'மருந்துச்சீட்டு மேலாண்மை',
    addNewMedicine: 'புதிய மருந்து சேர்க்க',
    activePrescriptions: 'செயலில் உள்ள மருந்துகள்',
    noActiveMeds: 'செயலில் உள்ள மருந்துகள் எதுவும் பதிவு செய்யப்படவில்லை.',
    medName: 'மருந்து பெயர்',
    frequency: 'அதிர்வெண்',
    instructions: 'அறிவுறுத்தல்கள்',
    prescribingDoctor: 'பரிந்துரைத்த மருத்துவர்',
    scheduledTimesList: 'திட்டமிடப்பட்ட நேரங்கள் (காற்புள்ளியால் பிரிக்கப்பட்ட 24 மணி நேர வடிவம், எ.கா. 08:30, 13:00, 20:30)',

    // Appointments
    doctorAppointments: 'மருத்துவர் சந்திப்புகள்',
    scheduleAppointment: 'சந்திப்பைத் திட்டமிடுங்கள்',
    specialty: 'சிறப்புத் துறை',
    hospitalClinic: 'மருத்துவமனை / கிளினிக்',
    date: 'தேதி',
    time: 'நேரம் (IST)',
    purpose: 'நோக்கம்',
    markCompleted: 'நிறைவடைந்ததாகக் குறி',
    cancelAppointment: 'ரத்து செய்',

    // Care Team
    careCircle: 'குடும்பம் மற்றும் பராமரிப்பாளர் வட்டம்',
    accessPasscodeLabel: '6-இலக்க அணுகல் கடவுச்சொல்',
    linkWithPasscode: 'கடவுச்சொல் மூலம் இணைக்கவும்',
    inviteMember: 'உறுப்பினரை அழைக்கவும்',
    enterPasscodePrompt: 'உங்கள் முதியவர் டாஷ்போர்டில் காட்டப்பட்டுள்ள 6 இலக்கக் குறியீட்டை உள்ளிடவும்.',

    // Emergency SOS
    emergencyAssistance: 'அவசர உதவி',
    needImmediateHelp: 'உடனடி மருத்துவ உதவி தேவையா?',
    emergencySirenSounding: 'அவசர சைரன் ஒலிக்கிறது & பராமரிப்பாளர்களுக்கு தகவல் அனுப்பப்பட்டது',
    sosButton: 'அவசர SOS',
    confirmSosTitle: 'அவசர SOS உறுதிப்படுத்தல்',
    confirmSosQuestion: 'உங்களுக்கு உடனடி மருத்துவ உதவி தேவையா?',
    activateSosNow: '🚨 இப்போது SOS-ஐ இயக்கு',
    accidentalTap: 'ரத்து செய் / தற்செயலாகத் தொட்டேன்',
    sosActiveNotice: 'உங்கள் உடல்நலப் பதிவேட்டில் செயலில் உள்ள அவசர எச்சரிக்கை பதிவு செய்யப்பட்டுள்ளது.',
    markSosResolved: 'நான் இப்போது பாதுகாப்பாக உள்ளேன் — SOS-ஐ நிறைவு செய்',
    dial112: '112 / 108 அழைக்கவும்',
  },

  hi: {
    // Nav & Common
    dashboard: 'डैशबोर्ड',
    medications: 'दवाइयाँ',
    appointments: 'डॉक्टर अपॉइंटमेंट',
    careTeam: 'देखभाल टीम',
    adherence: 'दवा अनुपालन',
    auditTimeline: 'गतिविधि इतिहास',
    profileSettings: 'प्रोफ़ाइल और स्वास्थ्य विवरण',
    mainNav: 'मुख्य मेनू',
    signOut: 'साइन आउट',
    patient: 'मरीज़',
    notifications: 'सूचनाएं',
    markAllRead: 'सभी को पढ़ा हुआ चिह्नित करें',
    noNotifications: 'अभी कोई नई सूचना नहीं है',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    loading: 'लोड हो रहा है...',
    refresh: 'ताज़ा करें',

    // Elderly Dashboard
    personalCompanion: 'व्यक्तिगत देखभाल साथी',
    welcome: 'नमस्ते',
    todaySchedule: 'आज की दवा अनुसूची',
    tapGreenButton: 'दवा लेते ही बड़े हरे बटन को दबाएं',
    markTaken: 'ले ली है',
    taken: 'ले ली',
    pending: 'लंबित',
    missed: 'छूट गई',
    skipped: 'छोड़ दी',
    unconfirmed: 'अपुष्ट',
    noDosesToday: 'आज कोई दवा निर्धारित नहीं है!',
    enjoyDay: 'आपका दिन शुभ और स्वस्थ रहे।',
    dosage: 'मात्रा',
    clickToTalk: 'आवाज सहायक',
    voiceHelp: 'ध्वनि मार्गदर्शन',
    nextAppointment: 'अगली डॉक्टर मुलाक़ात',
    upcomingCheckup: 'आगामी स्वास्थ्य जांच',
    emergencyContact: 'आपातकालीन संपर्क',
    fastDial: 'परिवार और देखभालकर्ता को कॉल करें',
    callNow: 'कॉल करें',
    careTeamPasscode: 'देखभाल टीम पासकोड',
    doseConfirmedTaken: 'दवा ले ली गई के रूप में दर्ज हुई। बहुत बढ़िया!',

    // Medication Due Reminder Banner & Alarm
    medicationDueNow: 'दवा लेने का समय हो गया है',
    timeToTakeMed: 'आपकी निर्धारित दवा लेने का समय आ गया है:',
    scheduledTime: 'निर्धारित समय',
    snoozeDismiss: 'रिमाइंडर हटाएं',
    alarmSounding: 'अलार्म बज रहा है',
    muteAlarm: 'आवाज़ बंद करें',
    enableNotifications: 'ब्राउज़र सूचनाएं सक्षम करें',
    notificationsEnabled: 'सूचनाएं सक्षम हैं',

    // Caretaker Dashboard
    caretakerConsole: 'देखभालकर्ता नियंत्रण कक्ष',
    monitoringPatient: 'निगरानी',
    addMedication: 'दवा जोड़ें',
    takenDoses: 'ली गई दवाइयां',
    pendingToday: 'आज लंबित',
    unconfirmedDoses: 'अपुष्ट खुराक',
    adherenceRate: 'अनुपालन दर',
    todaysDoseLogs: 'आज की खुराक प्रविष्टियां',
    viewAllPrescriptions: 'सभी पर्चियां देखें',
    overrideTaken: 'ली गई चिह्नित करें',
    markMissed: 'छूट गई चिह्नित करें',
    unconfirmedGraceAlert: 'समय सीमा पार कर चुकी खुराकें',

    // Family Dashboard
    familyHub: 'पारिवारिक शांति केंद्र',
    complianceRate: 'अनुपालन दर',
    verifiedTaken: 'सत्यापित ली गई',
    weeklyAdherence: 'साप्ताहिक दवा प्रगति',
    activityAuditTrail: 'लाइव देखभाल गतिविधि',
    callPatientNow: 'मरीज़ को कॉल करें',

    // Prescriptions Management
    prescriptionManagement: 'दवा पर्ची प्रबंधन',
    addNewMedicine: 'नई दवा जोड़ें',
    activePrescriptions: 'सक्रिय दवाइयाँ',
    noActiveMeds: 'कोई सक्रिय दवा पंजीकृत नहीं है।',
    medName: 'दवा का नाम',
    frequency: 'आवृत्ति',
    instructions: 'निर्देश',
    prescribingDoctor: 'परामर्शदाता डॉक्टर',
    scheduledTimesList: 'निर्धारित समय (अल्पविराम से अलग 24-घंटे प्रारूप, उदा. 08:30, 13:00, 20:30)',

    // Appointments
    doctorAppointments: 'डॉक्टर अपॉइंटमेंट',
    scheduleAppointment: 'अपॉइंटमेंट तय करें',
    specialty: 'विशेषज्ञता',
    hospitalClinic: 'अस्पताल / क्लिनिक',
    date: 'तारीख',
    time: 'समय (IST)',
    purpose: 'उद्देश्य',
    markCompleted: 'पूर्ण चिह्नित करें',
    cancelAppointment: 'रद्द करें',

    // Care Team
    careCircle: 'परिवार और देखभालकर्ता समूह',
    accessPasscodeLabel: '6-अंकीय एक्सेस पासकोड',
    linkWithPasscode: 'पासकोड से जुड़ें',
    inviteMember: 'सदस्य को आमंत्रित करें',
    enterPasscodePrompt: 'बुजुर्ग परिजन के डैशबोर्ड पर प्रदर्शित 6-अंकीय कोड दर्ज करें।',

    // Emergency SOS
    emergencyAssistance: 'आपातकालीन सहायता',
    needImmediateHelp: 'क्या आपको तत्काल चिकित्सा सहायता चाहिए?',
    emergencySirenSounding: 'आपातकालीन सायरन बज रहा है और देखभाल टीम को सूचित कर दिया गया है',
    sosButton: 'आपातकालीन SOS',
    confirmSosTitle: 'आपातकालीन SOS पुष्टि',
    confirmSosQuestion: 'क्या आपको तुरंत सहायता की आवश्यकता है?',
    activateSosNow: '🚨 अभी SOS सक्रिय करें',
    accidentalTap: 'रद्द करें / गलती से छुआ',
    sosActiveNotice: 'आपके स्वास्थ्य रिकॉर्ड में आपातकालीन चेतावनी दर्ज हो गई है।',
    markSosResolved: 'मैं अब सुरक्षित हूँ — SOS हल करें',
    dial112: '112 / 108 डायल करें',
  },

  te: {
    // Nav & Common
    dashboard: 'డాష్‌బోర్డ్',
    medications: 'మందులు',
    appointments: 'డాక్టర్ అపాయింట్‌మెంట్లు',
    careTeam: 'సంరక్షణ బృందం',
    adherence: 'మందుల నియమపాలన',
    auditTimeline: 'కార్యకలాపాల చరిత్ర',
    profileSettings: 'ప్రొఫైల్ & ఆరోగ్య వివరాలు',
    mainNav: 'ప్రధాన నావిగేషన్',
    signOut: 'లాగ్ అవుట్',
    patient: 'రోగి',
    notifications: 'నోటిఫికేషన్లు',
    markAllRead: 'అన్నీ చదివినట్లు గుర్తించు',
    noNotifications: 'ప్రస్తుతం నోటిఫికేషన్లు లేవు',
    save: 'భద్రపరచు',
    cancel: 'రద్దు చేయి',
    loading: 'లోడ్ అవుతోంది...',
    refresh: 'రిఫ్రెష్',

    // Elderly Dashboard
    personalCompanion: 'వ్యక్తిగత ఆరోగ్య రక్షకుడు',
    welcome: 'స్వాగతం',
    todaySchedule: 'నేటి మందుల సమయపట్టిక',
    tapGreenButton: 'మందు తీసుకున్న వెంటనే పెద్ద ఆకుపచ్చ బటన్‌ను నొక్కండి',
    markTaken: 'తీసుకున్నాను',
    taken: 'తీసుకున్నారు',
    pending: 'వేచి ఉంది',
    missed: 'తీసుకోలేదు',
    skipped: 'దాటవేశారు',
    unconfirmed: 'ధృవీకరించబడలేదు',
    noDosesToday: 'ఈ రోజుకు మందులు ఏవీ లేవు!',
    enjoyDay: 'ఆరోగ్యంగా, ఆనందంగా ఉండండి.',
    dosage: 'మోతాదు',
    clickToTalk: 'వాయిస్ అసిస్టెంట్',
    voiceHelp: 'వాయిస్ మార్గదర్శకత్వం',
    nextAppointment: 'తదుపరి డాక్టర్ సంప్రదింపు',
    upcomingCheckup: 'రాబోయే ఆరోగ్య పరీక్ష',
    emergencyContact: 'అత్యవసర సంప్రదింపు',
    fastDial: 'కుటుంబం & సంరక్షకునికి కాల్ చేయండి',
    callNow: 'కాల్ చేయండి',
    careTeamPasscode: 'కేర్ టీమ్ పాస్‌కోడ్',
    doseConfirmedTaken: 'మందు తీసుకున్నట్లు నమోదు చేయబడింది. చాలా మంచిది!',

    // Medication Due Reminder Banner & Alarm
    medicationDueNow: 'మందులు తీసుకునే సమయం ఆసన్నమైంది',
    timeToTakeMed: 'మీరు మందు తీసుకోవలసిన సమయం ఇది:',
    scheduledTime: 'నిర్ణీత సమయం',
    snoozeDismiss: 'రిమైండర్ మూసివేయి',
    alarmSounding: 'అలారం మోగుతోంది',
    muteAlarm: 'శబ్దం ఆపివేయి',
    enableNotifications: 'బ్రౌజర్ నోటిఫికేషన్లు ప్రారంభించండి',
    notificationsEnabled: 'నోటిఫికేషన్లు ప్రారంభించబడ్డాయి',

    // Caretaker Dashboard
    caretakerConsole: 'సంరక్షకుల పర్యవేక్షణ బోర్డు',
    monitoringPatient: 'పర్యవేక్షణ',
    addMedication: 'మందును జోడించు',
    takenDoses: 'తీసుకున్న మందులు',
    pendingToday: 'నేడు మిగిలినవి',
    unconfirmedDoses: 'ధృవీకరించనివి',
    adherenceRate: 'నియమపాలన శాతం',
    todaysDoseLogs: 'నేటి మందుల వివరాలు',
    viewAllPrescriptions: 'అన్ని ప్రిస్క్రిప్షన్లను చూడండి',
    overrideTaken: 'తీసుకున్నట్లు మార్చు',
    markMissed: 'తీసుకోలేదని గుర్తించు',
    unconfirmedGraceAlert: 'సమయం మించిన అన్-కన్ఫర్మ్డ్ మందులు',

    // Family Dashboard
    familyHub: 'కుటుంబ ప్రశాంతత కేంద్రం',
    complianceRate: 'నియమపాలన శాతం',
    verifiedTaken: 'ధృవీకరించబడినవి',
    weeklyAdherence: 'వారపు మందుల పురోగతి',
    activityAuditTrail: 'ప్రత్యక్ష కార్యకలాపాల రికార్డు',
    callPatientNow: 'రోగికి కాల్ చేయండి',

    // Prescriptions Management
    prescriptionManagement: 'ప్రిస్క్రిప్షన్ నిర్వహణ',
    addNewMedicine: 'కొత్త మందును జోడించండి',
    activePrescriptions: 'ప్రస్తుత మందులు',
    noActiveMeds: 'ప్రస్తుతం మందులు నమోదు చేయబడలేదు.',
    medName: 'మందు పేరు',
    frequency: 'ఫ్రీక్వెన్సీ',
    instructions: 'సూచనలు',
    prescribingDoctor: 'సూచించిన డాక్టర్',
    scheduledTimesList: 'నిర్ణీత సమయాలు (కామాలతో వేరుచేసిన 24-గంటల ఫార్మాట్, ఉదా. 08:30, 13:00, 20:30)',

    // Appointments
    doctorAppointments: 'డాక్టర్ అపాయింట్‌మెంట్లు',
    scheduleAppointment: 'అపాయింట్‌మెంట్ నమోదు చేయండి',
    specialty: 'స్పెషాలిటీ',
    hospitalClinic: 'హాస్పిటల్ / క్లినిక్',
    date: 'తేదీ',
    time: 'సమయం (IST)',
    purpose: 'ఉద్దేశ్యం',
    markCompleted: 'పూర్తయినట్లు గుర్తించు',
    cancelAppointment: 'రద్దు చేయి',

    // Care Team
    careCircle: 'కుటుంబం & సంరక్షకుల బృందం',
    accessPasscodeLabel: '6-అంకెల యాక్సెస్ పాస్‌కోడ్',
    linkWithPasscode: 'పాస్‌కోడ్‌తో అనుసంధానించండి',
    inviteMember: 'సభ్యుడిని ఆహ్వానించండి',
    enterPasscodePrompt: 'పెద్దల డాష్‌బోర్డ్‌లో కనిపించే 6-అంకెల పాస్‌కోడ్‌ను నమోదు చేయండి.',

    // Emergency SOS
    emergencyAssistance: 'అత్యవసర సహాయం',
    needImmediateHelp: 'మీకు వెంటనే వైద్య సహాయం అవసరమా?',
    emergencySirenSounding: 'అత్యవసర సైరన్ మోగుతోంది & సంరక్షకులకు సమాచారం చేరింది',
    sosButton: 'అత్యవసర SOS',
    confirmSosTitle: 'అత్యవసర SOS నిర్ధారణ',
    confirmSosQuestion: 'మీకు తక్షణ సహాయం కావాలా?',
    activateSosNow: '🚨 ఇప్పుడే SOS యాక్టివేట్ చేయండి',
    accidentalTap: 'రద్దు చేయి / పొరపాటున నొక్కాను',
    sosActiveNotice: 'మీ ఆరోగ్య రికార్డులో అత్యవసర అలర్ట్ నమోదు చేయబడింది.',
    markSosResolved: 'నేను సురక్షితంగా ఉన్నాను — SOS ముగించు',
    dial112: '112 / 108 కాల్ చేయండి',
  },

  kn: {
    // Nav & Common
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    medications: 'ಔಷಧಿಗಳು',
    appointments: 'ವೈದ್ಯರ ಭೇಟಿ',
    careTeam: 'ಆರೈಕೆ ತಂಡ',
    adherence: 'ಔಷಧಿ ಪಾಲನೆ',
    auditTimeline: 'ಚಟುವಟಿಕೆ ಇತಿಹಾಸ',
    profileSettings: 'ಪ್ರೊಫೈಲ್ ಮತ್ತು ಆರೋಗ್ಯ ವಿವರ',
    mainNav: 'ಮುಖ್ಯ ನ್ಯಾವಿಗೇಷನ್',
    signOut: 'ಸೈನ್ ಔಟ್',
    patient: 'ರೋಗಿ',
    notifications: 'ಅಧಿಸೂಚನೆಗಳು',
    markAllRead: 'ಎಲ್ಲವನ್ನೂ ಓದಲಾಗಿದೆ ಎಂದು ಗುರುತಿಸಿ',
    noNotifications: 'ಯಾವುದೇ ಹೊಸ ಅಧಿಸೂಚನೆಗಳಿಲ್ಲ',
    save: 'ಉಳಿಸಿ',
    cancel: 'ರದ್ದುಮಾಡಿ',
    loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
    refresh: 'ರಿಫ್ರೆಶ್ ಮಾಡಿ',

    // Elderly Dashboard
    personalCompanion: 'ವೈಯಕ್ತಿಕ ಆರೋಗ್ಯ ಒಡನಾಡಿ',
    welcome: 'ಸ್ವಾಗತ',
    todaySchedule: 'ಇಂದಿನ ಔಷಧಿ ವೇಳಾಪಟ್ಟಿ',
    tapGreenButton: 'ಔಷಧಿ ಸೇವಿಸಿದ ತಕ್ಷಣ ದೊಡ್ಡ ಹಸಿರು ಬಟನ್ ಒತ್ತಿರಿ',
    markTaken: 'ತೆಗೆದುಕೊಂಡಿದ್ದೇನೆ',
    taken: 'ತೆಗೆದುಕೊಳ್ಳಲಾಗಿದೆ',
    pending: 'ಬಾಕಿ ಇದೆ',
    missed: 'ತಪ್ಪಿಹೋಗಿದೆ',
    skipped: 'ಬಿಡಲಾಗಿದೆ',
    unconfirmed: 'ದೃಢೀಕರಿಸಲಾಗಿಲ್ಲ',
    noDosesToday: 'ಇಂದು ಯಾವುದೇ ಔಷಧಿ ನಿಗದಿಯಾಗಿಲ್ಲ!',
    enjoyDay: 'ಆರೋಗ್ಯಕರ ಮತ್ತು ಸಂತೋಷದ ದಿನ ನಿಮ್ಮದಾಗಲಿ.',
    dosage: 'ಪ್ರಮಾಣ',
    clickToTalk: 'ಧ್ವನಿ ಸಹಾಯಕ',
    voiceHelp: 'ಧ್ವನಿ ಮಾರ್ಗದರ್ಶನ',
    nextAppointment: 'ಮುಂದಿನ ವೈದ್ಯರ ಭೇಟಿ',
    upcomingCheckup: 'ಮುಂದಿನ ತಪಾಸಣೆ',
    emergencyContact: 'ತುರ್ತು ಸಂಪರ್ಕ',
    fastDial: 'ಕುಟುಂಬ ಮತ್ತು ಪಾಲಕರಿಗೆ ಕರೆ',
    callNow: 'ಕರೆ ಮಾಡಿ',
    careTeamPasscode: 'ಆರೈಕೆ ತಂಡದ ಪಾಸ್‌ಕೋಡ್',
    doseConfirmedTaken: 'ಔಷಧಿ ತೆಗೆದುಕೊಂಡಿರುವುದು ದಾಖಲಾಗಿದೆ. ಉತ್ತಮ!',

    // Medication Due Reminder Banner & Alarm
    medicationDueNow: 'ಔಷಧಿ ತೆಗೆದುಕೊಳ್ಳುವ ಸಮಯವಾಗಿದೆ',
    timeToTakeMed: 'ನಿಮ್ಮ ನಿಗದಿತ ಔಷಧಿಯನ್ನು ತೆಗೆದುಕೊಳ್ಳುವ ಸಮಯ:',
    scheduledTime: 'ನಿಗದಿತ ಸಮಯ',
    snoozeDismiss: 'ಜ್ಞಾಪನೆ ಮುಚ್ಚಿ',
    alarmSounding: 'ಅಲಾರಂ ಧ್ವನಿಸುತ್ತಿದೆ',
    muteAlarm: 'ಧ್ವನಿ ಆಫ್ ಮಾಡಿ',
    enableNotifications: 'ಬ್ರೌಸರ್ ಅಧಿಸೂಚನೆಗಳನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿ',
    notificationsEnabled: 'ಅಧಿಸೂಚನೆಗಳು ಸಕ್ರಿಯವಾಗಿವೆ',

    // Caretaker Dashboard
    caretakerConsole: 'ಪಾಲಕರ ಮೇಲ್ವಿಚಾರಣಾ ಕನ್ಸೋಲ್',
    monitoringPatient: 'ಮೇಲ್ವಿಚಾರಣೆ',
    addMedication: 'ಔಷಧಿ ಸೇರಿಸಿ',
    takenDoses: 'ತೆಗೆದುಕೊಂಡ ಔಷಧಿಗಳು',
    pendingToday: 'ಇಂದು ಬಾಕಿ ಇರುವುದು',
    unconfirmedDoses: 'ದೃಢೀಕರಿಸದ ಪ್ರಮಾಣ',
    adherenceRate: 'ಪಾಲನಾ ದರ',
    todaysDoseLogs: 'ಇಂದಿನ ಔಷಧಿ ವಿವರಗಳು',
    viewAllPrescriptions: 'ಎಲ್ಲಾ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ವೀಕ್ಷಿಸಿ',
    overrideTaken: 'ತೆಗೆದುಕೊಳ್ಳಲಾಗಿದೆ ಎಂದು ಗುರುತಿಸಿ',
    markMissed: 'ತಪ್ಪಿದೆ ಎಂದು ಗುರುತಿಸಿ',
    unconfirmedGraceAlert: 'ಸಮಯ ಮೀರಿದ ದೃಢೀಕರಿಸದ ಔಷಧಿಗಳು',

    // Family Dashboard
    familyHub: 'ಕುಟುಂಬದ ನೆಮ್ಮದಿ ಕೇಂದ್ರ',
    complianceRate: 'ಪಾಲನಾ ಪ್ರಮಾಣ',
    verifiedTaken: 'ದೃಢೀಕೃತ ತೆಗೆದುಕೊಂಡದ್ದು',
    weeklyAdherence: 'ವಾರದ ಔಷಧಿ ಪ್ರಗತಿ',
    activityAuditTrail: 'ನೈಜ ಸಮಯದ ಚಟುವಟಿಕೆ ದಾಖಲೆ',
    callPatientNow: 'ರೋಗಿಗೆ ಕರೆ ಮಾಡಿ',

    // Prescriptions Management
    prescriptionManagement: 'ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ನಿರ್ವಹಣೆ',
    addNewMedicine: 'ಹೊಸ ಔಷಧಿ ಸೇರಿಸಿ',
    activePrescriptions: 'ಚಾಲ್ತಿಯಲ್ಲಿರುವ ಔಷಧಿಗಳು',
    noActiveMeds: 'ಯಾವುದೇ ಸಕ್ರಿಯ ಔಷಧಿ ನೋಂದಾಯಿಸಿಲ್ಲ.',
    medName: 'ಔಷಧಿಯ ಹೆಸರು',
    frequency: 'ಆವರ್ತನ',
    instructions: 'ಸೂಚನೆಗಳು',
    prescribingDoctor: 'ಸೂಚಿಸಿದ ವೈದ್ಯರು',
    scheduledTimesList: 'ನಿಗದಿತ ಸಮಯಗಳು (ವಿರಾಮಚಿಹ್ನೆಯಿಂದ ಬೇರ್ಪಡಿಸಿದ 24 ಗಂಟೆ ಸ್ವರೂಪ, ಉದಾ. 08:30, 13:00, 20:30)',

    // Appointments
    doctorAppointments: 'ವೈದ್ಯರ ಭೇಟಿಗಳು',
    scheduleAppointment: 'ಭೇಟಿಯನ್ನು ನಿಗದಿಪಡಿಸಿ',
    specialty: 'ವಿಭಾಗ',
    hospitalClinic: 'ಆಸ್ಪತ್ರೆ / ಕ್ಲಿನಿಕ್',
    date: 'ದಿನಾಂಕ',
    time: 'ಸಮಯ (IST)',
    purpose: 'ಉದ್ದೇಶ',
    markCompleted: 'ಪೂರ್ಣಗೊಂಡಿದೆ ಎಂದು ಗುರುತಿಸಿ',
    cancelAppointment: 'ರದ್ದುಮಾಡಿ',

    // Care Team
    careCircle: 'ಕುಟುಂಬ ಮತ್ತು ಆರೈಕೆದಾರರ ವಲಯ',
    accessPasscodeLabel: '6-ಅಂಕಿಯ ಪ್ರವೇಶ ಪಾಸ್‌ಕೋಡ್',
    linkWithPasscode: 'ಪಾಸ್‌ಕೋಡ್‌ನೊಂದಿಗೆ ಲಿಂಕ್ ಮಾಡಿ',
    inviteMember: 'ಸದಸ್ಯರನ್ನು ಆಹ್ವಾನಿಸಿ',
    enterPasscodePrompt: 'ಹಿರಿಯರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ನಲ್ಲಿರುವ 6-ಅಂಕಿಯ ಕೋಡ್ ನಮೂದಿಸಿ.',

    // Emergency SOS
    emergencyAssistance: 'ತುರ್ತು ನೆರವು',
    needImmediateHelp: 'ತಕ್ಷಣದ ವೈದ್ಯಕೀಯ ನೆರವು ಬೇಕೇ?',
    emergencySirenSounding: 'ತುರ್ತು ಸೈರನ್ ಧ್ವನಿಸುತ್ತಿದೆ ಮತ್ತು ಆರೈಕೆದಾರರಿಗೆ ಮಾಹಿತಿ ನೀಡಲಾಗಿದೆ',
    sosButton: 'ತುರ್ತು SOS',
    confirmSosTitle: 'ತುರ್ತು SOS ದೃಢೀಕರಣ',
    confirmSosQuestion: 'ನಿಮಗೆ ತಕ್ಷಣದ ಸಹಾಯ ಬೇಕೇ?',
    activateSosNow: '🚨 ಈಗಲೇ SOS ಸಕ್ರಿಯಗೊಳಿಸಿ',
    accidentalTap: 'ರದ್ದು / ತಪ್ಪಾಗಿ ಒತ್ತಲಾಗಿದೆ',
    sosActiveNotice: 'ನಿಮ್ಮ ಆರೋಗ್ಯ ದಾಖಲೆಯಲ್ಲಿ ತುರ್ತು ಎಚ್ಚರಿಕೆ ದಾಖಲಾಗಿದೆ.',
    markSosResolved: 'ನಾನು ಸುರಕ್ಷಿತವಾಗಿದ್ದೇನೆ — SOS ಮುಕ್ತಾಯಗೊಳಿಸಿ',
    dial112: '112 / 108 ಕರೆ ಮಾಡಿ',
  },

  ml: {
    // Nav & Common
    dashboard: 'ഡാഷ്‌ബോർഡ്',
    medications: 'മരുന്നുകൾ',
    appointments: 'ഡോക്ടർ കൂടിക്കാഴ്ച',
    careTeam: 'പരിചരണ സംഘം',
    adherence: 'മരുന്ന് പാലനം',
    auditTimeline: 'പ്രവർത്തന ചരിത്രം',
    profileSettings: 'പ്രൊഫൈലും ആരോഗ്യ വിവരങ്ങളും',
    mainNav: 'പ്രധാന നാവിഗേഷൻ',
    signOut: 'ലോഗ് ഔട്ട്',
    patient: 'രോഗി',
    notifications: 'അറിയിപ്പുകൾ',
    markAllRead: 'എല്ലാം വായിച്ചതായി അടയാളപ്പെടുത്തുക',
    noNotifications: 'പുതിയ അറിയിപ്പുകൾ ഒന്നുമില്ല',
    save: 'സംരക്ഷിക്കുക',
    cancel: 'റദ്ദാക്കുക',
    loading: 'ലോഡ് ചെയ്യുന്നു...',
    refresh: 'പുതുക്കുക',

    // Elderly Dashboard
    personalCompanion: 'വ്യക്തിഗത ആരോഗ്യ സഹായി',
    welcome: 'സ്വാഗതം',
    todaySchedule: 'ഇന്നത്തെ മരുന്ന് സമയക്രമം',
    tapGreenButton: 'മരുന്ന് കഴിച്ച ഉടൻ വലിയ പച്ച ബട്ടൺ അമർത്തുക',
    markTaken: 'കഴിച്ചു',
    taken: 'കഴിച്ചു',
    pending: 'ബാക്കി',
    missed: 'തടസ്സപ്പെട്ടു',
    skipped: 'ഒഴിവാക്കി',
    unconfirmed: 'സ്ഥിരീകരിച്ചിട്ടില്ല',
    noDosesToday: 'ഇന്ന് കഴിക്കേണ്ട മരുന്നുകൾ ഒന്നുമില്ല!',
    enjoyDay: 'ആരോഗ്യത്തോടെ സന്തോഷത്തോടെ ഇരിക്കുക.',
    dosage: 'അളവ്',
    clickToTalk: 'ശബ്ദ സഹായി',
    voiceHelp: 'ശബ്ദ മാർഗ്ഗനിർദ്ദേശം',
    nextAppointment: 'അടുത്ത ഡോക്ടർ പരിശോധന',
    upcomingCheckup: 'വരാനിരിക്കുന്ന പരിശോധന',
    emergencyContact: 'അടിയന്തിര സമ്പർക്കം',
    fastDial: 'കുടുംബാംഗത്തെയും പരിചാരകനെയും വിളിക്കുക',
    callNow: 'വിളിക്കുക',
    careTeamPasscode: 'കെയർ ടീം പാസ്‌കോഡ്',
    doseConfirmedTaken: 'മരുന്ന് കഴിച്ചതായി രേഖപ്പെടുത്തി. വളരെ നല്ലത്!',

    // Medication Due Reminder Banner & Alarm
    medicationDueNow: 'മരുന്ന് കഴിക്കേണ്ട സമയം',
    timeToTakeMed: 'നിശ്ചിത മരുന്ന് കഴിക്കേണ്ട സമയമായി:',
    scheduledTime: 'നിശ്ചിത സമയം',
    snoozeDismiss: 'ഓർമ്മപ്പെടുത്തൽ മാറ്റുക',
    alarmSounding: 'അലാറം മുഴങ്ങുന്നു',
    muteAlarm: 'ശബ്ദം നിശബ്ദമാക്കുക',
    enableNotifications: 'ബ്രൗസർ അറിയിപ്പുകൾ പ്രവർത്തനക്ഷമമാക്കുക',
    notificationsEnabled: 'അറിയിപ്പുകൾ പ്രവർത്തനക്ഷമമാക്കി',

    // Caretaker Dashboard
    caretakerConsole: 'പരിചാരക നിയന്ത്രണ കേന്ദ്രം',
    monitoringPatient: 'നിരീക്ഷണം',
    addMedication: 'മരുന്ന് ചേർക്കുക',
    takenDoses: 'കഴിച്ച മരുന്നുകൾ',
    pendingToday: 'ഇന്ന് ബാക്കിയുള്ളവ',
    unconfirmedDoses: 'സ്ഥിരീകരിക്കാത്തവ',
    adherenceRate: 'പാലന നിരക്ക്',
    todaysDoseLogs: 'ഇന്നത്തെ മരുന്ന് രേഖകൾ',
    viewAllPrescriptions: 'എല്ലാ കുറിപ്പടികളും കാണുക',
    overrideTaken: 'കഴിച്ചതായി അടയാളപ്പെടുത്തുക',
    markMissed: 'തടസ്സപ്പെട്ടതായി അടയാളപ്പെടുത്തുക',
    unconfirmedGraceAlert: 'സമയപരിധി കഴിഞ്ഞ സ്ഥിരീകരിക്കാത്ത മരുന്നുകൾ',

    // Family Dashboard
    familyHub: 'കുടുംബ സമാധാന കേന്ദ്രം',
    complianceRate: 'പാലന നിരക്ക്',
    verifiedTaken: 'സ്ഥിരീകരിച്ചത്',
    weeklyAdherence: 'പ്രതിവാര പുരോഗതി',
    activityAuditTrail: 'തത്സമയ പ്രവർത്തന രേഖ',
    callPatientNow: 'രോഗിയെ വിളിക്കുക',

    // Prescriptions Management
    prescriptionManagement: 'കുറിപ്പടി മാനേജ്മെന്റ്',
    addNewMedicine: 'പുതിയ മരുന്ന് ചേർക്കുക',
    activePrescriptions: 'നിലവിലെ മരുന്നുകൾ',
    noActiveMeds: 'സജീവ മരുന്നുകളൊന്നും രജിസ്റ്റർ ചെയ്തിട്ടില്ല.',
    medName: 'മരുന്നിന്റെ പേര്',
    frequency: 'ഇടവേള',
    instructions: 'നിർദ്ദേശങ്ങൾ',
    prescribingDoctor: 'നിർദ്ദേശിച്ച ഡോക്ടർ',
    scheduledTimesList: 'നിശ്ചിത സമയങ്ങൾ (കോമ ഉപയോഗിച്ച് വേർതിരിച്ച 24-മണിക്കൂർ ഫോർമാറ്റ്, ഉദാ. 08:30, 13:00, 20:30)',

    // Appointments
    doctorAppointments: 'ഡോക്ടർ കൂടിക്കാഴ്ചകൾ',
    scheduleAppointment: 'കൂടിക്കാഴ്ച നിശ്ചയിക്കുക',
    specialty: 'വിഭാഗം',
    hospitalClinic: 'ആശുപത്രി / ക്ലിനിക്ക്',
    date: 'തീയതി',
    time: 'സമയം (IST)',
    purpose: 'ലക്ഷ്യം',
    markCompleted: 'പൂർത്തിയായതായി അടയാളപ്പെടുത്തുക',
    cancelAppointment: 'റദ്ദാക്കുക',

    // Care Team
    careCircle: 'കുടുംബ-പരിചാരക സംഘം',
    accessPasscodeLabel: '6-അക്ക ആക്സസ് പാസ്‌കോഡ്',
    linkWithPasscode: 'പാസ്‌കോഡ് ഉപയോഗിച്ച് ബന്ധിപ്പിക്കുക',
    inviteMember: 'അംഗത്തെ ക്ഷണിക്കുക',
    enterPasscodePrompt: 'മുതിർന്ന വ്യക്തിയുടെ ഡാഷ്‌ബോർഡിൽ കാണുന്ന 6-അക്ക കോഡ് നൽകുക.',

    // Emergency SOS
    emergencyAssistance: 'അടിയന്തിര സഹായം',
    needImmediateHelp: 'ഉടൻ വൈദ്യസഹായം ആവശ്യമുണ്ടോ?',
    emergencySirenSounding: 'അടിയന്തിര സൈറൺ മുഴങ്ങുന്നു & പരിചാരകരെ അറിയിച്ചു',
    sosButton: 'അടിയന്തിര SOS',
    confirmSosTitle: 'അടിയന്തിര SOS സ്ഥിരീകരണം',
    confirmSosQuestion: 'ഉടൻ സഹായം ആവശ്യമുണ്ടോ?',
    activateSosNow: '🚨 ഇപ്പോൾ SOS സജീവമാക്കുക',
    accidentalTap: 'റദ്ദാക്കുക / അബദ്ധത്തിൽ തൊട്ടതാണ്',
    sosActiveNotice: 'നിങ്ങളുടെ ആരോഗ്യ രേഖയിൽ അടിയന്തിര മുന്നറിയിപ്പ് രേഖപ്പെടുത്തിയിട്ടുണ്ട്.',
    markSosResolved: 'ഞാൻ ഇപ്പോൾ സുരക്ഷിതനാണ് — SOS അവസാനിപ്പിക്കുക',
    dial112: '112 / 108 വിളിക്കുക',
  },
};

export const AccessibilityProvider = ({ children }) => {
  const [largeText, setLargeText] = useState(() => {
    return localStorage.getItem('eldercare_largetext') === 'true';
  });

  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem('eldercare_contrast') === 'true';
  });

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('eldercare_lang') || 'en';
  });

  useEffect(() => {
    if (largeText) {
      document.body.classList.add('large-text');
    } else {
      document.body.classList.remove('large-text');
    }
    localStorage.setItem('eldercare_largetext', largeText);
  }, [largeText]);

  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    localStorage.setItem('eldercare_contrast', highContrast);
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem('eldercare_lang', language);
  }, [language]);

  const toggleLargeText = () => setLargeText((prev) => !prev);
  const toggleHighContrast = () => setHighContrast((prev) => !prev);
  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('eldercare_lang', lang);
  };

  const t = (key) => {
    return (
      (translations[language] && translations[language][key]) ||
      (translations.en && translations.en[key]) ||
      key
    );
  };

  const getSpeechLangCode = (lang) => {
    const found = SUPPORTED_LANGUAGES.find((l) => l.code === lang);
    return found ? found.speechCode : 'en-IN';
  };

  // Text-to-speech helper in selected language
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any previous speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = getSpeechLangCode(language);
      utterance.rate = 0.9; // Slightly slower for elderly clarity
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <AccessibilityContext.Provider
      value={{
        largeText,
        highContrast,
        language,
        toggleLargeText,
        toggleHighContrast,
        changeLanguage,
        t,
        speak,
        getSpeechLangCode,
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);
