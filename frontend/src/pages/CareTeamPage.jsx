import React, { useState, useEffect } from 'react';
import { Users, Key, Plus, Shield, CheckCircle2, AlertCircle, Phone, Mail, UserX } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import api from '../services/api';

const CareTeamPage = () => {
  const { user, profile, activeProfile, refreshProfile } = useAuth();
  const { t } = useAccessibility();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [passcode, setPasscode] = useState('');
  const [joinRole, setJoinRole] = useState('caretaker');
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('caretaker');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchCareTeam = async () => {
    try {
      setLoading(true);
      const elderlyId = activeProfile ? activeProfile._id : '';
      const res = await api.get(`/care-team?elderlyId=${elderlyId}`);
      if (res.data.success) {
        setMembers(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareTeam();
  }, [activeProfile]);

  const handleJoinByPasscode = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const res = await api.post('/care-team/join-by-passcode', {
        passcode: passcode.trim(),
        memberRole: joinRole,
      });

      if (res.data.success) {
        setMessage(res.data.message);
        setPasscode('');
        setJoinModalOpen(false);
        await refreshProfile();
        fetchCareTeam();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join care team. Please check the passcode.');
    }
  };

  const handleInviteByEmail = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const res = await api.post('/care-team/invite', {
        email: inviteEmail.trim(),
        role: inviteRole,
        elderlyProfileId: activeProfile ? activeProfile._id : undefined,
      });

      if (res.data.success) {
        setMessage(res.data.message);
        setInviteEmail('');
        setInviteModalOpen(false);
        fetchCareTeam();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to invite member.');
    }
  };

  const handleRevoke = async (id) => {
    if (window.confirm('Are you sure you want to revoke this member access?')) {
      try {
        await api.delete(`/care-team/${id}`);
        setMembers((prev) => prev.filter((m) => m._id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const currentPasscode = user?.role === 'elderly' ? profile?.accessPasscode : activeProfile?.accessPasscode;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-surface-200 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-sky-600 font-bold text-xs uppercase tracking-wider mb-2">
            <Users className="w-4 h-4" />
            <span>{t('careTeam')}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('careCircle')}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Authorizations for <span className="font-bold text-slate-800">{activeProfile?.fullName || user?.name}</span>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {user?.role !== 'elderly' && (
            <button
              onClick={() => setJoinModalOpen(true)}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow transition"
            >
              <Key className="w-4 h-4" />
              <span>{t('linkWithPasscode')}</span>
            </button>
          )}

          <button
            onClick={() => setInviteModalOpen(true)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-surface-100 hover:bg-surface-200 text-slate-700 font-bold text-xs border border-surface-200 transition"
          >
            <Plus className="w-4 h-4" />
            <span>{t('inviteMember')}</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Access Passcode Card */}
      <div className="bg-gradient-to-r from-sky-50 to-teal-50 rounded-3xl p-6 border border-sky-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-sky-950 flex items-center space-x-2">
            <Key className="w-5 h-5 text-sky-600" />
            <span>{t('accessPasscodeLabel')}</span>
          </h3>
          <p className="text-xs text-sky-800 mt-1">
            {t('enterPasscodePrompt')}
          </p>
        </div>

        <div className="bg-white px-6 py-3 rounded-2xl border-2 border-sky-400 shadow text-center">
          <span className="text-2xl font-mono font-black tracking-widest text-sky-700">
            {currentPasscode || '849201'}
          </span>
          <span className="block text-[10px] uppercase font-bold text-slate-400 mt-0.5">Secure Passcode</span>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 text-center py-12 text-xs text-slate-400">Loading care team...</div>
        ) : members.length === 0 ? (
          <div className="col-span-2 text-center py-12 bg-white rounded-3xl border border-surface-200 p-8 shadow-card">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">No care team members connected yet</p>
            <p className="text-xs text-slate-400 mt-1">Share the access passcode above with a family member or caretaker.</p>
          </div>
        ) : (
          members.map((member) => (
            <div
              key={member._id}
              className="bg-white rounded-3xl p-6 border border-surface-200 shadow-card flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 font-bold flex items-center justify-center">
                      {member.memberUserId?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{member.memberUserId?.name}</h4>
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-sky-50 text-sky-700 border border-sky-200 mt-0.5">
                        {member.memberRole}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRevoke(member._id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition"
                    title="Revoke Access"
                  >
                    <UserX className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                  <p className="flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{member.memberUserId?.email}</span>
                  </p>
                  {member.memberUserId?.phone && (
                    <p className="flex items-center space-x-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{member.memberUserId?.phone}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-surface-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Status: <strong className="text-emerald-600 uppercase">Active</strong></span>
                <span>Joined: {new Date(member.joinedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Join by Passcode Modal */}
      {joinModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-surface-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Enter Elderly Access Passcode</h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter the 6-digit code shown on your elderly family member's dashboard to connect.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-rose-50 text-rose-700 rounded-xl text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleJoinByPasscode} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">6-Digit Passcode</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="e.g. 849201"
                  className="w-full text-center text-xl font-mono tracking-widest bg-surface-50 border border-surface-200 rounded-xl px-4 py-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">Your Role in Care Team</label>
                <select
                  value={joinRole}
                  onChange={(e) => setJoinRole(e.target.value)}
                  className="w-full bg-surface-50 border border-surface-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="caretaker">Caretaker / Nurse</option>
                  <option value="family">Family Member (Son/Daughter/Relative)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-surface-100 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setJoinModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-surface-100 hover:bg-surface-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold shadow"
                >
                  Connect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-surface-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Invite Care Team Member</h3>
            <p className="text-xs text-slate-500 mb-4">
              Invite a registered caregiver or family member by their email address.
            </p>

            <form onSubmit={handleInviteByEmail} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">Member Email</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="caregiver@example.com"
                  className="w-full bg-surface-50 border border-surface-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full bg-surface-50 border border-surface-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="caretaker">Caretaker</option>
                  <option value="family">Family Member</option>
                </select>
              </div>

              <div className="pt-3 border-t border-surface-100 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-surface-100 hover:bg-surface-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold shadow"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareTeamPage;
