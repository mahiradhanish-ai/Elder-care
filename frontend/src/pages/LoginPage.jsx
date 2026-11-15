import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HeartPulse,
  Mail,
  Lock,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);

    try {
      const res = await login(cleanEmail, password);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message || 'Login failed. Please verify your email and password.');
      }
    } catch (err) {
      setError(
        err.friendlyMessage ||
          err.response?.data?.message ||
          'Could not reach server. Please ensure the backend is running on port 5000.'
      );
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = async (demoEmail, roleLabel) => {
    setError('');
    setEmail(demoEmail);
    setPassword('password123');
    setDemoLoading(roleLabel);

    try {
      // First ensure database has seed data
      try {
        await api.post('/auth/seed-demo');
      } catch (seedErr) {
        // If seed fails or exists, continue with login
      }

      const res = await login(demoEmail, 'password123');
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message || 'Could not log in with demo credentials.');
      }
    } catch (err) {
      setError(
        err.friendlyMessage ||
          'Could not connect with demo account. Ensure backend server is running on port 5000.'
      );
    } finally {
      setDemoLoading('');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center space-x-2.5 mb-4 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/20 group-hover:scale-105 transition transform duration-200">
            <HeartPulse className="w-7 h-7" />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900">
            ElderCare <span className="text-brand-600">Connect</span>
          </span>
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Sign In to Your Account
        </h1>
        <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
          Welcome back. Enter your credentials or choose a quick role demo below
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-[0_4px_24px_rgba(0,0,0,0.06)] rounded-3xl border border-slate-200/80">
          {/* Quick Demo Credentials Selector */}
          <div className="mb-6 p-4 rounded-2xl bg-brand-50/60 border border-brand-100">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-brand-900 uppercase tracking-wider mb-2.5">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>Instant Demo Accounts (Click any role)</span>
            </div>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => fillDemoAccount('ramesh@eldercare.com', 'Elderly')}
                disabled={!!demoLoading}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold bg-white border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/60 text-slate-800 flex items-center justify-between transition shadow-sm active:scale-[0.99]"
              >
                <div className="flex items-center space-x-2">
                  <span>👴</span>
                  <span className="text-slate-900">Elderly: Ramesh Patel</span>
                </div>
                <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-extrabold">
                  {demoLoading === 'Elderly' ? 'Signing in...' : '1-Click'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => fillDemoAccount('priya@eldercare.com', 'Caretaker')}
                disabled={!!demoLoading}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold bg-white border border-slate-200 hover:border-teal-400 hover:bg-teal-50/60 text-slate-800 flex items-center justify-between transition shadow-sm active:scale-[0.99]"
              >
                <div className="flex items-center space-x-2">
                  <span>👩‍⚕️</span>
                  <span className="text-slate-900">Caretaker: Nurse Priya</span>
                </div>
                <span className="text-[10px] text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full font-extrabold">
                  {demoLoading === 'Caretaker' ? 'Signing in...' : '1-Click'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => fillDemoAccount('arun@eldercare.com', 'Family')}
                disabled={!!demoLoading}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/60 text-slate-800 flex items-center justify-between transition shadow-sm active:scale-[0.99]"
              >
                <div className="flex items-center space-x-2">
                  <span>👨‍👩‍👧</span>
                  <span className="text-slate-900">Family: Arun Patel</span>
                </div>
                <span className="text-[10px] text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full font-extrabold">
                  {demoLoading === 'Family' ? 'Signing in...' : '1-Click'}
                </span>
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-start space-x-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Email Address
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-surface-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 py-2.5 bg-surface-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-2xl shadow-md text-sm font-extrabold text-white bg-brand-600 hover:bg-brand-700 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 transition transform duration-150"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </div>
          </form>

          {/* Footer Link */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-extrabold text-brand-600 hover:text-brand-700">
              Create an account &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
