import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HeartPulse,
  LogOut,
  Bell,
  Eye,
  Type,
  User as UserIcon,
  ChevronDown,
  Users,
  Menu,
  X,
  ShieldAlert,
  Languages,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import NotificationDropdown from './NotificationDropdown';

const Navbar = ({ onToggleMobileSidebar }) => {
  const { user, logout, managedProfiles, activeProfile, switchActiveProfile } = useAuth();
  const {
    largeText,
    highContrast,
    language,
    toggleLargeText,
    toggleHighContrast,
    changeLanguage,
    supportedLanguages,
  } = useAccessibility();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'elderly':
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-black rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            👴 Elderly User
          </span>
        );
      case 'caretaker':
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-black rounded-full bg-teal-50 text-teal-800 border border-teal-200">
            👩‍⚕️ Caretaker
          </span>
        );
      case 'family':
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-black rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200">
            👨‍👩‍👧 Family Member
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40 shadow-sm backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Mobile Toggle & Brand Logo */}
        <div className="flex items-center space-x-3">
          {onToggleMobileSidebar && (
            <button
              onClick={onToggleMobileSidebar}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 md:hidden transition"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link to="/dashboard" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition transform duration-200">
              <HeartPulse className="w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">
              ElderCare <span className="text-brand-600">Connect</span>
            </span>
          </Link>

          {/* Active Patient Switcher (for Caretaker & Family) */}
          {user && user.role !== 'elderly' && managedProfiles.length > 0 && (
            <div className="hidden lg:flex items-center space-x-2 ml-5 pl-5 border-l border-slate-200">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                <Users className="w-3.5 h-3.5 mr-1 text-slate-400" /> Patient:
              </span>
              <select
                value={activeProfile ? activeProfile._id : ''}
                onChange={(e) => switchActiveProfile(e.target.value)}
                className="text-xs font-bold bg-surface-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
              >
                {managedProfiles.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.fullName} (Code: {p.accessPasscode})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Accessibility Capsule */}
          <div className="flex items-center space-x-1 bg-surface-50 p-1 rounded-2xl border border-slate-200">
            {/* Large Text Toggle */}
            <button
              onClick={toggleLargeText}
              title={largeText ? 'Normal Font' : 'Large Readable Font (A+)'}
              className={`p-1.5 rounded-xl text-xs font-black transition-all ${
                largeText ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Type className="w-4 h-4" />
            </button>

            {/* High Contrast Mode */}
            <button
              onClick={toggleHighContrast}
              title={highContrast ? 'Normal Contrast' : 'High Contrast Mode'}
              className={`p-1.5 rounded-xl text-xs transition-all ${
                highContrast ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Eye className="w-4 h-4" />
            </button>

            {/* Multi-Language Selector Dropdown (6 Languages) */}
            <div className="relative flex items-center">
              <Languages className="w-3.5 h-3.5 text-slate-500 absolute left-2 pointer-events-none" />
              <select
                value={language}
                onChange={(e) => changeLanguage(e.target.value)}
                aria-label="Select Language"
                title="Select Language / மொழியைத் தேர்ந்தெடுக்கவும்"
                className="pl-6 pr-5 py-1 text-xs font-bold bg-transparent text-slate-700 hover:bg-slate-200/60 rounded-xl border-none focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer appearance-none transition"
              >
                {supportedLanguages &&
                  supportedLanguages.map((lang) => (
                    <option key={lang.code} value={lang.code} className="text-slate-900 bg-white font-medium">
                      {lang.native} ({lang.label})
                    </option>
                  ))}
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 pointer-events-none" />
            </div>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2.5 rounded-2xl text-slate-600 hover:bg-slate-100 transition relative"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
            </button>
            {showNotifications && (
              <NotificationDropdown onClose={() => setShowNotifications(false)} />
            )}
          </div>

          {/* User Profile Pill Menu */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2.5 p-1.5 rounded-2xl hover:bg-slate-100 transition active:scale-95"
              >
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-700 text-white font-black flex items-center justify-center text-sm shadow-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-black text-slate-900 leading-tight">{user.name}</p>
                  <p className="text-[10px] text-slate-400 capitalize font-medium">{user.role}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-3xl shadow-2xl border border-slate-200/80 py-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-sm font-black text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    <div className="mt-2">{getRoleBadge(user.role)}</div>
                  </div>

                  <Link
                    to="/profile-settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                  >
                    <UserIcon className="w-4 h-4 mr-2.5 text-slate-400" /> Profile & Health Details
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 border-t border-slate-100 mt-1 transition"
                  >
                    <LogOut className="w-4 h-4 mr-2.5" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
