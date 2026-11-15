import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, HeartPulse, Pill, Clock } from 'lucide-react';
import api from '../services/api';

const PublicConfirmationPage = () => {
  const { token } = useParams();
  const [status, setStatus] = useState({
    loading: true,
    success: false,
    message: '',
    data: null,
  });

  useEffect(() => {
    const confirmDose = async () => {
      try {
        const res = await api.get(`/medication-logs/confirm/${token}`);
        if (res.data.success) {
          setStatus({
            loading: false,
            success: true,
            message: res.data.message,
            data: res.data,
          });
        }
      } catch (err) {
        setStatus({
          loading: false,
          success: false,
          message: err.response?.data?.message || 'Invalid or expired confirmation link.',
          data: null,
        });
      }
    };

    if (token) {
      confirmDose();
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col justify-center items-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-card border border-surface-200 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-teal-500 text-white flex items-center justify-center mx-auto mb-6 shadow-md">
          <HeartPulse className="w-9 h-9" />
        </div>

        {status.loading ? (
          <div className="py-8">
            <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm font-semibold text-slate-700">Recording your medication dose...</p>
          </div>
        ) : status.success ? (
          <div>
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Dose Confirmed!</h2>
            <p className="text-sm text-slate-600 mb-6">{status.message}</p>

            {status.data && (
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 text-xs text-emerald-900 font-semibold mb-6 space-y-1">
                <p>Medication: <strong>{status.data.medicationName}</strong> ({status.data.dosage})</p>
                <p>Scheduled: <strong>{status.data.time} (IST)</strong></p>
                <p>Status: <span className="uppercase text-emerald-700 font-bold">Recorded as Taken</span></p>
              </div>
            )}

            <Link
              to="/login"
              className="inline-block w-full py-3 px-4 rounded-xl bg-brand-600 text-white font-bold text-sm shadow hover:bg-brand-700 transition"
            >
              Go to ElderCare Connect
            </Link>
          </div>
        ) : (
          <div>
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Confirmation Issue</h2>
            <p className="text-xs text-slate-500 mb-6">{status.message}</p>

            <Link
              to="/login"
              className="inline-block w-full py-3 px-4 rounded-xl bg-surface-100 hover:bg-surface-200 text-slate-800 font-bold text-sm border border-surface-200 transition"
            >
              Sign In to Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicConfirmationPage;
