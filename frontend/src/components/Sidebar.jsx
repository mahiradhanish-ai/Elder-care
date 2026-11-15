import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Pill,
  Calendar,
  Users,
  BarChart3,
  History,
  Mic,
  Settings,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';

const Sidebar = ({ mobileOpen, onCloseMobile }) => {
  const { user } = useAuth();
  const { t } = useAccessibility();

  if (!user) return null;

  const role = user.role;

  const navItemClass = ({ isActive }) =>
    `flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-extrabold transition-all duration-150 ${
      isActive
        ? 'bg-brand-50 text-brand-700 shadow-sm border border-brand-200/80 font-black'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full p-4">
      <div className="space-y-6">
        {/* Navigation Category */}
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-4 mb-2.5">
            Main Navigation
          </p>
          <nav className="space-y-1.5" onClick={onCloseMobile}>
            <NavLink to="/dashboard" end className={navItemClass}>
              <LayoutDashboard className="w-4 h-4 text-brand-600" />
              <span>{t('dashboard')}</span>
            </NavLink>

            <NavLink to="/medications" className={navItemClass}>
              <Pill className="w-4 h-4 text-teal-600" />
              <span>{t('medications')}</span>
            </NavLink>

            <NavLink to="/appointments" className={navItemClass}>
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>{t('appointments')}</span>
            </NavLink>

            <NavLink to="/care-team" className={navItemClass}>
              <Users className="w-4 h-4 text-sky-600" />
              <span>{t('careTeam')}</span>
            </NavLink>

            {/* Analytics (for Caretaker and Family) */}
            {(role === 'caretaker' || role === 'family') && (
              <NavLink to="/analytics" className={navItemClass}>
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                <span>{t('adherence')}</span>
              </NavLink>
            )}

            {/* Activity Timeline (Caretaker and Family) */}
            {(role === 'caretaker' || role === 'family') && (
              <NavLink to="/activity-timeline" className={navItemClass}>
                <History className="w-4 h-4 text-amber-600" />
                <span>Audit Timeline</span>
              </NavLink>
            )}
          </nav>
        </div>

        {/* Elderly Dedicated Quick Guidance Card */}
        {role === 'elderly' && (
          <div className="bg-gradient-to-br from-brand-50 to-teal-50 p-4 rounded-3xl border border-brand-100/80 shadow-sm">
            <div className="flex items-center space-x-2 text-brand-700 font-black text-xs uppercase tracking-wider mb-1.5">
              <Mic className="w-4 h-4 animate-pulse text-brand-600" />
              <span>{t('voiceHelp')}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              You can tap the microphone button at any time to hear your medicine schedule read aloud.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Profile Settings Link */}
      <div className="pt-4 border-t border-slate-100" onClick={onCloseMobile}>
        <NavLink to="/profile-settings" className={navItemClass}>
          <Settings className="w-4 h-4 text-slate-500" />
          <span>Profile & Health Settings</span>
        </NavLink>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200/80 hidden md:block min-h-[calc(100vh-4rem)]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-slate-900/50 backdrop-blur-sm flex">
          <div className="w-64 bg-white h-full shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
          <div className="flex-1" onClick={onCloseMobile}></div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
