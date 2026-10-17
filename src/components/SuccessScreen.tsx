import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GiftBoxIllustration } from './GiftBoxIllustration';
import { RegistrationResponse } from '../types';
import {
  CheckCircle,
  Copy,
  Check,
  Calendar,
  Phone,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ExternalLink,
  User,
  Info,
} from 'lucide-react';

interface SuccessScreenProps {
  registrationData: RegistrationResponse['data'] | null | undefined;
  onOpenGiftWebsite: () => void;
  onReset: () => void;
  onOpenAdmin: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({
  registrationData,
  onOpenGiftWebsite,
  onReset,
  onOpenAdmin,
}) => {
  const [copied, setCopied] = useState(false);

  const regId = registrationData?.id || 'WG-CONFIRMED';
  const mobile = registrationData?.fullMobileNumber || 'Registered';
  const displayName = registrationData?.displayName || '';
  const timestamp = registrationData?.submissionTimestamp
    ? new Date(registrationData.submissionTimestamp).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : new Date().toLocaleString();

  const handleCopyId = () => {
    navigator.clipboard.writeText(regId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between px-4 py-6 sm:py-8 overflow-hidden bg-gradient-to-b from-[#EAF7FF] via-[#EDE7FF] to-[#FFF5F8]">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[85vw] max-w-[500px] h-[350px] rounded-full bg-gradient-to-b from-[#87CEEB]/25 via-[#FF5C93]/20 to-transparent blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full max-w-md flex items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎉</span>
          <span className="text-xs font-bold uppercase tracking-wider text-[#D7193F]">
            Welcome Gift Portal
          </span>
        </div>

        <button
          onClick={onOpenAdmin}
          className="text-xs font-semibold text-slate-600 hover:text-[#D7193F] flex items-center gap-1 cursor-pointer bg-white/90 px-3 py-1.5 rounded-full border border-sky-100 shadow-2xs"
        >
          <span>Admin Verify</span>
          <ExternalLink className="w-3 h-3 text-[#FF5C93]" />
        </button>
      </header>

      {/* Main Success Container */}
      <main className="relative z-10 w-full max-w-md flex-1 flex flex-col items-center justify-center my-auto py-2">
        {/* Open Gift Box with Festive Particles */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 18 }}
          className="relative"
        >
          <GiftBoxIllustration isOpen={true} size="md" interactive={false} />
        </motion.div>

        {/* Primary Message (Section 8 exact requirements) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-3 mb-4"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2 shadow-2xs">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Registration Confirmed</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#17243A] tracking-tight font-serif-display px-2">
            Your Gift Is Ready! 🎁
          </h1>
          <p className="text-base text-[#D7193F] mt-1 font-bold">
            Thank you, friend!
          </p>
          {displayName && (
            <p className="text-xs text-slate-600 mt-1 font-medium">
              Registered for: <strong className="text-[#17243A]">{displayName}</strong>
            </p>
          )}
        </motion.div>

        {/* Gift Card Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="w-full bg-white/95 backdrop-blur-xl border border-sky-100 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-sky-900/10 relative overflow-hidden"
        >
          {/* Subtle Decorative Golden Ribbon Angle */}
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-[#F5C451]/25 to-transparent rotate-45 pointer-events-none" />

          {/* Registration ID Banner */}
          <div className="bg-gradient-to-r from-[#EAF7FF] to-[#EDE7FF] rounded-2xl p-3.5 border border-sky-200/80 flex items-center justify-between mb-3.5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Registration Reference ID
              </span>
              <span className="font-mono text-lg font-black text-[#D7193F] tracking-wider">
                {regId}
              </span>
            </div>

            <button
              onClick={handleCopyId}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-[#17243A] text-xs font-bold transition-all cursor-pointer border border-sky-200 shadow-2xs"
              title="Copy Registration ID"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Details Grid */}
          <div className="space-y-2 text-xs text-slate-700">
            {displayName && (
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                  <User className="w-3.5 h-3.5 text-amber-500" />
                  <span>Recipient Name</span>
                </span>
                <span className="font-bold text-[#17243A]">{displayName}</span>
              </div>
            )}

            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                <Phone className="w-3.5 h-3.5 text-[#FF5C93]" />
                <span>Mobile Number</span>
              </span>
              <span className="font-mono font-bold text-[#17243A]">{mobile}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                <span>Registered At</span>
              </span>
              <span className="font-medium text-slate-700">{timestamp}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Consent Status</span>
              </span>
              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                <Check className="w-3 h-3" />
                <span>Verified in Database</span>
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                <Info className="w-3.5 h-3.5 text-sky-600" />
                <span>Verification Status</span>
              </span>
              <span className="inline-flex items-center gap-1 text-slate-600 font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded">
                Not Verified (Consent Registered)
              </span>
            </div>
          </div>
        </motion.div>

        {/* PRIMARY ACTION BUTTON: "Open Gift 🎁" (Section 8 Requirement) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="w-full mt-6 space-y-3"
        >
          <button
            onClick={onOpenGiftWebsite}
            className="w-full relative group overflow-hidden rounded-2xl p-[2px] focus:outline-none focus:ring-4 focus:ring-pink-300 active:scale-[0.98] transition-transform cursor-pointer shadow-xl shadow-rose-200/80 hover:shadow-rose-300"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#FF5C93] via-[#D7193F] to-[#F5C451] rounded-2xl" />
            <span className="relative flex items-center justify-center gap-3 px-6 py-4 rounded-[14px] bg-gradient-to-r from-[#FF5C93] via-[#D7193F] to-[#FF5C93] text-white font-bold text-lg shadow-inner group-hover:brightness-105 transition-all">
              <span>Open Gift 🎁</span>
              <ArrowRight className="w-5 h-5 text-amber-200 group-hover:translate-x-1.5 transition-transform" />
            </span>
          </button>

          <button
            onClick={onReset}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:text-[#17243A] bg-white/80 hover:bg-white border border-sky-200 shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F5C451]" />
            <span>Register Another Number</span>
          </button>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-md pt-2 text-center">
        <p className="text-[10px] text-slate-500">
          Welcome Gift Portal &bull; Registration Reference Code Stored Persistently
        </p>
      </footer>
    </div>
  );
};
