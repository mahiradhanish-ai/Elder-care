import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  Calendar,
  PhoneCall,
  Pill,
  Mic,
  ShieldAlert,
  Volume2,
  Heart,
  AlertTriangle,
  Sparkles,
  Phone,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { playSuccessChime } from '../utils/soundEffects';
import api from '../services/api';
import VoiceAssistantModal from '../components/VoiceAssistantModal';
import EmergencySOSModal from '../components/EmergencySOSModal';

const ElderlyDashboard = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { t, speak, language } = useAccessibility();

  const [todayDoses, setTodayDoses] = useState([]);
  const [nextAppointment, setNextAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [sosModalOpen, setSosModalOpen] = useState(false);

  const isSosActive = profile?.notes && profile.notes.includes('EMERGENCY_SOS_ACTIVE');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch today's scheduled doses
      const doseRes = await api.get('/medication-logs/today');
      if (doseRes.data.success) {
        setTodayDoses(doseRes.data.data);
      }

      // Fetch appointments
      const apptRes = await api.get('/appointments');
      if (apptRes.data.success && apptRes.data.data.length > 0) {
        const upcoming = apptRes.data.data.filter((a) => a.status === 'upcoming');
        if (upcoming.length > 0) {
          setNextAppointment(upcoming[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching elderly dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const markDoseAsTaken = async (logId, medName) => {
    try {
      const res = await api.post(`/medication-logs/${logId}/status`, {
        status: 'taken',
        method: 'dashboard',
      });
      if (res.data.success) {
        // Play success chime
        playSuccessChime();

        setTodayDoses((prev) =>
          prev.map((d) =>
            d._id === logId ? { ...d, status: 'taken', confirmedAt: new Date() } : d
          )
        );

        const confirmMsg = `${medName} ${t('doseConfirmedTaken')}`;

        setActionMessage(confirmMsg);
        speak(confirmMsg);
        setTimeout(() => setActionMessage(''), 4000);
      }
    } catch (err) {
      console.error('Failed to mark dose taken:', err);
    }
  };

  const emergencyPhone = profile?.emergencyContact?.phone || '+91 98401 23456';
  const emergencyName = profile?.emergencyContact?.name || 'Primary Caregiver';
  const emergencyRelation = profile?.emergencyContact?.relationship || 'Family';

  return (
    <div className="space-y-7 max-w-5xl mx-auto pb-10">
      {/* 🚨 PROMINENT EMERGENCY SOS SECTION */}
      <div
        className={`rounded-3xl p-6 sm:p-7 border-2 transition-all duration-300 shadow-md ${
          isSosActive
            ? 'bg-rose-50 border-rose-500 shadow-rose-500/20 animate-pulse'
            : 'bg-gradient-to-r from-rose-500/10 via-rose-500/5 to-transparent border-rose-200 hover:border-rose-300'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div
              className={`p-3.5 rounded-2xl flex-shrink-0 ${
                isSosActive
                  ? 'bg-rose-600 text-white animate-bounce'
                  : 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
              }`}
            >
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-rose-100 text-rose-800">
                  {isSosActive ? `🚨 ${t('alarmSounding')}` : t('emergencyAssistance')}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {isSosActive
                  ? t('emergencySirenSounding')
                  : t('needImmediateHelp')}
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                {isSosActive
                  ? t('sosActiveNotice')
                  : 'Press the SOS button to sound an alarm and alert your caretakers and emergency contacts.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setSosModalOpen(true)}
            className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-base shadow-xl transition-all transform active:scale-95 duration-150 flex items-center justify-center space-x-3 flex-shrink-0 ${
              isSosActive
                ? 'bg-rose-700 hover:bg-rose-800 text-white animate-pulse'
                : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/40 hover:scale-[1.02]'
            }`}
          >
            <ShieldAlert className="w-6 h-6" />
            <span>{isSosActive ? t('emergencySirenSounding') : t('sosButton')}</span>
          </button>
        </div>
      </div>

      {/* TOP WELCOME & ACCESSIBILITY BAR */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-teal-600 font-extrabold text-xs uppercase tracking-wider mb-2">
              <Heart className="w-4 h-4 fill-teal-500" />
              <span>{t('personalCompanion')}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {`${t('welcome')}, ${user?.name}`}
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              {new Date().toLocaleDateString(language === 'en' ? 'en-IN' : `${language}-IN`, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          {/* Quick Voice Guidance Trigger */}
          <button
            onClick={() => setVoiceOpen(true)}
            className="flex items-center space-x-3.5 px-6 py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-teal-600 text-white font-extrabold shadow-lg shadow-brand-600/25 hover:from-brand-700 hover:to-teal-700 transition transform hover:scale-[1.02] active:scale-95"
          >
            <Mic className="w-6 h-6 animate-pulse" />
            <div className="text-left">
              <span className="block text-[11px] uppercase tracking-wider text-teal-100 font-bold">
                {t('clickToTalk')}
              </span>
              <span className="block text-sm font-black">{t('voiceHelp')}</span>
            </div>
          </button>
        </div>

        {/* Audio Action Toast */}
        {actionMessage && (
          <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center space-x-3 font-bold text-sm animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{actionMessage}</span>
          </div>
        )}
      </div>

      {/* TODAY'S MEDICINE SCHEDULE */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-brand-50 text-brand-600 rounded-2xl">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {t('todaySchedule')}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {t('tapGreenButton')}
              </p>
            </div>
          </div>

          <span className="px-4 py-1.5 rounded-full text-xs font-black bg-brand-50 text-brand-800 border border-brand-200">
            {todayDoses.filter((d) => d.status === 'taken').length} of {todayDoses.length} {t('taken')}
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-sm font-medium">
            {t('loading')}
          </div>
        ) : todayDoses.length === 0 ? (
          <div className="py-12 text-center bg-surface-50 rounded-2xl border border-dashed border-slate-200">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <p className="text-base font-bold text-slate-800">{t('noDosesToday')}</p>
            <p className="text-xs text-slate-500 mt-1">{t('enjoyDay')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {todayDoses.map((dose) => {
              const isTaken = dose.status === 'taken';
              return (
                <div
                  key={dose._id}
                  className={`p-5 rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isTaken
                      ? 'bg-emerald-50/40 border-emerald-300'
                      : dose.status === 'unconfirmed'
                      ? 'bg-rose-50/60 border-rose-300'
                      : 'bg-white border-slate-200/90 hover:border-brand-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`p-3.5 rounded-2xl font-black text-sm flex items-center justify-center flex-shrink-0 ${
                        isTaken
                          ? 'bg-emerald-600 text-white'
                          : 'bg-brand-50 text-brand-800 border border-brand-200'
                      }`}
                    >
                      <Clock className="w-5 h-5 mr-1.5" />
                      {dose.scheduledTime}
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-slate-900 leading-snug">
                        {dose.medicationName}
                      </h3>
                      <p className="text-sm font-bold text-slate-600 mt-0.5">
                        {t('dosage')}: <span className="text-brand-700 font-extrabold">{dose.dosage}</span>
                      </p>
                      {dose.reason && (
                        <p className="text-xs text-slate-500 mt-1 italic">Note: {dose.reason}</p>
                      )}
                    </div>
                  </div>

                  {/* Big Tactile Action Button */}
                  <div>
                    {isTaken ? (
                      <span className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-emerald-600 text-white font-black text-sm shadow-sm">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>{t('taken')}</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => markDoseAsTaken(dose._id, dose.medicationName)}
                        className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-base shadow-lg shadow-emerald-600/30 transition transform hover:scale-[1.02]"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        <span>{t('markTaken')}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* BOTTOM GRID: NEXT APPOINTMENT & EMERGENCY CONTACTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Next Appointment Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{t('nextAppointment')}</h3>
                <p className="text-xs text-slate-500">{t('upcomingCheckup')}</p>
              </div>
            </div>

            {nextAppointment ? (
              <div className="bg-indigo-50/50 rounded-2xl p-5 border border-indigo-100 space-y-2 text-sm text-slate-800">
                <p className="font-black text-indigo-950 text-base">
                  Dr. {nextAppointment.doctorName}
                </p>
                <p className="text-xs font-bold text-indigo-700">{nextAppointment.specialty}</p>
                <p className="text-xs text-slate-600">📍 {nextAppointment.hospitalOrClinic}</p>
                <p className="text-xs font-black text-slate-800">
                  🗓️ {nextAppointment.date} at {nextAppointment.time} (IST)
                </p>
              </div>
            ) : (
              <div className="bg-surface-50 rounded-2xl p-6 text-xs text-slate-500 text-center font-medium">
                No doctor appointments scheduled right now.
              </div>
            )}
          </div>
        </div>

        {/* Emergency Contacts & Caregiver Call Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{t('emergencyContact')}</h3>
                <p className="text-xs text-slate-500">{t('fastDial')}</p>
              </div>
            </div>

            <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-100 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-black text-slate-900">{emergencyName}</p>
                  <p className="text-xs text-slate-600 font-medium">
                    Relationship: {emergencyRelation}
                  </p>
                </div>
                <a
                  href={`tel:${emergencyPhone.replace(/\s+/g, '')}`}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs uppercase shadow hover:bg-emerald-700 transition"
                >
                  {t('callNow')}
                </a>
              </div>
              <p className="text-sm font-mono font-black text-emerald-800 pt-1">
                📞 {emergencyPhone}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>{t('careTeamPasscode')}:</span>
            <span className="font-mono font-black text-brand-700 bg-brand-50 px-3 py-1 rounded-lg border border-brand-200">
              {profile?.accessPasscode || '849201'}
            </span>
          </div>
        </div>
      </div>

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal isOpen={voiceOpen} onClose={() => setVoiceOpen(false)} />

      {/* Emergency SOS Modal */}
      <EmergencySOSModal
        isOpen={sosModalOpen}
        onClose={() => setSosModalOpen(false)}
        onSosTriggered={() => {
          fetchDashboardData();
        }}
      />
    </div>
  );
};

export default ElderlyDashboard;
