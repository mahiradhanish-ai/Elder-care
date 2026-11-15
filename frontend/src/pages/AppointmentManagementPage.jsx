import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Clock, MapPin, CheckCircle, X, AlertCircle, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import api from '../services/api';

const AppointmentManagementPage = () => {
  const { user, activeProfile } = useAuth();
  const { t } = useAccessibility();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    doctorName: '',
    specialty: 'General Physician',
    hospitalOrClinic: '',
    date: '',
    time: '10:00',
    purpose: 'Routine checkup',
    notes: '',
  });
  const [error, setError] = useState('');

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const elderlyId = activeProfile ? activeProfile._id : '';
      const res = await api.get(`/appointments?elderlyId=${elderlyId}`);
      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [activeProfile]);

  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const payload = {
        ...formData,
        elderlyProfileId: activeProfile ? activeProfile._id : undefined,
      };

      const res = await api.post('/appointments', payload);
      if (res.data.success) {
        setModalOpen(false);
        fetchAppointments();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to schedule appointment');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/appointments/${id}`, { status });
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status } : a))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-surface-200 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-2">
            <Calendar className="w-4 h-4" />
            <span>{t('doctorAppointments')}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('appointments')}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t('patient')}: <span className="font-bold text-slate-800">{activeProfile?.fullName}</span>
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow transition"
        >
          <Plus className="w-4 h-4" />
          <span>{t('scheduleAppointment')}</span>
        </button>
      </div>

      {/* Appointment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 text-center py-12 text-xs text-slate-400">{t('loading')}</div>
        ) : appointments.length === 0 ? (
          <div className="col-span-2 text-center py-12 bg-white rounded-3xl border border-surface-200 p-8 shadow-card">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">No scheduled appointments</p>
            <p className="text-xs text-slate-400 mt-1">Schedule hospital visits or physician consultations here.</p>
          </div>
        ) : (
          appointments.map((appt) => (
            <div
              key={appt._id}
              className="bg-white rounded-3xl p-6 border border-surface-200 shadow-card flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Dr. {appt.doctorName}</h3>
                    <span className="text-xs font-semibold text-indigo-600">{appt.specialty}</span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      appt.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : appt.status === 'cancelled'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}
                  >
                    {appt.status}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <p className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{appt.hospitalOrClinic}</span>
                  </p>
                  <p className="flex items-center space-x-2 font-bold text-slate-800">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>{appt.date} at {appt.time} (IST)</span>
                  </p>
                  {appt.purpose && (
                    <p className="bg-surface-50 p-2.5 rounded-xl border border-surface-200 text-slate-700">
                      <strong>{t('purpose')}:</strong> {appt.purpose}
                    </p>
                  )}
                </div>
              </div>

              {appt.status === 'upcoming' && (
                <div className="mt-4 pt-3 border-t border-surface-100 flex items-center justify-end space-x-2">
                  <button
                    onClick={() => handleUpdateStatus(appt._id, 'completed')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs transition"
                  >
                    {t('markCompleted')}
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(appt._id, 'cancelled')}
                    className="px-3 py-1.5 rounded-xl bg-surface-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700 font-bold text-xs transition"
                  >
                    {t('cancelAppointment')}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Schedule Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-surface-200">
            <div className="flex items-center justify-between pb-4 border-b border-surface-100">
              <h3 className="text-lg font-bold text-slate-900">{t('scheduleAppointment')}</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-rose-50 text-rose-700 rounded-xl text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateAppointment} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">Doctor Name</label>
                <input
                  type="text"
                  required
                  value={formData.doctorName}
                  onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                  placeholder="e.g. Dr. V. Ramanathan"
                  className="w-full bg-surface-50 border border-surface-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">{t('specialty')}</label>
                  <input
                    type="text"
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    placeholder="e.g. Cardiologist"
                    className="w-full bg-surface-50 border border-surface-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">{t('hospitalClinic')}</label>
                  <input
                    type="text"
                    required
                    value={formData.hospitalOrClinic}
                    onChange={(e) => setFormData({ ...formData, hospitalOrClinic: e.target.value })}
                    placeholder="e.g. Apollo Hospital"
                    className="w-full bg-surface-50 border border-surface-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">{t('date')}</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-surface-50 border border-surface-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">{t('time')}</label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full bg-surface-50 border border-surface-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">{t('purpose')}</label>
                <input
                  type="text"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  placeholder="e.g. Routine blood pressure & sugar review"
                  className="w-full bg-surface-50 border border-surface-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-surface-100 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-surface-100 hover:bg-surface-200 text-slate-700 font-semibold"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow"
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentManagementPage;
