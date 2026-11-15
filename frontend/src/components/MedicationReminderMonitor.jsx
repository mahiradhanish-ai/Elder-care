import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { playMedicationReminderAlarm, stopMedicationReminderAlarm } from '../utils/soundEffects';
import MedicationDueReminderModal from './MedicationDueReminderModal';
import api from '../services/api';

const getTodayIST = () => {
  const now = new Date();
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
};

const getCurrentTimeIST = () => {
  const now = new Date();
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(now);
};

const MedicationReminderMonitor = () => {
  const { user, activeProfile } = useAuth();
  const { speak, t } = useAccessibility();
  const [activeDueDose, setActiveDueDose] = useState(null);
  const isCheckingRef = useRef(false);

  useEffect(() => {
    if (!user) return;

    // Check on startup and then poll every 10 seconds
    const checkScheduledDoses = async () => {
      if (isCheckingRef.current) return;
      isCheckingRef.current = true;

      try {
        const todayIST = getTodayIST();
        const currentTimeIST = getCurrentTimeIST();
        const elderlyParam = activeProfile ? `?elderlyId=${activeProfile._id}` : '';

        const res = await api.get(`/medication-logs/today${elderlyParam}`);
        if (res.data.success && Array.isArray(res.data.data)) {
          const doses = res.data.data;

          // Find pending doses scheduled at or before current time IST today
          const dueDoses = doses.filter((d) => {
            if (d.status !== 'pending') return false;
            if (d.scheduledDate !== todayIST) return false;
            return d.scheduledTime <= currentTimeIST;
          });

          for (const dose of dueDoses) {
            const sessionKey = `alarmed_dose_${dose._id}_${dose.scheduledTime}`;
            const alreadyAlarmed = sessionStorage.getItem(sessionKey);

            if (!alreadyAlarmed) {
              // Mark alarmed in this session to prevent duplicate alarms
              sessionStorage.setItem(sessionKey, 'true');

              // 1. Play audible chime alarm
              playMedicationReminderAlarm();

              // 2. Open visible in-app reminder modal
              setActiveDueDose(dose);

              // 3. Trigger browser desktop notification if supported and granted
              if (typeof window !== 'undefined' && 'Notification' in window) {
                if (Notification.permission === 'granted') {
                  try {
                    new Notification(`⏰ Medication Due: ${dose.medicationName}`, {
                      body: `It is ${dose.scheduledTime} (IST). Time to take ${dose.medicationName} (${dose.dosage}).`,
                      icon: '/favicon.ico',
                      tag: `med_${dose._id}_${dose.scheduledTime}`,
                      requireInteraction: true,
                    });
                  } catch (notifErr) {
                    console.warn('Browser notification error:', notifErr);
                  }
                }
              }

              // 4. Voice announcement in active language
              const voiceAnnouncement = `${t('medicationDueNow')}. ${dose.medicationName}, ${dose.dosage}.`;
              speak(voiceAnnouncement);

              // Break after triggering the earliest pending due dose
              break;
            }
          }
        }
      } catch (err) {
        // Silently skip if network temporarily unavailable
      } finally {
        isCheckingRef.current = false;
      }
    };

    checkScheduledDoses();
    const interval = setInterval(checkScheduledDoses, 10000);

    return () => {
      clearInterval(interval);
      stopMedicationReminderAlarm();
    };
  }, [user, activeProfile]);

  const handleCloseModal = () => {
    stopMedicationReminderAlarm();
    setActiveDueDose(null);
  };

  const handleDoseTaken = (doseId) => {
    stopMedicationReminderAlarm();
    setActiveDueDose(null);
  };

  if (!activeDueDose) return null;

  return (
    <MedicationDueReminderModal
      dose={activeDueDose}
      onClose={handleCloseModal}
      onDoseTaken={handleDoseTaken}
    />
  );
};

export default MedicationReminderMonitor;
