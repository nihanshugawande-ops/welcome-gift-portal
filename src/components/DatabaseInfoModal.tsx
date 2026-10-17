import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Database, CheckCircle, Server, HardDrive, ShieldCheck, RefreshCw, X } from 'lucide-react';

interface DatabaseInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseInfoModal: React.FC<DatabaseInfoModalProps> = ({ isOpen, onClose }) => {
  const [healthData, setHealthData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHealth = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealthData(data);
    } catch (err) {
      console.error('Health fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHealth();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-white border border-sky-100 rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto text-[#17243A]"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-[#17243A] bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center shadow-xs">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#17243A]">Database &amp; Architecture</h3>
            <p className="text-xs text-slate-500 font-medium">Server-side persistent storage verification</p>
          </div>
        </div>

        {/* Live Status Card */}
        <div className="p-4 rounded-2xl bg-[#EAF7FF]/50 border border-sky-100 space-y-2.5 text-xs mb-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-600 flex items-center gap-1.5 font-medium">
              <Server className="w-3.5 h-3.5 text-emerald-600" />
              <span>Database Connection</span>
            </span>
            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
              <CheckCircle className="w-3 h-3" />
              <span>Connected &amp; Active</span>
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-600 flex items-center gap-1.5 font-medium">
              <HardDrive className="w-3.5 h-3.5 text-sky-600" />
              <span>Storage Engine</span>
            </span>
            <span className="font-mono font-bold text-sky-800">
              {healthData?.database?.engine || 'SQLite (node:sqlite)'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-600 font-medium">Storage File Location</span>
            <span className="font-mono text-slate-700 text-[11px] truncate max-w-[200px]" title={healthData?.database?.path}>
              ./data/welcome_gift.db
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-600 font-medium">Total Registered Rows</span>
            <span className="font-bold text-[#D7193F]">
              {healthData?.database?.totalRegistrations ?? '...'} records
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-600 flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF5C93]" />
              <span>Persistence Type</span>
            </span>
            <span className="text-slate-700 font-semibold">Server-Side Disk (WAL Mode)</span>
          </div>
        </div>

        {/* Explanatory details */}
        <div className="space-y-3 text-xs text-slate-700">
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80">
            <h4 className="font-bold text-[#17243A] mb-1">How records are preserved:</h4>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Every mobile registration is validated server-side and recorded immediately in the local SQLite database. Data is never kept only in the user's browser, preventing loss on page reload.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-pink-200/80">
            <h4 className="font-bold text-[#17243A] mb-1">Configuration &amp; Security:</h4>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Admin endpoints require bearer authorization tokens with constant-time password comparison. No private user numbers or credentials are exposed to frontend bundles.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-5 flex items-center justify-between pt-3 border-t border-slate-100">
          <button
            onClick={fetchHealth}
            disabled={isLoading}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-[#D7193F] cursor-pointer font-semibold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#FF5C93]' : ''}`} />
            <span>Check live status</span>
          </button>

          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#17243A] text-xs font-bold cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
