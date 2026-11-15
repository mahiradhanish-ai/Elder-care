import React, { useState } from 'react';
import {
  Bell,
  Clock,
  Pill,
  CheckCircle2,
  Volume2,
  VolumeX,
  X,
  AlertCircle,
  ShieldAlert,
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import { stopMedicationReminderAlarm, playSuccessChime } from '../utils/soundEffects';
import api from '../services/api';

const MedicationDueReminderModal = ({ dose, onClose, onDoseTaken }) => {
  const { t, language } = useAccessibility();
  const [isMuted, setIsMuted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notifPermission, setNotifPermission] = useState(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'denied'
  );

  if (!dose) return null;

  const handleMute = () => {
    stopMedicationReminderAlarm();
    setIsMuted(true);
  };

  const handleDismiss = () => {
    stopMedicationReminderAlarm();
    onClose();
  };

  const handleMarkTaken = async () => {
    try {
      setIsSubmitting(true);
      stopMedicationReminderAlarm();

      const res = await api.post(`/medication-logs/${dose._id}/status`, {
        status: 'taken',
        method: 'reminder_alarm',
      });

      if (res.data.success) {
        playSuccessChime();
        if (onDoseTaken) {
          onDoseTaken(dose._id);
        }
        onClose();
      }
    } catch (err) {
      console.error('Failed to confirm dose taken from reminder:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotifPermission(permission);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-4 border-brand-500 relative transform animate-in zoom-in-95 duration-200">
        {/* Pulsing Header Pill */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 animate-bounce">
                <Bell className="w-6 h-6" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-600"></span>
              </span>
            </div>
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900">
                {t('medicationDueNow')}
              </span>
              <h3 className="text-xl font-black text-slate-900 leading-tight">
                {t('medicationDueNow')}
              </h3>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            title={t('snoozeDismiss')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alarm Active Status Bar */}
        <div className="mt-4 flex items-center justify-between p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
          <div className="flex items-center space-x-2">
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-slate-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-amber-600 animate-pulse" />
            )}
            <span>{isMuted ? 'Sound Muted' : t('alarmSounding')}</span>
          </div>
          {!isMuted && (
            <button
              onClick={handleMute}
              className="px-2.5 py-1 rounded-xl bg-amber-200/80 hover:bg-amber-300 text-amber-900 font-extrabold text-[11px] transition"
            >
              {t('muteAlarm')}
            </button>
          )}
        </div>

        {/* Medicine Details Card */}
        <div className="mt-5 p-5 rounded-2xl bg-surface-50 border border-slate-200 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {t('medications')}
              </p>
              <h2 className="text-2xl font-black text-slate-900">{dose.medicationName}</h2>
            </div>
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-brand-50 border border-brand-200 text-brand-800 text-xs font-black">
              <Clock className="w-3.5 h-3.5" />
              <span>{dose.scheduledTime} IST</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/60 text-xs">
            <div>
              <span className="text-slate-400 font-bold block">{t('dosage')}:</span>
              <span className="text-slate-900 font-black text-sm">{dose.dosage}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold block">{t('instructions')}:</span>
              <span className="text-slate-700 font-medium truncate block">
                {dose.reason || 'Take with water after meals'}
              </span>
            </div>
          </div>
        </div>

        {/* Browser Notification Permission Banner (if not yet granted) */}
        {notifPermission === 'default' && (
          <div className="mt-4 p-3 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-between text-xs">
            <span className="text-indigo-900 font-bold">{t('enableNotifications')}</span>
            <button
              onClick={handleRequestNotificationPermission}
              className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[11px] transition shadow-sm"
            >
              Allow
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          {/* Big Green Mark Taken Button */}
          <button
            onClick={handleMarkTaken}
            disabled={isSubmitting}
            className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-base shadow-xl shadow-emerald-600/30 transition transform hover:scale-[1.02] flex items-center justify-center space-x-2"
          >
            <CheckCircle2 className="w-6 h-6" />
            <span>{isSubmitting ? t('loading') : t('markTaken')}</span>
          </button>

          {/* Snooze / Dismiss Button (Leaves dose pending, stops alarm) */}
          <button
            onClick={handleDismiss}
            className="w-full sm:w-auto py-4 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
          >
            {t('snoozeDismiss')}
          </button>
        </div>

        <p className="text-[11px] text-slate-400 text-center mt-3 font-medium">
          Dose will remain pending until confirmed. It is never marked taken automatically.
        </p>
      </div>
    </div>
  );
};

export default MedicationDueReminderModal;
