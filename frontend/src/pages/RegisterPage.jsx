import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HeartPulse,
  Mail,
  Lock,
  User,
  Phone,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [role, setRole] = useState('elderly');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const passwordValid = password.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // Pre-flight frontend validation
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    if (!cleanName) {
      setError('Please provide your full name.');
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!passwordValid) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: cleanName,
        email: cleanEmail,
        password,
        role,
        phone: cleanPhone,
        languagePreference: 'en',
      };

      const res = await register(payload);
      if (res.success) {
        setSuccessMsg('Account registered successfully! Redirecting to your dashboard...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 800);
      } else {
        setError(res.message || 'Registration could not be completed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
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
          Create Your Healthcare Account
        </h1>
        <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
          Choose your role below to configure your tailored medication and care interface
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-[0_4px_24px_rgba(0,0,0,0.06)] rounded-3xl border border-slate-200/80">
          {/* Role Selector */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              Select Your Role
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setRole('elderly')}
                className={`py-3 px-2 text-center rounded-2xl text-xs font-extrabold transition-all duration-150 border-2 flex flex-col items-center space-y-1 ${
                  role === 'elderly'
                    ? 'bg-emerald-50/80 border-emerald-500 text-emerald-900 shadow-sm'
                    : 'bg-surface-50 border-slate-200 text-slate-600 hover:bg-surface-100 hover:border-slate-300'
                }`}
              >
                <span className="text-base">👴</span>
                <span>Elderly User</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('caretaker')}
                className={`py-3 px-2 text-center rounded-2xl text-xs font-extrabold transition-all duration-150 border-2 flex flex-col items-center space-y-1 ${
                  role === 'caretaker'
                    ? 'bg-teal-50/80 border-teal-500 text-teal-900 shadow-sm'
                    : 'bg-surface-50 border-slate-200 text-slate-600 hover:bg-surface-100 hover:border-slate-300'
                }`}
              >
                <span className="text-base">👩‍⚕️</span>
                <span>Caretaker</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('family')}
                className={`py-3 px-2 text-center rounded-2xl text-xs font-extrabold transition-all duration-150 border-2 flex flex-col items-center space-y-1 ${
                  role === 'family'
                    ? 'bg-indigo-50/80 border-indigo-500 text-indigo-900 shadow-sm'
                    : 'bg-surface-50 border-slate-200 text-slate-600 hover:bg-surface-100 hover:border-slate-300'
                }`}
              >
                <span className="text-base">👨‍👩‍👧</span>
                <span>Family</span>
              </button>
            </div>
          </div>

          {/* Error & Success Feedback Banners */}
          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-start space-x-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center space-x-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="font-bold">{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Full Name
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Patel"
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-surface-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
                />
              </div>
            </div>

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

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Phone Number <span className="text-slate-400 font-normal lowercase">(for SOS & emergency alerts)</span>
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-surface-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Password & Confirm Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
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
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 chars"
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

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className={`block w-full pl-10 pr-9 py-2.5 bg-surface-50 border rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 transition ${
                      confirmPassword && !passwordsMatch
                        ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/30'
                        : confirmPassword && passwordsMatch
                        ? 'border-emerald-300 focus:ring-emerald-500 bg-emerald-50/30'
                        : 'border-slate-200 focus:ring-brand-500 focus:bg-white'
                    }`}
                  />
                  {confirmPassword && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      {passwordsMatch ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-500" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-2xl shadow-md text-sm font-extrabold text-white bg-brand-600 hover:bg-brand-700 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 transition transform duration-150"
              >
                {loading ? 'Creating Your Account...' : 'Complete Registration'}
              </button>
            </div>
          </form>

          {/* Footer Navigation */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-extrabold text-brand-600 hover:text-brand-700">
              Sign In &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
