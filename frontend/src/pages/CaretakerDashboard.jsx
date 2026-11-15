import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Pill,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Calendar,
  Plus,
  RefreshCw,
  TrendingUp,
  ShieldAlert,
  PhoneCall,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import api from '../services/api';

const CaretakerDashboard = () => {
  const { user, activeProfile, managedProfiles, refreshProfile } = useAuth();
  const { t } = useAccessibility();
  const [todayDoses, setTodayDoses] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resolvingSos, setResolvingSos] = useState(false);

  const isSosActive = activeProfile?.notes && activeProfile.notes.includes('EMERGENCY_SOS_ACTIVE');

  const fetchCaretakerData = async () => {
    try {
      setLoading(true);
      const elderlyId = activeProfile ? activeProfile._id : '';

      // 1. Fetch Today's Doses
      const doseRes = await api.get(`/medication-logs/today?elderlyId=${elderlyId}`);
      if (doseRes.data.success) {
        setTodayDoses(doseRes.data.data);
      }

      // 2. Fetch Appointments
      const apptRes = await api.get(`/appointments?elderlyId=${elderlyId}`);
      if (apptRes.data.success) {
        setAppointments(apptRes.data.data);
      }

      // 3. Fetch Adherence Analytics
      if (elderlyId) {
        const anaRes = await api.get(`/analytics/${elderlyId}`);
        if (anaRes.data.success) {
          setAnalytics(anaRes.data.data);
        }
      }
    } catch (err) {
      console.error('Caretaker Dashboard Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaretakerData();
  }, [activeProfile]);

  const handleUpdateDose = async (logId, status) => {
    try {
      const res = await api.post(`/medication-logs/${logId}/status`, {
        status,
        method: 'caretaker_override',
      });
      if (res.data.success) {
        setTodayDoses((prev) =>
          prev.map((d) => (d._id === logId ? { ...d, status } : d))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolveSos = async () => {
    if (!activeProfile) return;
    setResolvingSos(true);
    try {
      const timestamp = new Date().toISOString();
      const resolvedNote = `[EMERGENCY_SOS_RESOLVED: ${timestamp}] Emergency cleared and resolved by Caretaker ${user?.name}.`;

      await api.put(`/profiles/${activeProfile._id}`, {
        notes: resolvedNote,
      });

      await refreshProfile();
      fetchCaretakerData();
    } catch (err) {
      console.error('Failed to resolve SOS alert:', err);
    } finally {
      setResolvingSos(false);
    }
  };

  // Group doses
  const takenCount = todayDoses.filter((d) => d.status === 'taken').length;
  const pendingCount = todayDoses.filter((d) => d.status === 'pending').length;
  const unconfirmedCount = todayDoses.filter((d) => d.status === 'unconfirmed').length;

  const emergencyPhone = activeProfile?.emergencyContact?.phone || '+91 98401 23456';

  return (
    <div className="space-y-7 max-w-6xl mx-auto pb-10">
      {/* 🚨 ACTIVE EMERGENCY SOS ALERT BANNER FOR CARETAKER */}
      {isSosActive && (
        <div className="bg-rose-50 border-4 border-rose-500 rounded-3xl p-6 sm:p-7 shadow-xl shadow-rose-500/20 animate-pulse">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <div className="p-3.5 bg-rose-600 text-white rounded-2xl animate-bounce flex-shrink-0">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-600 text-white">
                  🚨 IMMEDIATE ATTENTION REQUIRED
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-rose-950 mt-1.5">
                  Emergency SOS Activated by {activeProfile?.fullName}!
                </h2>
                <p className="text-xs text-rose-800 font-semibold mt-1">
                  The patient has triggered an emergency alert. Please contact the patient immediately or dispatch medical assistance.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 flex-shrink-0">
              <a
                href={`tel:${emergencyPhone.replace(/\s+/g, '')}`}
                className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow flex items-center space-x-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Patient</span>
              </a>

              <button
                onClick={handleResolveSos}
                disabled={resolvingSos}
                className="px-5 py-3 rounded-2xl bg-rose-700 hover:bg-rose-800 text-white font-extrabold text-xs shadow transition active:scale-95"
              >
                {resolvingSos ? 'Resolving...' : 'Acknowledge & Mark Safe'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOP HEADER & PATIENT STATUS */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-teal-600 font-extrabold text-xs uppercase tracking-wider mb-2">
              <UserCheck className="w-4 h-4" />
              <span>{t('caretakerConsole')}</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {t('monitoringPatient')}: {activeProfile ? activeProfile.fullName : 'Select a Patient'}
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              {t('careTeamPasscode')}: <span className="font-mono font-bold text-slate-800">{activeProfile?.accessPasscode || '849201'}</span> • Blood Group: <span className="font-bold text-slate-700">{activeProfile?.bloodGroup || 'B+'}</span>
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/medications"
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-extrabold text-xs shadow-md shadow-teal-600/20 transition"
            >
              <Plus className="w-4 h-4" />
              <span>{t('addMedication')}</span>
            </Link>
            <button
              onClick={fetchCaretakerData}
              className="p-3 rounded-2xl bg-surface-100 hover:bg-surface-200 text-slate-700 transition active:scale-95"
              title={t('refresh')}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-extrabold uppercase tracking-wider mb-2">
            <span>{t('takenDoses')}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-black text-slate-900">{takenCount}</p>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 block">Successfully logged</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-extrabold uppercase tracking-wider mb-2">
            <span>{t('pendingToday')}</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-black text-slate-900">{pendingCount}</p>
          <span className="text-[11px] text-amber-600 font-bold mt-1 block">Awaiting time</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-extrabold uppercase tracking-wider mb-2">
            <span>{t('unconfirmedDoses')}</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-3xl font-black text-rose-600">{unconfirmedCount}</p>
          <span className="text-[11px] text-rose-600 font-bold mt-1 block">Past grace period</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-extrabold uppercase tracking-wider mb-2">
            <span>{t('adherenceRate')}</span>
            <TrendingUp className="w-4 h-4 text-brand-500" />
          </div>
          <p className="text-3xl font-black text-slate-900">
            {analytics ? `${analytics.adherenceRate}%` : '85%'}
          </p>
          <span className="text-[11px] text-brand-600 font-bold mt-1 block">Monthly rate</span>
        </div>
      </div>

      {/* UNCONFIRMED DOSE ALERTS ACTION CENTER */}
      {unconfirmedCount > 0 && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center space-x-2 text-rose-900 font-black text-sm uppercase tracking-wider mb-4">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span>{t('unconfirmedGraceAlert')}</span>
          </div>

          <div className="space-y-3">
            {todayDoses
              .filter((d) => d.status === 'unconfirmed')
              .map((dose) => (
                <div
                  key={dose._id}
                  className="bg-white p-4 rounded-2xl border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
                >
                  <div>
                    <h4 className="font-black text-slate-900 text-sm">{dose.medicationName}</h4>
                    <p className="text-xs text-slate-500 font-medium">
                      Scheduled: <span className="font-bold text-slate-800">{dose.scheduledTime} (IST)</span> • Dosage: {dose.dosage}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleUpdateDose(dose._id, 'taken')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
                    >
                      {t('markTaken')}
                    </button>
                    <button
                      onClick={() => handleUpdateDose(dose._id, 'missed')}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-sm"
                    >
                      {t('markMissed')}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TODAY'S MEDICINE TIMELINE */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">{t('todaysDoseLogs')}</h2>
              <p className="text-xs text-slate-500 font-medium">Direct caregiver verification</p>
            </div>
          </div>
          <Link to="/medications" className="text-xs font-extrabold text-teal-600 hover:text-teal-700">
            {t('viewAllPrescriptions')} &rarr;
          </Link>
        </div>

        {todayDoses.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center font-medium">No prescriptions scheduled for today.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {todayDoses.map((dose) => (
              <div key={dose._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3.5">
                  <span className="font-mono text-xs font-black bg-surface-100 text-slate-800 px-3 py-1.5 rounded-xl border border-slate-200">
                    {dose.scheduledTime}
                  </span>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{dose.medicationName}</h4>
                    <p className="text-xs text-slate-500">{t('dosage')}: {dose.dosage}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
                      dose.status === 'taken'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : dose.status === 'unconfirmed'
                        ? 'bg-rose-50 text-rose-800 border border-rose-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {t(dose.status) || dose.status}
                  </span>
                  {dose.status !== 'taken' && (
                    <button
                      onClick={() => handleUpdateDose(dose._id, 'taken')}
                      className="px-3.5 py-1 bg-surface-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-xl text-xs font-bold border border-slate-200 transition"
                    >
                      {t('overrideTaken')}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* UPCOMING DOCTOR APPOINTMENTS */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900">Upcoming Doctor Appointments</h3>
          </div>
          <Link to="/appointments" className="text-xs font-extrabold text-brand-600 hover:text-brand-700">
            Manage &rarr;
          </Link>
        </div>

        {appointments.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 font-medium">No appointments scheduled.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-4">
            {appointments.slice(0, 2).map((appt) => (
              <div key={appt._id} className="p-4 rounded-2xl border border-slate-200/80 bg-surface-50">
                <h4 className="font-extrabold text-slate-900 text-sm">Dr. {appt.doctorName} ({appt.specialty})</h4>
                <p className="text-xs text-slate-500 mt-0.5">📍 {appt.hospitalOrClinic}</p>
                <p className="text-xs font-extrabold text-brand-700 mt-2">
                  🗓️ {appt.date} at {appt.time} (IST)
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CaretakerDashboard;
