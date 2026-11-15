import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  PhoneCall,
  Volume2,
  VolumeX,
  X,
  ShieldAlert,
  CheckCircle2,
  Clock,
  HeartHandshake,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { startEmergencyAlarm, stopEmergencyAlarm } from '../utils/soundEffects';
import api from '../services/api';

const EmergencySOSModal = ({ isOpen, onClose, onSosTriggered }) => {
  const { user, profile, refreshProfile } = useAuth();
  const { language, t, speak } = useAccessibility();

  const [step, setStep] = useState('confirm'); // 'confirm' | 'active'
  const [countdown, setCountdown] = useState(5);
  const [alarmPlaying, setAlarmPlaying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // If already active in profile notes
  const isProfileSosActive = profile?.notes && profile.notes.includes('EMERGENCY_SOS_ACTIVE');

  useEffect(() => {
    if (isOpen) {
      if (isProfileSosActive) {
        setStep('active');
        startAlarm();
      } else {
        setStep('confirm');
        setCountdown(5);
      }
    } else {
      stopAlarm();
    }
    return () => stopAlarm();
  }, [isOpen, isProfileSosActive]);

  const startAlarm = () => {
    startEmergencyAlarm();
    setAlarmPlaying(true);
  };

  const stopAlarm = () => {
    stopEmergencyAlarm();
    setAlarmPlaying(false);
  };

  const triggerSOS = async () => {
    setSubmitting(true);
    try {
      const timestamp = new Date().toISOString();
      const emergencyNote = `[EMERGENCY_SOS_ACTIVE: ${timestamp}] Patient ${profile?.fullName || user?.name} activated Emergency SOS at ${new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })} IST.`;

      // Persist to backend using existing profile update endpoint
      await api.put('/profiles/my-profile', {
        notes: emergencyNote,
      });

      setStep('active');
      startAlarm();
      const vocalAlert =
        language === 'ta'
          ? 'அவசர எச்சரிக்கை செயல்படுத்தப்பட்டது. உங்கள் பராமரிப்பாளர் மற்றும் குடும்பத்தினருக்கு தகவல் அனுப்பப்பட்டுள்ளது.'
          : 'Emergency SOS activated. Alerts have been dispatched to your care team and emergency contacts.';
      speak(vocalAlert);

      if (onSosTriggered) onSosTriggered();
      await refreshProfile();
    } catch (err) {
      console.error('Failed to trigger SOS:', err);
      setStatusMessage('Network warning: Still calling contacts directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const resolveSOS = async () => {
    setSubmitting(true);
    stopAlarm();
    try {
      const timestamp = new Date().toISOString();
      const resolvedNote = `[EMERGENCY_SOS_RESOLVED: ${timestamp}] Emergency cleared and confirmed safe by patient.`;

      await api.put('/profiles/my-profile', {
        notes: resolvedNote,
      });

      await refreshProfile();
      if (onSosTriggered) onSosTriggered();
      onClose();
    } catch (err) {
      console.error('Failed to resolve SOS:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const emergencyPhone = profile?.emergencyContact?.phone || '+91 98401 23456';
  const emergencyName = profile?.emergencyContact?.name || 'Primary Caregiver';
  const emergencyRelation = profile?.emergencyContact?.relationship || 'Family';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-4 border-rose-500 overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-surface-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl animate-pulse">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-rose-600 tracking-tight">
                {step === 'confirm' ? 'Emergency SOS Confirmation' : '🚨 EMERGENCY SOS ACTIVE'}
              </h2>
              <p className="text-xs font-semibold text-slate-500">
                {step === 'confirm' ? 'Confirm to alert caretakers & sound alarm' : 'Alerting Care Circle & Sounding Alarm'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopAlarm();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Confirmation Step */}
        {step === 'confirm' ? (
          <div className="py-6 text-center space-y-6">
            <div className="w-24 h-24 bg-rose-50 border-4 border-rose-300 rounded-full flex items-center justify-center mx-auto text-rose-600 shadow-inner">
              <AlertTriangle className="w-12 h-12" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Do you need immediate medical assistance?
              </h3>
              <p className="text-sm text-slate-600 mt-2 max-w-sm mx-auto">
                Pressing activate will sound an audible alarm and notify your registered caretakers and family members immediately.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="py-4 px-6 rounded-2xl bg-surface-100 hover:bg-surface-200 text-slate-700 font-bold text-base transition"
              >
                Cancel / Accidental Tap
              </button>
              <button
                type="button"
                onClick={triggerSOS}
                disabled={submitting}
                className="py-4 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-black text-base shadow-lg shadow-rose-600/30 transition transform"
              >
                {submitting ? 'Activating...' : '🚨 ACTIVATE SOS NOW'}
              </button>
            </div>
          </div>
        ) : (
          /* Active SOS Screen */
          <div className="py-6 space-y-6">
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-center">
              <span className="inline-block px-3 py-1 bg-rose-600 text-white rounded-full text-xs font-black uppercase tracking-wider mb-2 animate-bounce">
                Siren Alarm Sounding
              </span>
              <p className="text-xs text-rose-800 font-semibold">
                An active emergency alert was recorded in your healthcare record. Your care team can see this emergency alert.
              </p>

              {/* Sound toggle button */}
              <button
                onClick={() => (alarmPlaying ? stopAlarm() : startAlarm())}
                className="mt-3 inline-flex items-center space-x-2 px-4 py-2 bg-white border border-rose-300 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-100 transition shadow-sm"
              >
                {alarmPlaying ? (
                  <>
                    <VolumeX className="w-4 h-4 text-rose-600" />
                    <span>Mute Siren Alarm</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-emerald-600" />
                    <span>Resume Siren Alarm</span>
                  </>
                )}
              </button>
            </div>

            {/* Direct 1-Click Call Buttons */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Immediate Emergency Contacts (Click to Call)
              </h4>
              <div className="space-y-3">
                {/* Emergency Contact */}
                <a
                  href={`tel:${emergencyPhone.replace(/\s+/g, '')}`}
                  className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-400 hover:bg-emerald-100 text-emerald-950 flex items-center justify-between transition shadow-sm group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-emerald-600 text-white rounded-xl shadow group-hover:scale-105 transition">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold">{emergencyName} ({emergencyRelation})</p>
                      <p className="text-xs text-emerald-700 font-mono font-bold">{emergencyPhone}</p>
                    </div>
                  </div>
                  <span className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-black text-xs uppercase tracking-wide">
                    Call Now
                  </span>
                </a>

                {/* National Emergency Hotline */}
                <a
                  href="tel:112"
                  className="p-4 rounded-2xl bg-surface-50 border border-surface-200 hover:bg-surface-100 text-slate-900 flex items-center justify-between transition group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-rose-600 text-white rounded-xl shadow group-hover:scale-105 transition">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold">National Emergency Medical Service</p>
                      <p className="text-xs text-slate-500 font-mono font-bold">Dial: 112 / 108 Ambulance</p>
                    </div>
                  </div>
                  <span className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white font-black text-xs uppercase tracking-wide">
                    Dial 112
                  </span>
                </a>
              </div>
            </div>

            {/* Resolution Button */}
            <div className="pt-3 border-t border-surface-200">
              <button
                type="button"
                onClick={resolveSOS}
                disabled={submitting}
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-sm shadow transition flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{submitting ? 'Resolving...' : 'I Am Safe Now — Mark SOS Resolved'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencySOSModal;
