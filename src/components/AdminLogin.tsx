import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, User, Eye, EyeOff, ShieldAlert, ArrowLeft, Loader2, KeyRound } from 'lucide-react';
import { AdminLoginResponse } from '../types';

interface AdminLoginProps {
  onBack: () => void;
  onLoginSuccess: (token: string, username: string) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBack, onLoginSuccess }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!username.trim() || !password) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data: AdminLoginResponse = await response.json();

      if (!response.ok || !data.success || !data.token) {
        setErrorMessage(data.message || 'Invalid admin credentials.');
        return;
      }

      // Store in memory / pass to parent
      onLoginSuccess(data.token, data.username || username);
    } catch (err: any) {
      console.error('Admin login error:', err);
      setErrorMessage('Unable to connect to the authentication server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between px-4 py-6 sm:py-8 overflow-hidden bg-gradient-to-b from-[#EAF7FF] via-[#EDE7FF] to-[#FFF5F8]">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[70vw] max-w-[450px] h-[300px] rounded-full bg-gradient-to-b from-[#87CEEB]/25 via-[#FF5C93]/20 to-transparent blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full max-w-md flex items-center justify-between pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#17243A] hover:text-[#D7193F] bg-white/90 hover:bg-white border border-sky-200 shadow-2xs transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Gift Portal</span>
        </button>

        <span className="text-xs font-mono text-[#D7193F] font-bold uppercase tracking-wider bg-rose-50 px-2.5 py-0.5 rounded-full border border-pink-200 shadow-2xs">
          Admin Portal
        </span>
      </header>

      {/* Main Login Card */}
      <main className="relative z-10 w-full max-w-md flex-1 flex flex-col justify-center my-auto py-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white/95 backdrop-blur-xl border border-sky-100 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-sky-900/10 text-[#17243A]"
        >
          {/* Lock Icon & Title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5C93] via-[#D7193F] to-[#F5C451] text-white shadow-md shadow-pink-200 mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-[#17243A] tracking-tight font-serif-display">
              Admin Authentication
            </h1>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              Protected portal for Welcome Gift registration records
            </p>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-[#D7193F] text-xs flex items-start gap-2.5 font-medium"
              >
                <ShieldAlert className="w-4 h-4 text-[#D7193F] shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#17243A] mb-1.5">
                Admin Username
              </label>
              <div className="flex items-center px-3.5 py-3 rounded-2xl bg-[#EAF7FF]/40 border border-sky-200 focus-within:border-[#FF5C93] focus-within:bg-white transition-all shadow-2xs">
                <User className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  className="w-full bg-transparent text-sm text-[#17243A] placeholder-slate-400 focus:outline-none font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#17243A] mb-1.5">
                Admin Password
              </label>
              <div className="flex items-center px-3.5 py-3 rounded-2xl bg-[#EAF7FF]/40 border border-sky-200 focus-within:border-[#FF5C93] focus-within:bg-white transition-all shadow-2xs">
                <KeyRound className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-transparent text-sm text-[#17243A] placeholder-slate-400 focus:outline-none font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-[#17243A] cursor-pointer ml-2"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#FF5C93] via-[#D7193F] to-[#F5C451] hover:brightness-105 text-white font-bold text-sm shadow-lg shadow-rose-200 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Authenticate &amp; Enter</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Info for Testing */}
          <div className="mt-6 p-3 rounded-2xl bg-[#EAF7FF]/60 border border-sky-200/80 text-[11px] text-slate-600 space-y-1">
            <div className="flex items-center justify-between font-bold text-[#17243A]">
              <span>Configured Admin Credentials:</span>
              <span className="text-[10px] text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded-full font-bold">Default/Env</span>
            </div>
            <p>
              Username: <code className="text-[#D7193F] font-mono font-bold">admin</code>
            </p>
            <p>
              Password: <code className="text-[#D7193F] font-mono font-bold">WelcomeGift@Admin2026</code>
            </p>
            <p className="text-[10px] text-slate-500 pt-1">
              (Configurable in <code className="text-slate-700">.env</code> via ADMIN_USERNAME &amp; ADMIN_PASSWORD)
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-md pt-3 text-center">
        <p className="text-[11px] text-slate-500">
          Admin API endpoints are protected with timed bearer tokens and rate limiting.
        </p>
      </footer>
    </div>
  );
};
