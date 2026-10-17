import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, X, FileText, Database, Users, Trash2, CheckCircle2 } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, onAccept }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#EAF7FF] via-[#EDE7FF] to-[#FFF5F8] border-b border-sky-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF5C93] to-[#F5C451] text-white flex items-center justify-center shadow-md">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#17243A]">Terms &amp; Conditions</h3>
              <p className="text-xs text-slate-500 font-medium">Welcome Gift Portal Registration Transparency</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-white/80 transition-colors cursor-pointer"
            aria-label="Close Terms Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto text-[#17243A] text-xs sm:text-sm leading-relaxed divide-y divide-slate-100">
          {/* Section 1: What is collected */}
          <div className="flex items-start gap-3 pt-2">
            <div className="p-2 rounded-xl bg-sky-50 text-[#87CEEB] shrink-0 mt-0.5">
              <Database className="w-4 h-4 text-sky-600" />
            </div>
            <div>
              <h4 className="font-bold text-[#17243A] text-sm mb-1">1. Information We Collect</h4>
              <p className="text-slate-600 text-xs">
                When registering for your welcome gift, we collect your <strong>mobile phone number</strong>, country dial code,
                and optional <strong>display name</strong>.
              </p>
            </div>
          </div>

          {/* Section 2: Why it is collected */}
          <div className="flex items-start gap-3 pt-4">
            <div className="p-2 rounded-xl bg-pink-50 text-[#FF5C93] shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4 text-[#D7193F]" />
            </div>
            <div>
              <h4 className="font-bold text-[#17243A] text-sm mb-1">2. Purpose of Collection</h4>
              <p className="text-slate-600 text-xs">
                Your mobile number is collected strictly to record your registration, issue your unique gift reference ID,
                and prevent automated duplicate abuse. We never sell your number or send unsolicited third-party marketing.
              </p>
            </div>
          </div>

          {/* Section 3: Who can access */}
          <div className="flex items-start gap-3 pt-4">
            <div className="p-2 rounded-xl bg-amber-50 text-[#F5C451] shrink-0 mt-0.5">
              <Users className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h4 className="font-bold text-[#17243A] text-sm mb-1">3. Access to Your Data</h4>
              <p className="text-slate-600 text-xs">
                Registration records are stored on a secure persistent server database. Access is strictly restricted
                to authenticated administrators through a password-protected administrative dashboard with session tokens.
              </p>
            </div>
          </div>

          {/* Section 4: How to request deletion */}
          <div className="flex items-start gap-3 pt-4">
            <div className="p-2 rounded-xl bg-rose-50 text-[#D7193F] shrink-0 mt-0.5">
              <Trash2 className="w-4 h-4 text-[#D7193F]" />
            </div>
            <div>
              <h4 className="font-bold text-[#17243A] text-sm mb-1">4. Right to Deletion</h4>
              <p className="text-slate-600 text-xs">
                You have the full right to have your registration record permanently deleted from the database at any time.
                Contact the portal administrator or submit your Registration Reference ID for immediate removal.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Close
          </button>
          {onAccept && (
            <button
              onClick={() => {
                onAccept();
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF5C93] to-[#D7193F] text-white font-bold text-xs shadow-md shadow-rose-200 hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>I Understand &amp; Agree</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
