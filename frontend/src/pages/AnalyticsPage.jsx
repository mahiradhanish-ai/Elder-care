import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, CheckCircle2, AlertTriangle, PieChart as PieIcon, Calendar } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#8b5cf6'];

const AnalyticsPage = () => {
  const { activeProfile } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const elderlyId = activeProfile ? activeProfile._id : '';
      const res = await api.get(`/analytics/${elderlyId}`);
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [activeProfile]);

  const pieData = data
    ? [
        { name: 'Taken', value: data.takenCount || 0 },
        { name: 'Missed', value: data.missedCount || 0 },
        { name: 'Pending', value: data.pendingCount || 0 },
        { name: 'Unconfirmed', value: data.unconfirmedCount || 0 },
      ].filter((i) => i.value > 0)
    : [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-surface-200 shadow-card">
        <div className="inline-flex items-center space-x-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-2">
          <BarChart3 className="w-4 h-4" />
          <span>Compliance Analytics</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Medication Adherence Insights
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Patient: <span className="font-bold text-slate-800">{activeProfile?.fullName}</span> • Timezone: Asia/Kolkata (IST)
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-surface-200 shadow-card">
          <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Adherence Rate</span>
          <span className="text-3xl font-black text-brand-600">
            {data ? `${data.adherenceRate}%` : '0%'}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">Verified Taken / Actionable</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-surface-200 shadow-card">
          <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Total Doses</span>
          <span className="text-3xl font-black text-slate-900">{data?.totalDoses || 0}</span>
          <span className="text-[11px] text-slate-400 block mt-1">Logged records</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-surface-200 shadow-card">
          <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Taken Doses</span>
          <span className="text-3xl font-black text-emerald-600">{data?.takenCount || 0}</span>
          <span className="text-[11px] text-emerald-700 block mt-1">Confirmed on time</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-surface-200 shadow-card">
          <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Unconfirmed / Late</span>
          <span className="text-3xl font-black text-rose-600">{data?.unconfirmedCount || 0}</span>
          <span className="text-[11px] text-rose-700 block mt-1">Alerts dispatched</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trend Bar Chart */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-surface-200 shadow-card">
          <h3 className="text-lg font-bold text-slate-900 mb-1">Weekly Adherence Trend</h3>
          <p className="text-xs text-slate-500 mb-6">Daily taken vs scheduled doses</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={
                  data?.weeklyTrends?.length
                    ? data.weeklyTrends
                    : [
                        { date: 'Mon', taken: 2, total: 2 },
                        { date: 'Tue', taken: 2, total: 2 },
                        { date: 'Wed', taken: 1, total: 2 },
                        { date: 'Thu', taken: 2, total: 2 },
                        { date: 'Fri', taken: 2, total: 2 },
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
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="taken" fill="#10b981" radius={[6, 6, 0, 0]} name="Taken" />
                <Bar dataKey="total" fill="#0c87eb" radius={[6, 6, 0, 0]} name="Total Scheduled" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Pie Chart */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-surface-200 shadow-card">
          <h3 className="text-lg font-bold text-slate-900 mb-1">Dose Status Distribution</h3>
          <p className="text-xs text-slate-500 mb-6">Breakdown across all logged prescriptions</p>

          <div className="h-64 w-full flex items-center justify-center">
            {pieData.length === 0 ? (
              <p className="text-xs text-slate-400">No dose logs available to graph.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
