import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import VoiceAssistantModal from '../components/VoiceAssistantModal';
import EmergencySOSModal from '../components/EmergencySOSModal';
import MedicationReminderMonitor from '../components/MedicationReminderMonitor';
import { Mic, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';

const DashboardLayout = () => {
  const { user, profile } = useAuth();
  const { t } = useAccessibility();
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [sosOpen, setSosOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const isSosActive = profile?.notes && profile.notes.includes('EMERGENCY_SOS_ACTIVE');

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      <Navbar onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-w-0">
          <Outlet />
        </main>
      </div>

      {/* Floating Action Controls for Elderly User */}
      {user && user.role === 'elderly' && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center space-x-3">
          {/* Quick SOS Floating Button */}
          <button
            onClick={() => setSosOpen(true)}
            className={`flex items-center space-x-2 px-5 py-3.5 rounded-full font-black text-sm shadow-2xl transition transform hover:scale-105 active:scale-95 ${
              isSosActive
                ? 'bg-rose-700 text-white animate-bounce'
                : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/40'
            }`}
            title="Emergency SOS"
          >
            <ShieldAlert className="w-5 h-5" />
            <span className="hidden sm:inline">SOS</span>
          </button>

          {/* Voice Assistant Floating Button */}
          <button
            onClick={() => setVoiceOpen(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-brand-600 to-teal-600 hover:from-brand-700 hover:to-teal-700 text-white font-black px-5 py-3.5 rounded-full shadow-2xl shadow-brand-600/30 transition transform hover:scale-105 active:scale-95"
            title="Open Voice Assistant"
          >
            <Mic className="w-5 h-5 animate-pulse" />
            <span className="text-sm tracking-wide hidden sm:inline">
              {t('voiceHelp')}
            </span>
          </button>
        </div>
      )}

      {/* Voice Assistant Dialog */}
      <VoiceAssistantModal isOpen={voiceOpen} onClose={() => setVoiceOpen(false)} />

      {/* Emergency SOS Dialog */}
      <EmergencySOSModal isOpen={sosOpen} onClose={() => setSosOpen(false)} />

      {/* Real-time Medication Reminder & Audible Alarm Monitor */}
      <MedicationReminderMonitor />
    </div>
  );
};

export default DashboardLayout;
