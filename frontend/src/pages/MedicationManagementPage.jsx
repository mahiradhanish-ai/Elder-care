import React, { useState, useEffect } from 'react';
import { Pill, Plus, Clock, Edit2, Trash2, X, AlertCircle, CheckCircle2, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import api from '../services/api';

const MedicationManagementPage = () => {
  const { user, activeProfile } = useAuth();
  const { t } = useAccessibility();
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'Once Daily',
    times: '08:00',
    instructions: 'Take with water after food',
    prescribingDoctor: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchMedications = async () => {
    try {
      setLoading(true);
      const elderlyId = activeProfile ? activeProfile._id : '';
      const res = await api.get(`/medications?elderlyId=${elderlyId}`);
      if (res.data.success) {
        setMedications(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedications();
  }, [activeProfile]);

  const handleAddMedication = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const timesArray = formData.times.split(',').map((t) => t.trim());
      const payload = {
        ...formData,
        times: timesArray,
        elderlyProfileId: activeProfile ? activeProfile._id : undefined,
      };

      const res = await api.post('/medications', payload);
      if (res.data.success) {
        setSuccess(`Medication ${res.data.data.name} added successfully!`);
        setModalOpen(false);
        setFormData({
          name: '',
          dosage: '',
          frequency: 'Once Daily',
          times: '08:00',
          instructions: 'Take with water after food',
          prescribingDoctor: '',
        });
        fetchMedications();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add medication.');
    }
  };

  const handleDiscontinue = async (id, name) => {
    if (window.confirm(`Are you sure you want to discontinue ${name}?`)) {
      try {
        await api.delete(`/medications/${id}`);
        setMedications((prev) => prev.filter((m) => m._id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-surface-200 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-teal-600 font-bold text-xs uppercase tracking-wider mb-2">
            <Pill className="w-4 h-4" />
            <span>{t('prescriptionManagement')}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('medications')}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t('patient')}: <span className="font-bold text-slate-800">{activeProfile?.fullName}</span>
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow transition"
        >
          <Plus className="w-4 h-4" />
          <span>{t('addNewMedicine')}</span>
        </button>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {/* Medications List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 text-center py-12 text-xs text-slate-400">{t('loading')}</div>
        ) : medications.length === 0 ? (
          <div className="col-span-2 text-center py-12 bg-white rounded-3xl border border-surface-200 p-8 shadow-card">
            <Pill className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">{t('noActiveMeds')}</p>
            <p className="text-xs text-slate-400 mt-1">Click "{t('addNewMedicine')}" to create your first prescription schedule.</p>
          </div>
        ) : (
          medications.map((med) => (
            <div
              key={med._id}
              className="bg-white rounded-3xl p-6 border border-surface-200 shadow-card flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{med.name}</h3>
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
                      {med.dosage} • {med.frequency}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDiscontinue(med._id, med.name)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition"
                    title="Discontinue Medication"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-teal-600" />
                    <span>Scheduled Times (IST): <strong className="text-slate-800">{med.times.join(', ')}</strong></span>
                  </div>
                  <p className="bg-surface-50 p-2.5 rounded-xl border border-surface-200 text-slate-700 italic">
                    "{med.instructions}"
                  </p>
                  {med.prescribingDoctor && (
                    <p className="text-slate-500 text-[11px]">
                      {t('prescribingDoctor')}: <strong className="text-slate-700">{med.prescribingDoctor}</strong>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Medication Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-surface-200">
            <div className="flex items-center justify-between pb-4 border-b border-surface-100">
              <h3 className="text-lg font-bold text-slate-900">{t('addNewMedicine')}</h3>
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

            <form onSubmit={handleAddMedication} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">{t('medName')}</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Metformin Hydrochloride"
                  className="w-full bg-surface-50 border border-surface-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">{t('dosage')}</label>
                  <input
                    type="text"
                    required
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                    placeholder="e.g. 500 mg / 1 tablet"
                    className="w-full bg-surface-50 border border-surface-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">{t('frequency')}</label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    className="w-full bg-surface-50 border border-surface-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Once Daily">Once Daily</option>
                    <option value="Twice Daily">Twice Daily</option>
                    <option value="Thrice Daily">Thrice Daily</option>
                    <option value="As Needed">As Needed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">
                  {t('scheduledTimesList')}
                </label>
                <input
                  type="text"
                  required
                  value={formData.times}
                  onChange={(e) => setFormData({ ...formData, times: e.target.value })}
                  placeholder="08:30, 13:00, 20:30"
                  className="w-full bg-surface-50 border border-surface-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">{t('instructions')}</label>
                <input
                  type="text"
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  placeholder="e.g. After breakfast with warm water"
                  className="w-full bg-surface-50 border border-surface-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">{t('prescribingDoctor')}</label>
                <input
                  type="text"
                  value={formData.prescribingDoctor}
                  onChange={(e) => setFormData({ ...formData, prescribingDoctor: e.target.value })}
                  placeholder="e.g. Dr. K. Swaminathan"
                  className="w-full bg-surface-50 border border-surface-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
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
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow"
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

export default MedicationManagementPage;
