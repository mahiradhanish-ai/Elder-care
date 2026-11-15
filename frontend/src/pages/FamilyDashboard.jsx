import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  CheckCircle2,
  Clock,
  Calendar,
  Phone,
  PhoneCall,
  BarChart3,
  ShieldCheck,
  ShieldAlert,
  History,
  Users,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import api from '../services/api';

const FamilyDashboard = () => {
  const { user, activeProfile } = useAuth();
  const { t } = useAccessibility();
  const [todayDoses, setTodayDoses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  const isSosActive = activeProfile?.notes && activeProfile.notes.includes('EMERGENCY_SOS_ACTIVE');
  const emergencyPhone = activeProfile?.emergencyContact?.phone || '+91 98401 23456';

  const fetchFamilyData = async () => {
    try {
      setLoading(true);
      const elderlyId = activeProfile ? activeProfile._id : '';

      // 1. Fetch Today's Doses
      const doseRes = await api.get(`/medication-logs/today?elderlyId=${elderlyId}`);
      if (doseRes.data.success) {
        setTodayDoses(doseRes.data.data);
      }

      // 2. Fetch Analytics
      if (elderlyId) {
        const anaRes = await api.get(`/analytics/${elderlyId}`);
        if (anaRes.data.success) {
          setAnalytics(anaRes.data.data);
        }

        // 3. Fetch Recent Activity Timeline
        const timeRes = await api.get(`/timeline/${elderlyId}`);
        if (timeRes.data.success) {
          setTimeline(timeRes.data.data.slice(0, 6));
        }
      }
    } catch (err) {
      console.error('Family Dashboard Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFamilyData();
  }, [activeProfile]);

  const adherenceRate = analytics ? analytics.adherenceRate : 92;
  const takenCount = todayDoses.filter((d) => d.status === 'taken').length;

  return (
    <div className="space-y-7 max-w-6xl mx-auto pb-10">
      {/* 🚨 ACTIVE EMERGENCY ALERT BANNER FOR FAMILY */}
      {isSosActive && (
        <div className="bg-rose-50 border-4 border-rose-500 rounded-3xl p-6 sm:p-7 shadow-xl shadow-rose-500/20 animate-pulse">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <div className="p-3.5 bg-rose-600 text-white rounded-2xl animate-bounce flex-shrink-0">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-600 text-white">
                  🚨 FAMILY EMERGENCY ALERT
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-rose-950 mt-1.5">
                  {activeProfile?.fullName} has triggered an Emergency SOS!
                </h2>
                <p className="text-xs text-rose-800 font-semibold mt-1">
                  An urgent emergency alarm was sounded. Please contact your family member or primary caretaker immediately.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 flex-shrink-0">
              <a
                href={`tel:${emergencyPhone.replace(/\s+/g, '')}`}
                className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center space-x-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{t('callPatientNow')}</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* TOP PEACE OF MIND HERO BANNER */}
      <div className="bg-gradient-to-r from-brand-600 via-brand-700 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-brand-600/15">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-extrabold uppercase tracking-wider mb-2.5 backdrop-blur-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>{t('familyHub')}</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight">
              {t('monitoringPatient')}: {activeProfile ? activeProfile.fullName : 'Family Member'}
            </h1>
            <p className="text-sm text-indigo-100 mt-1 font-medium">
              Real-time daily medication verification, doctor appointments, and caregiver supervision.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20 text-center min-w-[150px]">
            <span className="text-[11px] uppercase tracking-wider text-indigo-200 block font-bold">
              {t('complianceRate')}
            </span>
            <span className="text-3xl font-black block mt-0.5">{adherenceRate}%</span>
            <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wide">
              {t('verifiedTaken')}
            </span>
          </div>
        </div>
      </div>

      {/* MAIN CARDS: TODAY'S STATUS & RECHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Dose Overview */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>{t('todaySchedule')}</span>
              </h3>
              <span className="text-xs font-black px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                {takenCount} of {todayDoses.length} {t('taken')}
              </span>
            </div>

            {todayDoses.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center font-medium">
                {t('noDosesToday')}
              </p>
            ) : (
              <div className="space-y-3">
                {todayDoses.map((dose) => (
                  <div
                    key={dose._id}
                    className="p-3.5 rounded-2xl border border-slate-200/90 bg-surface-50 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-black text-slate-900 block">
                        {dose.medicationName}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {dose.dosage} at {dose.scheduledTime} (IST)
                      </span>
                    </div>
                    <span
                      className={`text-xs font-black px-3 py-1 rounded-full uppercase ${
                        dose.status === 'taken'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {t(dose.status) || dose.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              {t('careTeamPasscode')}: <strong className="text-slate-900 font-mono">{activeProfile?.accessPasscode}</strong>
            </span>
            <Link to="/analytics" className="text-brand-600 font-bold hover:underline">
              Detailed Adherence Report &rarr;
            </Link>
          </div>
        </div>

        {/* Weekly Adherence Chart (Recharts) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-brand-600" />
                <span>{t('weeklyAdherence')}</span>
              </h3>
              <span className="text-xs text-slate-500 font-medium">Last 7 Days</span>
            </div>

            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={
                    analytics && analytics.weeklyTrends && analytics.weeklyTrends.length > 0
                      ? analytics.weeklyTrends
                      : [
                          { date: 'Mon', taken: 3, total: 3 },
                          { date: 'Tue', taken: 3, total: 3 },
                          { date: 'Wed', taken: 2, total: 3 },
                          { date: 'Thu', taken: 3, total: 3 },
                          { date: 'Fri', taken: 3, total: 3 },
                          { date: 'Sat', taken: 2, total: 3 },
                          { date: 'Sun', taken: 3, total: 3 },
                        ]
                  }
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Bar dataKey="taken" fill="#0c87eb" radius={[6, 6, 0, 0]} name="Taken Doses" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <span className="text-xs text-slate-500 font-medium">
              Timestamps synchronized to Asia/Kolkata (IST)
            </span>
          </div>
        </div>
      </div>

      {/* ACTIVITY TIMELINE TRAIL */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
            <History className="w-5 h-5 text-amber-600" />
            <span>Real-time Care Activity Audit Trail</span>
          </h3>
          <Link to="/activity-timeline" className="text-xs font-bold text-brand-600 hover:underline">
            View All Logs &rarr;
          </Link>
        </div>

        {timeline.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 font-medium">No recent activity recorded.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {timeline.map((item) => (
              <div key={item._id} className="py-3 flex items-start space-x-3.5">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-500 mt-1.5 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-800">{item.details}</p>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {new Date(item.createdAt).toLocaleString('en-IN', {
                      timeZone: 'Asia/Kolkata',
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FamilyDashboard;
