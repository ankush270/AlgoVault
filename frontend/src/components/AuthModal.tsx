import React, { useState } from 'react';
import { X, Mail, Lock, User, Sparkles, CheckCircle2, AlertCircle, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import { loginUser, registerUser } from '../services/authService';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessSync?: (userEmail: string) => void;
  initialTab?: 'login' | 'signup';
  onTabChange?: (tab: 'login' | 'signup') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccessSync, initialTab = 'login', onTabChange }) => {
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(initialTab);

  React.useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  const handleTabChange = (tab: 'login' | 'signup') => {
    setActiveTab(tab);
    setErrorMessage('');
    setSuccessMessage('');
    if (onTabChange) {
      onTabChange(tab);
    } else if (typeof window !== 'undefined' && (window.location.pathname.toLowerCase() === '/login' || window.location.pathname.toLowerCase() === '/signup')) {
      window.history.replaceState(null, '', `/${tab}`);
    }
  };

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      if (activeTab === 'signup') {
        if (!name.trim()) {
          setErrorMessage('Please enter your name.');
          setIsSubmitting(false);
          return;
        }
        if (password.length < 6) {
          setErrorMessage('Password must be at least 6 characters long.');
          setIsSubmitting(false);
          return;
        }
        const res = await registerUser(name, email, password);
        if (res.success && res.token && res.user) {
          login(res.token, res.user, res.refreshToken);
          setSuccessMessage('Account created successfully! Auto-syncing...');
          if (onSuccessSync) onSuccessSync(res.user.email);
          setTimeout(() => {
            onClose();
          }, 1200);
        } else {
          setErrorMessage(res.message || 'Signup failed. Please try again.');
        }
      } else {
        const res = await loginUser(email, password);
        if (res.success && res.token && res.user) {
          login(res.token, res.user, res.refreshToken);
          setSuccessMessage('Logged in successfully! Auto-syncing progress...');
          if (onSuccessSync) onSuccessSync(res.user.email);
          setTimeout(() => {
            onClose();
          }, 1200);
        } else {
          setErrorMessage(res.message || 'Invalid email or password.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full shadow-2xl relative overflow-hidden">
        {/* Decorative Top Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-indigo-600" />

        <button
          onClick={onClose}
          className="absolute right-4 top-5 text-slate-400 hover:text-slate-700 p-1 rounded-xl bg-slate-100/80 hover:bg-slate-200 border border-slate-200 transition-all"
        >
          <X size={18} />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
              <ShieldCheck size={14} className="text-blue-600" />
              <span>DevForge Account Access</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {activeTab === 'login' ? 'Welcome Back!' : 'Create Pro Account'}
            </h2>
            <p className="text-xs text-slate-500">
              {activeTab === 'login'
                ? 'Sign in to access your cross-device bookmarks & revision progress.'
                : 'Register to enable automatic cloud backup across your devices.'}
            </p>
          </div>

          {/* User Perks Banner */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Account Features & Sync:</span>
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                <span>Auto Cloud Sync</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                <span>PC ↔ Mobile Sync</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                <span>Saved Bookmarks</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                <span>Streak Protection</span>
              </div>
            </div>
          </div>

          {/* Login / Signup Tabs */}
          <div className="flex p-1 bg-slate-100 border border-slate-200 rounded-2xl text-xs font-bold">
            <button
              type="button"
              onClick={() => handleTabChange('login')}
              className={`flex-1 py-2.5 rounded-xl transition-all ${
                activeTab === 'login'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('signup')}
              className={`flex-1 py-2.5 rounded-xl transition-all ${
                activeTab === 'signup'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle size={16} className="shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs flex items-center gap-2.5 animate-fadeIn">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'signup' && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ankush Kumar"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all transform active:scale-[0.99] disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Processing...' : activeTab === 'login' ? 'Sign In to My Account' : 'Create Free Account'}</span>
              <ArrowRight size={15} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
