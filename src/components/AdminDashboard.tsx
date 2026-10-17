import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  RegistrationRecord,
  AdminStats,
  RegistrationListResponse,
} from '../types';
import {
  Search,
  Download,
  Trash2,
  RefreshCw,
  LogOut,
  Users,
  Calendar,
  ShieldCheck,
  Database,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Copy,
  Check,
  ExternalLink,
  Loader2,
  Radio,
  Eye,
  X,
  User,
  ShieldAlert,
  SlidersHorizontal,
  Phone,
} from 'lucide-react';

interface AdminDashboardProps {
  adminToken: string;
  adminUsername: string;
  onLogout: () => void;
  onGoToVisitor: () => void;
  onOpenDbInfo: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  adminToken,
  adminUsername,
  onLogout,
  onGoToVisitor,
  onOpenDbInfo,
}) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [records, setRecords] = useState<RegistrationRecord[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<RegistrationRecord | null>(null);
  const [recordToView, setRecordToView] = useState<RegistrationRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  // Real-time SSE and Polling state
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [autoPolling, setAutoPolling] = useState(true);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Fetch Statistics
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.status === 401) {
        onLogout();
        return;
      }
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
    }
  }, [adminToken, onLogout]);

  // Fetch Registrations
  const fetchRegistrations = useCallback(
    async (page = pagination.page, query = searchQuery, limit = pagination.limit, silent = false) => {
      if (!silent) setIsLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          search: query,
        });

        const res = await fetch(`/api/admin/registrations?${queryParams.toString()}`, {
          headers: { Authorization: `Bearer ${adminToken}` },
        });

        if (res.status === 401) {
          onLogout();
          return;
        }

        const data: RegistrationListResponse = await res.json();

        if (data.success) {
          setRecords(data.records);
          setPagination(data.pagination);
        }
      } catch (err) {
        if (!silent) {
          console.error('Failed to fetch registrations:', err);
          setFeedbackMessage({ text: 'Error fetching records from database.', type: 'error' });
        }
      } finally {
        if (!silent) setIsLoading(false);
      }
    },
    [adminToken, onLogout, pagination.limit, pagination.page, searchQuery]
  );

  // Initial Data Load
  useEffect(() => {
    fetchStats();
    fetchRegistrations(1, searchQuery, pagination.limit);
  }, []);

  // -------------------------------------------------------------
  // Real-Time Server-Sent Events (SSE) + Fallback Polling
  // -------------------------------------------------------------
  useEffect(() => {
    if (!adminToken) return;

    // Connect to SSE endpoint
    try {
      const sseUrl = `/api/admin/live-stream?token=${encodeURIComponent(adminToken)}`;
      const es = new EventSource(sseUrl);
      eventSourceRef.current = es;

      es.addEventListener('connected', () => {
        setIsLiveConnected(true);
      });

      es.addEventListener('registration', (event: MessageEvent) => {
        try {
          const payload = JSON.parse(event.data);
          // Show live notification
          setFeedbackMessage({
            text: `⚡ New Registration Received: ID ${payload.record.id} (${payload.record.fullMobileNumber})`,
            type: 'info',
          });

          // Refresh stats and records list immediately
          fetchStats();
          fetchRegistrations(pagination.page, searchQuery, pagination.limit, true);
        } catch (e) {
          console.error('SSE payload error:', e);
        }
      });

      es.onerror = () => {
        setIsLiveConnected(false);
      };

      return () => {
        es.close();
      };
    } catch (e) {
      console.warn('SSE connection initialization skipped, relying on secure polling.');
    }
  }, [adminToken, fetchRegistrations, fetchStats, pagination.limit, pagination.page, searchQuery]);

  // Periodic polling fallback (every 8 seconds when enabled)
  useEffect(() => {
    if (!autoPolling) return;
    const interval = setInterval(() => {
      fetchStats();
      fetchRegistrations(pagination.page, searchQuery, pagination.limit, true);
    }, 8000);

    return () => clearInterval(interval);
  }, [autoPolling, fetchRegistrations, fetchStats, pagination.limit, pagination.page, searchQuery]);

  // Search Input Handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRegistrations(1, searchQuery, pagination.limit);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchRegistrations(1, '', pagination.limit);
  };

  // Delete Record Handler
  const handleDeleteConfirm = async () => {
    if (!recordToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/registrations/${recordToDelete.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setFeedbackMessage({
          text: `Record ${recordToDelete.id} successfully deleted from database.`,
          type: 'success',
        });
        setRecordToDelete(null);
        fetchStats();
        fetchRegistrations(pagination.page, searchQuery, pagination.limit);
      } else {
        setFeedbackMessage({
          text: data.message || 'Failed to delete record.',
          type: 'error',
        });
      }
    } catch (err) {
      console.error('Delete error:', err);
      setFeedbackMessage({ text: 'Network error deleting record.', type: 'error' });
    } finally {
      setIsDeleting(false);
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  };

  // View Single Record Details
  const handleViewRecord = async (record: RegistrationRecord) => {
    try {
      const res = await fetch(`/api/admin/registrations/${record.id}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const data = await res.json();
      if (data.success && data.record) {
        setRecordToView(data.record);
      } else {
        setRecordToView(record);
      }
    } catch {
      setRecordToView(record);
    }
  };

  // CSV Export Handler
  const handleExportCsv = async () => {
    setIsExporting(true);
    try {
      const res = await fetch('/api/admin/export-csv', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      if (!res.ok) {
        throw new Error('Failed to download CSV export');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `welcome-gift-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setFeedbackMessage({ text: 'Authorized CSV export downloaded successfully.', type: 'success' });
      setTimeout(() => setFeedbackMessage(null), 3000);
    } catch (err) {
      console.error('Export CSV error:', err);
      setFeedbackMessage({ text: 'Failed to export CSV.', type: 'error' });
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#EAF7FF] text-[#17243A] flex flex-col font-sans">
      {/* Top Admin Navigation Bar */}
      <nav className="border-b border-sky-100 bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onGoToVisitor}
              className="p-2 rounded-xl text-slate-600 hover:text-[#17243A] hover:bg-slate-100 border border-sky-200 bg-white transition-colors cursor-pointer shadow-2xs"
              title="Go to Visitor Welcome Portal"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🎁</span>
                <span className="font-extrabold text-[#17243A] text-base sm:text-lg">Welcome Gift</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-[#D7193F] border border-pink-200">
                  Admin Portal
                </span>
                {isLiveConnected && (
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Live SSE</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Secure registry management &bull; Logged in as <strong className="text-[#17243A]">{adminUsername}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenDbInfo}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#17243A] hover:text-[#D7193F] bg-white hover:bg-sky-50 border border-sky-200 transition-colors cursor-pointer shadow-2xs"
              title="Database Status"
            >
              <Database className="w-3.5 h-3.5 text-sky-600" />
              <span>SQLite DB</span>
            </button>

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#D7193F] hover:bg-rose-50 border border-rose-200 bg-white transition-colors cursor-pointer shadow-2xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Admin Content */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 space-y-6">
        {/* Environment Variable Warning (if using defaults) */}
        {stats?.envConfig?.usingDefaultAdmin && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-start gap-2.5 shadow-2xs">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Development Credentials Active</strong>
              <span className="text-slate-600">
                The server is using default credentials (<code className="font-mono text-[#D7193F] font-bold">admin</code>). Configure{' '}
                <code className="font-mono text-slate-800 bg-amber-100 px-1 rounded">ADMIN_USERNAME</code>,{' '}
                <code className="font-mono text-slate-800 bg-amber-100 px-1 rounded">ADMIN_PASSWORD</code>, and{' '}
                <code className="font-mono text-slate-800 bg-amber-100 px-1 rounded">SESSION_SECRET</code> in your production environment!
              </span>
            </div>
          </div>
        )}

        {/* Feedback Alert Banner */}
        <AnimatePresence>
          {feedbackMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-3.5 rounded-2xl text-xs sm:text-sm flex items-center justify-between border shadow-2xs ${
                feedbackMessage.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : feedbackMessage.type === 'info'
                  ? 'bg-sky-50 border-sky-200 text-sky-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <div className="flex items-center gap-2 font-medium">
                {feedbackMessage.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                ) : feedbackMessage.type === 'info' ? (
                  <Radio className="w-4 h-4 text-sky-600 animate-pulse" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-[#D7193F]" />
                )}
                <span>{feedbackMessage.text}</span>
              </div>
              <button
                onClick={() => setFeedbackMessage(null)}
                className="text-xs opacity-75 hover:opacity-100 cursor-pointer ml-4 font-bold"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Total Registrations */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-sky-100 shadow-md shadow-sky-900/5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Registrations</span>
              <div className="p-2 rounded-2xl bg-rose-50 text-[#FF5C93] border border-pink-200">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#17243A]">
                {stats ? stats.totalRegistrations : '...'}
              </span>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">Unique records saved</p>
            </div>
          </div>

          {/* Card 2: Registrations Today */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-sky-100 shadow-md shadow-sky-900/5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registrations Today</span>
              <div className="p-2 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-700">
                {stats ? stats.todayRegistrations : '...'}
              </span>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">Submissions since 00:00 UTC</p>
            </div>
          </div>

          {/* Card 3: Verified Numbers */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-sky-100 shadow-md shadow-sky-900/5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Verified Numbers</span>
              <div className="p-2 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
                {stats ? stats.verifiedNumbers : 0}
              </span>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">Real OTP verified</p>
            </div>
          </div>

          {/* Card 4: Unverified Numbers */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-sky-100 shadow-md shadow-sky-900/5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Unverified Numbers</span>
              <div className="p-2 rounded-2xl bg-sky-50 text-sky-600 border border-sky-200">
                <Database className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-sky-700">
                {stats ? stats.unverifiedNumbers : 0}
              </span>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">Consent-based (Not Verified)</p>
            </div>
          </div>
        </div>

        {/* Controls Toolbar: Search, Auto-Refresh Toggle, Export CSV */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white border border-sky-100 p-3.5 rounded-2xl shadow-sm">
          {/* Search form */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <div className="flex items-center px-3.5 py-2 rounded-xl bg-[#EAF7FF]/40 border border-sky-200 focus-within:border-[#FF5C93] focus-within:bg-white transition-all">
              <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search by ID, Mobile Number or Name..."
                className="w-full bg-transparent text-sm text-[#17243A] placeholder-slate-400 focus:outline-none font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="text-xs text-slate-500 hover:text-[#17243A] px-1.5 cursor-pointer font-semibold"
                >
                  Clear
                </button>
              )}
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
            {/* Auto-polling toggle */}
            <button
              onClick={() => setAutoPolling(!autoPolling)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer shadow-2xs ${
                autoPolling
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
              title="Toggle automatic periodic refresh"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  autoPolling ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                }`}
              />
              <span>{autoPolling ? 'Auto-Update ON' : 'Auto-Update OFF'}</span>
            </button>

            <button
              onClick={() => {
                fetchStats();
                fetchRegistrations(pagination.page, searchQuery, pagination.limit);
              }}
              disabled={isLoading}
              className="p-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-[#17243A] border border-sky-200 transition-colors cursor-pointer shadow-2xs"
              title="Refresh database records"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#FF5C93]' : ''}`} />
            </button>

            <button
              onClick={handleExportCsv}
              disabled={isExporting || (stats?.totalRegistrations || 0) === 0}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-200 transition-all cursor-pointer disabled:opacity-50"
              title="Export all authorized registration records to CSV"
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Registrations Table / Card View */}
        <div className="bg-white border border-sky-100 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-4 sm:p-5 border-b border-sky-100 flex items-center justify-between bg-white">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#17243A]">Registered Participants</h2>
              <p className="text-xs text-slate-500 font-medium">
                {searchQuery
                  ? `Filtered results for "${searchQuery}"`
                  : 'Official registered records stored persistently in database'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Rows:</span>
              <select
                value={pagination.limit}
                onChange={(e) => {
                  const newLimit = Number(e.target.value);
                  fetchRegistrations(1, searchQuery, newLimit);
                }}
                className="bg-slate-50 border border-slate-200 text-xs text-[#17243A] rounded-lg px-2 py-1 focus:outline-none cursor-pointer font-medium"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-[#FF5C93]" />
              <span className="text-sm font-medium">Querying SQLite database records...</span>
            </div>
          ) : records.length === 0 ? (
            <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-2">
              <span className="text-4xl">🎁</span>
              <p className="text-base font-bold text-[#17243A] mt-2">No registrations found</p>
              <p className="text-xs text-slate-500 max-w-sm">
                {searchQuery
                  ? 'No records matched your search query. Try searching with fewer digits or ID prefix.'
                  : 'No visitors have registered yet. Test the registration form from the Visitor portal!'}
              </p>
              <button
                onClick={onGoToVisitor}
                className="mt-3 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF5C93] to-[#D7193F] text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-rose-200"
              >
                Go to Registration Form 🎁
              </button>
            </div>
          ) : (
            <>
              {/* Mobile Card List (Visible on phones & small screens) */}
              <div className="md:hidden divide-y divide-slate-100">
                {records.map((record) => {
                  const formattedDate = new Date(record.submissionTimestamp).toLocaleString(
                    'en-US',
                    {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    }
                  );

                  return (
                    <div key={record.id} className="p-4 bg-white hover:bg-sky-50/50 transition-colors space-y-3">
                      {/* Top Bar: ID and Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold text-[#D7193F] bg-rose-50 px-2 py-0.5 rounded-lg border border-pink-200">
                            {record.id}
                          </span>
                          <button
                            onClick={() => handleCopyId(record.id)}
                            className="text-slate-400 hover:text-[#17243A] p-1 rounded hover:bg-slate-100 cursor-pointer"
                            title="Copy ID"
                          >
                            {copiedId === record.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleViewRecord(record)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#17243A] hover:bg-sky-100 transition-colors cursor-pointer"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setRecordToDelete(record)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#D7193F] hover:bg-rose-100 transition-colors cursor-pointer"
                            title="Delete record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Main Phone Number & Name Highlight */}
                      <div className="bg-[#EAF7FF]/50 p-3 rounded-2xl border border-sky-100 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                              मोबाइल नंबर (Mobile Number)
                            </span>
                            <span className="font-mono text-lg font-black text-[#17243A] tracking-wider">
                              {record.fullMobileNumber}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleCopyPhone(record.fullMobileNumber)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-sky-200 text-xs font-semibold text-[#17243A] shadow-2xs cursor-pointer"
                              title="Copy Mobile"
                            >
                              {copiedPhone === record.fullMobileNumber ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span className="text-emerald-700 text-[11px]">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                                  <span className="text-[11px]">Copy</span>
                                </>
                              )}
                            </button>
                            <a
                              href={`tel:${record.fullMobileNumber}`}
                              className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors shadow-2xs"
                              title="Call"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>

                        {/* Person Name */}
                        <div className="flex items-center gap-1.5 pt-1 border-t border-sky-200/60">
                          <User className="w-3.5 h-3.5 text-[#D7193F] shrink-0" />
                          <span className="text-xs text-slate-600 font-medium">नाम / Name:</span>
                          <span className="text-xs font-bold text-[#D7193F] truncate">
                            {record.displayName || 'नाम दर्ज नहीं'}
                          </span>
                        </div>
                      </div>

                      {/* Footer: Date & Consent */}
                      <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                        <span>{formattedDate}</span>
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          <span>सहमति दर्ज (Consent OK)</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop Table View (Visible on tablets & desktop) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#EAF7FF] via-[#EDE7FF] to-[#FFF5F8] text-[#17243A] font-bold border-b border-sky-100">
                      <th className="py-3 px-4 sm:px-6">Registration ID</th>
                      <th className="py-3 px-4 sm:px-6">Mobile Number &amp; Full Name (मोबाइल और नाम)</th>
                      <th className="py-3 px-4 sm:px-6">Submission Date</th>
                      <th className="py-3 px-4 sm:px-6">Consent Status</th>
                      <th className="py-3 px-4 sm:px-6">Verification Status</th>
                      <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {records.map((record) => {
                      const formattedDate = new Date(record.submissionTimestamp).toLocaleString(
                        'en-US',
                        {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      );

                      return (
                        <tr key={record.id} className="hover:bg-[#EAF7FF]/40 transition-colors">
                          {/* Registration ID with copy */}
                          <td className="py-3.5 px-4 sm:px-6">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-[#D7193F] bg-rose-50 px-2 py-0.5 rounded-lg border border-pink-200">
                                {record.id}
                              </span>
                              <button
                                onClick={() => handleCopyId(record.id)}
                                className="text-slate-400 hover:text-[#17243A] p-1 rounded hover:bg-slate-100 cursor-pointer"
                                title="Copy ID"
                              >
                                {copiedId === record.id ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* Mobile Number & Name */}
                          <td className="py-3.5 px-4 sm:px-6">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-black text-[#17243A] text-sm sm:text-base tracking-wider bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
                                {record.fullMobileNumber}
                              </span>
                              <button
                                onClick={() => handleCopyPhone(record.fullMobileNumber)}
                                className="text-slate-400 hover:text-[#D7193F] p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                                title="Copy Mobile Number"
                              >
                                {copiedPhone === record.fullMobileNumber ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                              <a
                                href={`tel:${record.fullMobileNumber}`}
                                className="text-slate-400 hover:text-emerald-600 p-1.5 rounded-lg hover:bg-emerald-50 cursor-pointer transition-colors"
                                title="Call Number"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                            </div>

                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[#17243A] text-xs font-bold mt-1.5 shadow-2xs">
                              <User className="w-3 h-3 text-[#D7193F]" />
                              <span>नाम: <strong className="text-[#D7193F]">{record.displayName || 'नाम दर्ज नहीं'}</strong></span>
                            </div>
                          </td>

                          {/* Submission Date */}
                          <td className="py-3.5 px-4 sm:px-6 text-slate-600">
                            <div className="font-medium text-[#17243A]">{formattedDate}</div>
                            <span className="text-[10px] text-slate-500 font-mono">Registration Received</span>
                          </td>

                          {/* Consent Status */}
                          <td className="py-3.5 px-4 sm:px-6">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              <span>Consent Confirmed</span>
                            </span>
                          </td>

                          {/* Verification Status */}
                          <td className="py-3.5 px-4 sm:px-6">
                            {record.verificationStatus === 'verified' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                                Not Verified
                              </span>
                            )}
                          </td>

                          {/* Actions: View & Delete */}
                          <td className="py-3.5 px-4 sm:px-6 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleViewRecord(record)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-[#17243A] hover:bg-sky-50 transition-colors cursor-pointer"
                                title="View full record details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => setRecordToDelete(record)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-[#D7193F] hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Delete this registration record"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Pagination Bar */}
          {pagination.total > 0 && (
            <div className="p-4 border-t border-sky-100 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
              <div>
                Showing{' '}
                <strong className="text-[#17243A]">
                  {Math.min((pagination.page - 1) * pagination.limit + 1, pagination.total)}
                </strong>{' '}
                to{' '}
                <strong className="text-[#17243A]">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </strong>{' '}
                of <strong className="text-[#17243A]">{pagination.total}</strong> registrations
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    fetchRegistrations(pagination.page - 1, searchQuery, pagination.limit)
                  }
                  disabled={pagination.page <= 1 || isLoading}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-[#17243A] border border-slate-200 shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-semibold"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <span className="px-2 py-1 font-mono text-[#17243A] font-bold">
                  Page {pagination.page} of {pagination.totalPages}
                </span>

                <button
                  onClick={() =>
                    fetchRegistrations(pagination.page + 1, searchQuery, pagination.limit)
                  }
                  disabled={pagination.page >= pagination.totalPages || isLoading}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-[#17243A] border border-slate-200 shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-semibold"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* View Record Detail Modal */}
      <AnimatePresence>
        {recordToView && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white border border-sky-100 rounded-3xl p-6 shadow-2xl relative text-[#17243A]"
            >
              <button
                onClick={() => setRecordToView(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 text-slate-400 hover:text-[#17243A] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-lg font-bold text-[#17243A] mb-1 font-serif-display">Registration Record Details</h3>
              <p className="text-xs text-slate-500 mb-4 font-medium">Saved in persistent SQLite database</p>

              <div className="space-y-2.5 text-xs text-slate-700 p-4 rounded-2xl bg-[#EAF7FF]/40 border border-sky-100">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Registration ID:</span>
                  <span className="font-mono font-bold text-[#D7193F]">{recordToView.id}</span>
                </div>
                {recordToView.displayName && (
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Display Name:</span>
                    <span className="font-bold text-[#17243A]">{recordToView.displayName}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Mobile Number:</span>
                  <span className="font-mono font-bold text-[#17243A]">{recordToView.fullMobileNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Submission Timestamp:</span>
                  <span className="text-slate-700">{new Date(recordToView.submissionTimestamp).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Registration Status:</span>
                  <span className="text-emerald-700 font-bold">Registration Received</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Verification Status:</span>
                  <span className="font-mono text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">{recordToView.verificationStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Consent Verified:</span>
                  <span className="text-emerald-700 font-bold">True</span>
                </div>
              </div>

              <button
                onClick={() => setRecordToView(null)}
                className="w-full mt-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#17243A] text-xs font-bold cursor-pointer transition-colors"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {recordToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white border border-sky-100 rounded-3xl p-6 shadow-2xl text-[#17243A]"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-[#D7193F] flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-bold text-[#17243A] text-center font-serif-display">Confirm Permanent Deletion</h3>
              <p className="text-xs text-slate-600 text-center mt-1 leading-relaxed">
                Are you sure you want to permanently delete this registration record from the persistent database?
                This action cannot be undone.
              </p>

              {/* Record Summary Box */}
              <div className="my-5 p-3.5 rounded-2xl bg-rose-50/50 border border-rose-100 text-xs space-y-1.5 text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">ID:</span>
                  <span className="font-mono font-bold text-[#D7193F]">{recordToDelete.id}</span>
                </div>
                {recordToDelete.displayName && (
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Name:</span>
                    <span className="text-[#17243A] font-bold">{recordToDelete.displayName}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Mobile Number:</span>
                  <span className="font-mono font-bold text-[#17243A]">
                    {recordToDelete.fullMobileNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Timestamp:</span>
                  <span className="text-slate-700">
                    {new Date(recordToDelete.submissionTimestamp).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setRecordToDelete(null)}
                  disabled={isDeleting}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#17243A] text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#D7193F] hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-rose-200"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Record</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
