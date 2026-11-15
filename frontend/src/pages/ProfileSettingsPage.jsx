import React, { useState, useEffect } from 'react';
import { User, Phone, MapPin, Heart, AlertCircle, CheckCircle2, Save, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ProfileSettingsPage = () => {
  const { user, profile, activeProfile, refreshProfile } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    gender: 'Prefer not to say',
    bloodGroup: 'B+',
    conditions: '',
    allergies: '',
    emergencyName: '',
    emergencyRelation: '',
    emergencyPhone: '',
    city: 'Chennai',
    state: 'Tamil Nadu',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const targetProfile = user?.role === 'elderly' ? profile : activeProfile;

  useEffect(() => {
    if (targetProfile) {
      setFormData({
        fullName: targetProfile.fullName || '',
        gender: targetProfile.gender || 'Prefer not to say',
        bloodGroup: targetProfile.bloodGroup || 'B+',
        conditions: (targetProfile.medicalConditions || []).join(', '),
        allergies: (targetProfile.allergies || []).join(', '),
        emergencyName: targetProfile.emergencyContact?.name || '',
        emergencyRelation: targetProfile.emergencyContact?.relationship || 'Family',
        emergencyPhone: targetProfile.emergencyContact?.phone || '',
        city: targetProfile.address?.city || 'Chennai',
        state: targetProfile.address?.state || 'Tamil Nadu',
      });
    }
  }, [targetProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const payload = {
        fullName: formData.fullName,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        medicalConditions: formData.conditions.split(',').map((c) => c.trim()).filter(Boolean),
        allergies: formData.allergies.split(',').map((a) => a.trim()).filter(Boolean),
        emergencyContact: {
          name: formData.emergencyName,
          relationship: formData.emergencyRelation,
          phone: formData.emergencyPhone,
        },
        address: {
          city: formData.city,
          state: formData.state,
        },
      };

      const res = await api.put('/profiles/my-profile', payload);
      if (res.data.success) {
        setMessage('Healthcare profile updated successfully!');
        await refreshProfile();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-surface-200 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-brand-600 font-bold text-xs uppercase tracking-wider mb-2">
            <User className="w-4 h-4" />
            <span>Healthcare Profile</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Patient Medical Profile
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage medical conditions, allergies, and emergency contact details
          </p>
        </div>

        <div className="bg-surface-50 p-3 rounded-2xl border border-surface-200 text-right">
          <span className="text-[11px] font-bold text-slate-400 block uppercase">Access Passcode</span>
          <span className="text-xl font-mono font-bold text-brand-700">
            {targetProfile?.accessPasscode || '849201'}
          </span>
        </div>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-semibold flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-surface-200 shadow-card space-y-6">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4 pb-2 border-b border-surface-100">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold uppercase text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-surface-50 border border-surface-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-slate-700 mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full bg-surface-50 border border-surface-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className="block font-bold uppercase text-slate-700 mb-1">Blood Group</label>
              <input
                type="text"
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                placeholder="e.g. B+"
                className="w-full bg-surface-50 border border-surface-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4 pb-2 border-b border-surface-100">
            Clinical Summary & Allergies
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold uppercase text-slate-700 mb-1">Medical Conditions (Comma-separated)</label>
              <textarea
                rows={2}
                value={formData.conditions}
                onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
                placeholder="e.g. Type 2 Diabetes, Hypertension, Osteoarthritis"
                className="w-full bg-surface-50 border border-surface-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-slate-700 mb-1">Allergies (Comma-separated)</label>
              <textarea
                rows={2}
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                placeholder="e.g. Penicillin, Peanuts, Sulfa drugs"
                className="w-full bg-surface-50 border border-surface-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4 pb-2 border-b border-surface-100">
            Primary Emergency Contact
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold uppercase text-slate-700 mb-1">Contact Name</label>
              <input
                type="text"
                value={formData.emergencyName}
                onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                placeholder="e.g. Arun Patel"
                className="w-full bg-surface-50 border border-surface-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-slate-700 mb-1">Relationship</label>
              <input
                type="text"
                value={formData.emergencyRelation}
                onChange={(e) => setFormData({ ...formData, emergencyRelation: e.target.value })}
                placeholder="e.g. Son / Daughter"
                className="w-full bg-surface-50 border border-surface-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={formData.emergencyPhone}
                onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                placeholder="+91 98401 23456"
                className="w-full bg-surface-50 border border-surface-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-surface-100 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving Profile...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettingsPage;
