import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HeartPulse,
  ShieldCheck,
  Pill,
  Calendar,
  Users,
  Mic,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  Clock,
  Heart,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [seeding, setSeeding] = useState(false);
  const [activeRoleText, setActiveRoleText] = useState('');

  const handleSeedAndLogin = async (email, roleLabel) => {
    setSeeding(true);
    setActiveRoleText(roleLabel);
    try {
      try {
        await api.post('/auth/seed-demo');
      } catch (seedErr) {
        // Continue if seed already initialized
      }
      const res = await login(email, 'password123');
      if (res.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSeeding(false);
      setActiveRoleText('');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col justify-between selection:bg-brand-500 selection:text-white">
      {/* Top Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition transform duration-200">
              <HeartPulse className="w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">
              ElderCare <span className="text-brand-600">Connect</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-xs font-bold text-slate-700 hover:text-brand-600 transition"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white text-xs font-black rounded-xl shadow-md shadow-brand-600/20 transition transform"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-12 flex-grow flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-black uppercase tracking-wider mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Smart Elderly Care & Medication Ecosystem</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-5">
            Compassionate Care for Loved Ones,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-teal-500">
              Connected in Real-Time
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl mx-auto font-medium">
            An integrated healthcare platform empowering elderly individuals with simplified 1-click dose verification and voice guidance, while granting caretakers and family members instant unconfirmed alerts and doctor visit tracking.
          </p>

          {/* Quick Demo Launchers */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.06)] max-w-2xl mx-auto mb-10">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>Instant 1-Click Role Exploration</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4 font-medium">
              Click any role below to automatically authenticate with realistic MongoDB records:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => handleSeedAndLogin('ramesh@eldercare.com', 'Elderly')}
                disabled={seeding}
                className="p-3.5 rounded-2xl border-2 border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-950 text-left transition transform active:scale-[0.98]"
              >
                <span className="text-[10px] font-black uppercase text-emerald-600 block">Role 1</span>
                <span className="font-black text-sm block mt-0.5">👴 Elderly</span>
                <span className="text-[11px] text-emerald-700 block font-medium">Ramesh Patel (Voice & 1-Click)</span>
              </button>

              <button
                onClick={() => handleSeedAndLogin('priya@eldercare.com', 'Caretaker')}
                disabled={seeding}
                className="p-3.5 rounded-2xl border-2 border-teal-200 bg-teal-50/70 hover:bg-teal-100/70 text-teal-950 text-left transition transform active:scale-[0.98]"
              >
                <span className="text-[10px] font-black uppercase text-teal-600 block">Role 2</span>
                <span className="font-black text-sm block mt-0.5">👩‍⚕️ Caretaker</span>
                <span className="text-[11px] text-teal-700 block font-medium">Nurse Priya (Alerts & Rx)</span>
              </button>

              <button
                onClick={() => handleSeedAndLogin('arun@eldercare.com', 'Family')}
                disabled={seeding}
                className="p-3.5 rounded-2xl border-2 border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100/70 text-indigo-950 text-left transition transform active:scale-[0.98]"
              >
                <span className="text-[10px] font-black uppercase text-indigo-600 block">Role 3</span>
                <span className="font-black text-sm block mt-0.5">👨‍👩‍👧 Family</span>
                <span className="text-[11px] text-indigo-700 block font-medium">Arun Patel (Adherence Charts)</span>
              </button>
            </div>
            {seeding && (
              <p className="text-xs font-bold text-brand-600 mt-3.5 animate-pulse">
                Authenticating as {activeRoleText}...
              </p>
            )}
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
              <Pill className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-1.5">Smart Medication Tracking</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Automated daily schedules, single-use 1-click email confirmation links, missed-dose detection, and caretaker emergency notifications.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-1.5">Emergency SOS & Audio Alarm</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Instant audible in-app siren and emergency alert broadcast to care circles with registered emergency contact dialers.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-1.5">Passcode Care Circle</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Seamlessly link elderly parents to doctors, nurses, and adult children using simple 6-digit access passcodes and role-based access.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-5 px-6 text-center text-xs text-slate-500 font-medium">
        ElderCare Connect &copy; 2026 – Smart Elderly Care & Medication Management Platform. Locked to Asia/Kolkata (IST).
      </footer>
    </div>
  );
};

export default LandingPage;
