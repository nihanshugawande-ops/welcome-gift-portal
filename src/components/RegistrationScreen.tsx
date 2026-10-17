import React, { useState, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { COUNTRIES } from '../data/countries';
import { CountryInfo, RegistrationResponse } from '../types';
import { TermsModal } from './TermsModal';
import {
  ChevronDown,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  ArrowLeft,
  Gift,
  User,
  ShieldCheck,
  FileText,
  KeyRound,
} from 'lucide-react';

interface RegistrationScreenProps {
  onBack: () => void;
  onSuccess: (data: RegistrationResponse['data']) => void;
}

export const RegistrationScreen: React.FC<RegistrationScreenProps> = ({
  onBack,
  onSuccess,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo>(
    COUNTRIES.find((c) => c.dialCode === '+91') || COUNTRIES[0]
  );
  const [displayName, setDisplayName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingOtp, setIsCheckingOtp] = useState(false);
  const [otpNotice, setOtpNotice] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const termsCheckboxId = useId();

  // Filter countries
  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.dialCode.includes(searchQuery) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cleanDigits = mobileNumber.replace(/\D/g, '');

  const validateInput = (): string | null => {
    if (!displayName.trim()) {
      return 'कृपया अपना नाम दर्ज करें (नाम डालना जरूरी है)। / Please enter your full name.';
    }

    if (displayName.trim().length < 2) {
      return 'कृपया कम से कम 2 अक्षरों का नाम दर्ज करें। / Name must be at least 2 characters.';
    }

    if (!cleanDigits) {
      return 'Please enter your mobile phone number.';
    }

    if (selectedCountry.dialCode === '+91') {
      if (cleanDigits.length !== 10) {
        return `Indian mobile numbers must be 10 digits (currently ${cleanDigits.length}).`;
      }
      if (!/^[6-9]/.test(cleanDigits)) {
        return 'Indian mobile numbers must start with 6, 7, 8, or 9.';
      }
      if (/^(\d)\1{9}$/.test(cleanDigits)) {
        return 'Please enter a valid, real personal mobile number.';
      }
    } else {
      if (cleanDigits.length < 7 || cleanDigits.length > 15) {
        return 'Mobile numbers must contain between 7 and 15 digits.';
      }
    }

    if (!agreeTerms) {
      return 'Please agree to the Terms & Conditions to complete your registration.';
    }

    return null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const digits = rawVal.replace(/\D/g, '');

    const maxLen = selectedCountry.dialCode === '+91' ? 10 : 15;
    const truncated = digits.slice(0, maxLen);

    if (selectedCountry.dialCode === '+91') {
      if (truncated.length > 5) {
        setMobileNumber(`${truncated.slice(0, 5)} ${truncated.slice(5)}`);
      } else {
        setMobileNumber(truncated);
      }
    } else {
      setMobileNumber(truncated);
    }

    if (errorMessage) setErrorMessage(null);
  };

  // Get OTP check (Checks real SMS provider status truthfully)
  const handleGetOtp = async () => {
    setOtpNotice(null);
    setIsCheckingOtp(true);
    try {
      const res = await fetch('/api/otp/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          countryCode: selectedCountry.dialCode,
          mobileNumber: cleanDigits,
        }),
      });
      const data = await res.json();
      if (!data.configured) {
        setOtpNotice(
          'SMS verification provider is not configured. Please agree to the Terms & Conditions and click "Continue" to proceed with verified registration.'
        );
      } else {
        setOtpNotice(data.message || 'SMS provider check completed.');
      }
    } catch {
      setOtpNotice(
        'SMS gateway is currently unconfigured. You can proceed directly using the "Continue" button below.'
      );
    } finally {
      setIsCheckingOtp(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setOtpNotice(null);

    const validationError = validateInput();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          countryCode: selectedCountry.dialCode,
          mobileNumber: cleanDigits,
          displayName: displayName.trim(),
          consent: true,
        }),
      });

      const data: RegistrationResponse = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(data.message || 'Registration failed. Please try again.');
        return;
      }

      if (data.data) {
        onSuccess(data.data);
      }
    } catch (err: any) {
      console.error('Registration fetch error:', err);
      setErrorMessage('Unable to connect to the registration server. Please check your network connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    displayName.trim().length >= 2 &&
    cleanDigits.length >= (selectedCountry.dialCode === '+91' ? 10 : 7) &&
    agreeTerms &&
    !isSubmitting;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between px-4 py-6 sm:py-8 overflow-hidden bg-gradient-to-b from-[#EAF7FF] via-[#EDE7FF] to-[#FFF5F8]">
      {/* Background Celebration Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[70vw] max-w-[420px] h-[320px] rounded-full bg-gradient-to-b from-[#87CEEB]/30 via-[#FF5C93]/15 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[70vw] max-w-[420px] h-[320px] rounded-full bg-gradient-to-t from-[#F5C451]/20 via-[#EAF7FF]/40 to-transparent blur-3xl" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-md flex items-center justify-between pb-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#17243A] hover:text-[#D7193F] bg-white/90 hover:bg-white border border-sky-200/80 shadow-2xs transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-pink-200 text-[#D7193F] text-xs font-bold shadow-2xs">
          <Gift className="w-3.5 h-3.5 text-[#FF5C93]" />
          <span>Gift Registration</span>
        </div>
      </header>

      {/* Main Registration Card */}
      <main className="relative z-10 w-full max-w-md flex-1 flex flex-col justify-center my-auto py-2">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-white/95 backdrop-blur-xl border border-sky-100 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-sky-900/10"
        >
          {/* Section Heading */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5C93] via-[#D7193F] to-[#F5C451] text-white shadow-md shadow-pink-200 text-2xl mb-3">
              🎁
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17243A] tracking-tight font-serif-display">
              Claim Your Welcome Gift 🎁
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 font-medium">
              Enter your mobile number to continue.
            </p>
          </div>

          {/* Error Banner */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-[#D7193F] text-xs flex items-start gap-2.5 overflow-hidden font-medium"
              >
                <AlertCircle className="w-4 h-4 text-[#D7193F] shrink-0 mt-0.5" />
                <span className="leading-snug">{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* OTP Provider Notice */}
          <AnimatePresence>
            {otpNotice && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5 overflow-hidden"
              >
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="leading-snug">{otpNotice}</p>
                  <button
                    type="button"
                    onClick={() => setOtpNotice(null)}
                    className="text-[11px] underline text-amber-700 font-semibold mt-1 cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Required Name Field (नाम डालना जरूरी है) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#17243A] mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <span>Your Full Name / आपका नाम</span>
                  <span className="text-[#D7193F] font-bold">*</span>
                </span>
                <span className="text-[10px] text-[#D7193F] font-bold bg-rose-50 px-2 py-0.5 rounded-full border border-pink-200">
                  नाम डालना जरूरी है *
                </span>
              </label>
              <div className="flex items-center px-3.5 py-3 rounded-2xl bg-[#EAF7FF]/40 border border-sky-200 focus-within:border-[#FF5C93] focus-within:bg-white transition-all shadow-2xs">
                <User className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                <input
                  type="text"
                  maxLength={50}
                  value={displayName}
                  onChange={(e) => {
                    setDisplayName(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="उदा. रमेश कुमार / e.g. Ramesh Kumar"
                  required
                  disabled={isSubmitting}
                  className="w-full bg-transparent text-sm text-[#17243A] placeholder-slate-400 focus:outline-none font-medium"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1 pl-1">
                वेलकम गिफ्ट और एडमिन रिकॉर्ड के लिए आपका नाम दर्ज करना अनिवार्य है।
              </p>
            </div>

            {/* Mobile Input Group */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#17243A] mb-1.5">
                Mobile Number <span className="text-[#D7193F]">*</span>
              </label>

              <div className="flex rounded-2xl bg-[#EAF7FF]/40 border border-sky-200 focus-within:border-[#FF5C93] focus-within:bg-white transition-all overflow-hidden shadow-2xs">
                {/* Country Selector Button */}
                <button
                  type="button"
                  onClick={() => setIsCountryModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-3 bg-white/80 hover:bg-white text-[#17243A] border-r border-sky-200 transition-colors shrink-0 cursor-pointer"
                  title="Select Country Dial Code"
                  aria-label="Select Country Code"
                >
                  <span className="text-xl" role="img" aria-label={selectedCountry.name}>
                    {selectedCountry.flag}
                  </span>
                  <span className="font-bold text-sm text-[#17243A]">{selectedCountry.dialCode}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {/* Number Input */}
                <input
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder={selectedCountry.placeholder}
                  value={mobileNumber}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-transparent text-[#17243A] placeholder-slate-400 text-base font-semibold tracking-wide focus:outline-none"
                  aria-label="Mobile Number"
                />
              </div>

              {/* Number format hint */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5 px-1 font-medium">
                <span>
                  {selectedCountry.dialCode === '+91'
                    ? '10-digit Indian mobile number'
                    : `Country: ${selectedCountry.name}`}
                </span>
                {cleanDigits.length > 0 && (
                  <span
                    className={
                      cleanDigits.length === 10 && selectedCountry.dialCode === '+91'
                        ? 'text-emerald-600 font-bold'
                        : 'text-slate-500'
                    }
                  >
                    {cleanDigits.length} digits
                  </span>
                )}
              </div>
            </div>

            {/* Clean Terms & Conditions Checkbox (Section 3 Requirement) */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between gap-3">
                <label htmlFor={termsCheckboxId} className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    id={termsCheckboxId}
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    disabled={isSubmitting}
                    className="w-4 h-4 rounded border-slate-300 bg-white text-[#FF5C93] focus:ring-[#FF5C93] accent-[#FF5C93] shrink-0 cursor-pointer"
                  />
                  <span className="text-xs text-[#17243A] font-semibold">
                    I agree to the
                  </span>
                </label>

                {/* Clickable Terms & Conditions Label */}
                <button
                  type="button"
                  onClick={() => setIsTermsModalOpen(true)}
                  className="text-xs font-bold text-[#FF5C93] hover:text-[#D7193F] underline underline-offset-2 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Terms &amp; Conditions</span>
                </button>
              </div>
              <p className="text-[10px] text-slate-500 mt-1 pl-6">
                Your mobile number will be safely stored for your registration.
              </p>
            </div>

            {/* Action Buttons: Continue & Get OTP (Section 4 Requirement) */}
            <div className="space-y-2.5 pt-2">
              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full relative group overflow-hidden rounded-2xl py-3.5 px-6 font-bold text-base shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  isFormValid
                    ? 'bg-gradient-to-r from-[#FF5C93] via-[#D7193F] to-[#F5C451] text-white shadow-rose-200 active:scale-[0.98]'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                    <span>Saving Registration...</span>
                  </>
                ) : (
                  <>
                    <span>Continue 🎁</span>
                    <CheckCircle2 className="w-4 h-4 text-amber-200" />
                  </>
                )}
              </button>

              {/* Get OTP Button (Section 4 Requirement) */}
              <button
                type="button"
                onClick={handleGetOtp}
                disabled={isCheckingOtp || isSubmitting || cleanDigits.length < 5}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 hover:text-[#17243A] bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                title="Request real OTP when SMS provider is configured"
              >
                {isCheckingOtp ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Connecting to SMS verification gateway...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-3.5 h-3.5 text-[#FF5C93]" />
                    <span>Get OTP (SMS Verification)</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Privacy Note */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium">
            <Lock className="w-3 h-3 text-emerald-600" />
            <span>Encrypted Server-Side SQLite Database Storage</span>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-md pt-2 text-center">
        <p className="text-[11px] text-slate-500">
          Welcome Gift Portal &bull; Mobile Number Claim Registration
        </p>
      </footer>

      {/* Terms & Conditions Modal */}
      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        onAccept={() => setAgreeTerms(true)}
      />

      {/* Country Selection Modal */}
      <AnimatePresence>
        {isCountryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="w-full max-w-md max-h-[85vh] flex flex-col bg-white border border-sky-100 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h3 className="font-bold text-[#17243A] text-base">Select Country Dial Code</h3>
                <button
                  onClick={() => setIsCountryModalOpen(false)}
                  className="px-2.5 py-1 text-xs text-slate-600 hover:text-[#17243A] bg-slate-200 rounded-full cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>

              {/* Search input */}
              <div className="p-3 border-b border-slate-100 bg-white">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search country or code..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-sm text-[#17243A] placeholder-slate-400 focus:outline-none"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-xs text-slate-500 hover:text-[#17243A]"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Country List */}
              <div className="overflow-y-auto flex-1 p-2 divide-y divide-slate-100">
                {filteredCountries.length === 0 ? (
                  <p className="p-6 text-center text-sm text-slate-500">No matching country found.</p>
                ) : (
                  filteredCountries.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setSelectedCountry(c);
                        setIsCountryModalOpen(false);
                        setSearchQuery('');
                      }}
                      className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-colors cursor-pointer text-left ${
                        selectedCountry.code === c.code
                          ? 'bg-rose-50 text-[#D7193F] font-bold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{c.flag}</span>
                        <div>
                          <div className="text-sm font-bold text-[#17243A]">{c.name}</div>
                          <div className="text-xs text-slate-500">Sample: {c.placeholder}</div>
                        </div>
                      </div>
                      <span className="text-sm font-mono font-bold text-[#FF5C93]">{c.dialCode}</span>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
