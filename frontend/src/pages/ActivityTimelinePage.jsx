import React, { useState, useEffect } from 'react';
import { History, Clock, User, Shield, CheckCircle2, Pill, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ActivityTimelinePage = () => {
  const { activeProfile } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTimeline = async () => {
    try {
      setLoading(true);
      const elderlyId = activeProfile ? activeProfile._id : '';
      const res = await api.get(`/timeline/${elderlyId}`);
      if (res.data.success) {
        setLogs(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, [activeProfile]);

  const getActionIcon = (action) => {
    if (action.includes('DOSE')) return <Pill className="w-4 h-4 text-emerald-600" />;
    if (action.includes('APPOINTMENT')) return <Calendar className="w-4 h-4 text-indigo-600" />;
    if (action.includes('CARE') || action.includes('MEMBER')) return <Shield className="w-4 h-4 text-sky-600" />;
    return <CheckCircle2 className="w-4 h-4 text-brand-600" />;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-surface-200 shadow-card">
        <div className="inline-flex items-center space-x-2 text-amber-600 font-bold text-xs uppercase tracking-wider mb-2">
          <History className="w-4 h-4" />
          <span>Audit Log</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Activity & Compliance Timeline
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Complete transparent audit record for <span className="font-bold text-slate-800">{activeProfile?.fullName}</span>
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-surface-200 shadow-card">
        {loading ? (
          <div className="text-center py-12 text-xs text-slate-400">Loading audit history...</div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-400">No activity logged yet.</div>
        ) : (
          <div className="relative pl-6 border-l-2 border-surface-200 space-y-6">
            {logs.map((log) => (
              <div key={log._id} className="relative group">
                <div className="absolute -left-[31px] top-1 p-1.5 rounded-full bg-surface-50 border-2 border-surface-200 group-hover:border-brand-500 transition">
                  {getActionIcon(log.action)}
                </div>

                <div className="bg-surface-50 p-4 rounded-2xl border border-surface-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-800 uppercase tracking-wide">
                      {log.action.replace(/_/g, ' ')}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      {new Date(log.createdAt).toLocaleString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                        dateStyle: 'medium',
                        timeStyle: 'medium',
                      })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 mt-1">{log.details}</p>

                  {log.performedBy && (
                    <div className="mt-2 pt-2 border-t border-surface-200/60 flex items-center space-x-1.5 text-[11px] text-slate-500">
                      <User className="w-3 h-3 text-slate-400" />
                      <span>By: <strong className="text-slate-700">{log.performedBy.name}</strong> ({log.performedBy.role})</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityTimelinePage;
