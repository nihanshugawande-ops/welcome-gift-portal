import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  FileText,
  Info,
  ShieldCheck,
  Database,
  Lock,
  ChevronRight,
  ExternalLink,
  Sparkles,
  MapPin,
  BookOpen,
  Heart,
  Sun,
  Gift,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { TermsModal } from './TermsModal';
import { MainSection } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  registrationId?: string;
  displayName?: string;
  onSelectSection?: (section: MainSection) => void;
  onOpenAdmin: () => void;
  onOpenDbInfo: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  registrationId,
  displayName,
  onSelectSection,
  onOpenAdmin,
  onOpenDbInfo,
}) => {
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'settings' | 'about'>('settings');

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.22 }}
          className="w-full max-w-lg bg-[#FFFDF9] rounded-3xl shadow-2xl border border-[#ECC86A]/60 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-[#FFFDF9] via-[#FAF8F5] to-[#FFF5F8] border-b border-amber-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF5C93] via-[#D7193F] to-[#D4AF37] text-white flex items-center justify-center shadow-md shadow-pink-200 text-lg">
                ⚙️
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#17243A]">Portal Settings &amp; Info</h3>
                <p className="text-xs text-[#D7193F] font-semibold">Welcome Gift Official Portal</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close Settings"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-amber-100/70 bg-[#FAF8F5] px-6 pt-2">
            <button
              onClick={() => setActiveTab('settings')}
              className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'border-[#D7193F] text-[#D7193F]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Settings &amp; Policies
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'about'
                  ? 'border-[#D7193F] text-[#D7193F]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              About This Gift
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-5 sm:p-6 space-y-4 overflow-y-auto text-xs sm:text-sm">
            {activeTab === 'settings' && (
              <>
                {/* 1. Terms & Conditions Item (Requirement 3: Move full Terms & Conditions into Settings) */}
                <div className="rounded-2xl border border-amber-200/80 bg-white p-4 shadow-2xs hover:border-[#FF5C93] transition-all">
                  <button
                    onClick={() => setIsTermsOpen(true)}
                    className="w-full flex items-center justify-between text-left group cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-pink-50 text-[#FF5C93] group-hover:bg-[#FF5C93] group-hover:text-white transition-colors shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-[#17243A] text-sm group-hover:text-[#D7193F] transition-colors">
                            Terms &amp; Conditions
                          </h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-[#D7193F] border border-rose-200">
                            Transparent
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          Review what information is collected, why it is stored, authorized administrator access, and how you can request deletion at any time.
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#D7193F] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                  </button>
                </div>

                {/* 2. Registration Status Card */}
                <div className="rounded-2xl border border-sky-200/80 bg-white p-4 shadow-2xs">
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-sky-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Registration Profile</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Confirmed Active
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[11px] text-slate-500 block">Registration Code</span>
                      <span className="font-mono font-bold text-[#D7193F] text-sm">
                        {registrationId || 'WG-FRIEND'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block">User Name</span>
                      <span className="font-semibold text-[#17243A]">
                        {displayName || 'Honored Friend'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block">Storage Consent</span>
                      <span className="font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Granted &amp; Logged</span>
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block">Database Storage</span>
                      <button
                        onClick={onOpenDbInfo}
                        className="font-semibold text-sky-700 underline flex items-center gap-1 cursor-pointer"
                      >
                        <Database className="w-3.5 h-3.5" />
                        <span>SQLite Active</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Additional Exploration Zones */}
                {onSelectSection && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                      More Cultural &amp; Celebration Zones
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          onSelectSection('india');
                          onClose();
                        }}
                        className="flex items-center gap-2 p-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-900 font-bold text-xs transition-colors cursor-pointer text-left"
                      >
                        <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                        <span className="truncate">Beautiful India</span>
                      </button>
                      <button
                        onClick={() => {
                          onSelectSection('knowledge');
                          onClose();
                        }}
                        className="flex items-center gap-2 p-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-900 font-bold text-xs transition-colors cursor-pointer text-left"
                      >
                        <BookOpen className="w-4 h-4 text-sky-600 shrink-0" />
                        <span className="truncate">Knowledge Corner</span>
                      </button>
                      <button
                        onClick={() => {
                          onSelectSection('friendship');
                          onClose();
                        }}
                        className="flex items-center gap-2 p-2.5 rounded-xl bg-pink-50 hover:bg-pink-100 border border-pink-200 text-pink-900 font-bold text-xs transition-colors cursor-pointer text-left"
                      >
                        <Heart className="w-4 h-4 text-[#FF5C93] shrink-0" />
                        <span className="truncate">Friendship Zone</span>
                      </button>
                      <button
                        onClick={() => {
                          onSelectSection('daily-surprise');
                          onClose();
                        }}
                        className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold text-xs transition-colors cursor-pointer text-left"
                      >
                        <Sun className="w-4 h-4 text-amber-600 shrink-0" />
                        <span className="truncate">Daily Surprise</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. Admin Portal Access */}
                <div className="rounded-2xl border border-slate-200 bg-[#FAF8F5] p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Lock className="w-4 h-4 text-[#D7193F]" />
                    <div>
                      <span className="font-bold text-xs text-[#17243A] block">Administrator Portal</span>
                      <span className="text-[10px] text-slate-500">Requires server-side login</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAdmin();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-[#17243A] hover:text-[#D7193F] hover:border-pink-300 transition-colors cursor-pointer shadow-2xs"
                  >
                    Open Admin
                  </button>
                </div>
              </>
            )}

            {activeTab === 'about' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-white to-pink-50 border border-amber-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🎁</span>
                    <h4 className="font-serif-display font-extrabold text-base text-[#17243A]">
                      The Welcome Gift Portal
                    </h4>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    This portal is designed to share heartfelt celebrations, Indian cultural heritage, sacred spiritual blessings, visionary artistic creations, and interactive games with friends, family, and loved ones.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
                  <h5 className="font-bold text-xs uppercase tracking-wider text-[#D7193F]">
                    Celebration Color Theme
                  </h5>
                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
                    <div className="p-2 rounded-xl bg-[#FFFDF9] border border-amber-200">
                      <div className="w-4 h-4 rounded-full bg-[#FFFDF9] border border-slate-300 mx-auto mb-1" />
                      <span>Ivory White</span>
                    </div>
                    <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                      <div className="w-4 h-4 rounded-full bg-[#D4AF37] mx-auto mb-1" />
                      <span>Champagne Gold</span>
                    </div>
                    <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-900">
                      <div className="w-4 h-4 rounded-full bg-[#FF5C93] mx-auto mb-1" />
                      <span>Rose Pink</span>
                    </div>
                    <div className="p-2 rounded-xl bg-red-50 border border-red-200 text-red-900">
                      <div className="w-4 h-4 rounded-full bg-[#D7193F] mx-auto mb-1" />
                      <span>Deep Red</span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#FAF8F5] border border-slate-200">
                      <div className="w-4 h-4 rounded-full bg-[#FDFBF7] border border-slate-300 mx-auto mb-1" />
                      <span>Warm Cream</span>
                    </div>
                    <div className="p-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-900">
                      <div className="w-4 h-4 rounded-full bg-[#EDE7FF] mx-auto mb-1" />
                      <span>Soft Lavender</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
                  <strong className="text-[#17243A] block mb-1">Data Respect &amp; Ethics:</strong>
                  Your contact details are never shared with third parties or advertisers. All registration data is stored in the portal's secure server SQLite database.
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-5 bg-[#FAF8F5] border-t border-amber-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-medium">
              Version 2.0 &bull; Celebration Release
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#17243A] hover:bg-[#D7193F] text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>

      {/* Embedded Terms & Conditions Modal */}
      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />
    </>
  );
};
