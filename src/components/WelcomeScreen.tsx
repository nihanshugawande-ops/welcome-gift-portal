import React from 'react';
import { motion } from 'motion/react';
import { GiftBoxIllustration } from './GiftBoxIllustration';
import { Sparkles, ShieldCheck, HeartHandshake, ArrowRight, Lock } from 'lucide-react';

interface WelcomeScreenProps {
  onContinue: () => void;
  onOpenAdmin: () => void;
  onOpenDbInfo: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onContinue,
  onOpenAdmin,
  onOpenDbInfo,
}) => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between px-4 py-6 sm:py-10 overflow-hidden bg-gradient-to-b from-[#EAF7FF] via-[#EDE7FF] to-[#FFF5F8]">
      {/* Soft Colorful Ambient Celebration Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[80vw] sm:w-[50vw] h-[45vh] rounded-full bg-gradient-to-br from-[#87CEEB]/35 via-[#EDE7FF]/40 to-transparent blur-3xl transform -rotate-12" />
        <div className="absolute top-[15%] right-[-10%] w-[70vw] sm:w-[45vw] h-[40vh] rounded-full bg-gradient-to-bl from-[#FF5C93]/20 via-[#F5C451]/20 to-transparent blur-3xl transform rotate-12" />
        <div className="absolute bottom-[-10%] left-[10%] w-[85vw] sm:w-[60vw] h-[45vh] rounded-full bg-gradient-to-tr from-[#F5C451]/25 via-[#EAF7FF]/60 to-transparent blur-3xl" />
      </div>

      {/* Top Header / Brand Bar */}
      <header className="relative z-10 w-full max-w-md flex items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#FF5C93] via-[#D7193F] to-[#F5C451] text-white shadow-md shadow-pink-200 text-sm">
            🎁
          </span>
          <div>
            <span className="text-xs font-black tracking-widest uppercase text-[#D7193F] font-mono block">
              Welcome Gift
            </span>
            <span className="text-[10px] text-slate-500 font-medium block">
              Official Celebration Portal
            </span>
          </div>
        </div>

        <button
          onClick={onOpenAdmin}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#17243A] hover:text-[#D7193F] bg-white/90 hover:bg-white border border-sky-200/80 shadow-xs transition-all cursor-pointer backdrop-blur-md"
          title="Admin Dashboard Portal"
        >
          <Lock className="w-3.5 h-3.5 text-[#FF5C93]" />
          <span>Admin</span>
        </button>
      </header>

      {/* Central Hero Content */}
      <main className="relative z-10 w-full max-w-md flex-1 flex flex-col items-center justify-center text-center my-auto py-4">
        {/* Subtitle Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-pink-200/90 text-[#D7193F] text-xs sm:text-sm font-bold shadow-sm mb-4"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#F5C451] animate-spin" style={{ animationDuration: '6s' }} />
          <span>Welcome Gift</span>
        </motion.div>

        {/* Gift Box Illustration with entrance */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.15 }}
          className="my-1 sm:my-2"
        >
          <GiftBoxIllustration size="md" onClick={onContinue} />
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-3xl sm:text-4xl font-extrabold text-[#17243A] tracking-tight mt-3 font-serif-display drop-shadow-xs"
        >
          Welcome, Friend! 🎁
        </motion.h1>

        {/* Gift Message */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-base sm:text-lg text-[#D7193F] font-bold mt-2 px-4 max-w-xs sm:max-w-sm"
        >
          This Is a Special Gift for You! 💝
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xs leading-relaxed"
        >
          We are delighted to celebrate this moment with you. Tap below to claim your exclusive registration gift.
        </motion.p>

        {/* Action Button: "Continue 🎁" */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="w-full mt-6 px-2"
        >
          <button
            onClick={onContinue}
            className="w-full relative group overflow-hidden rounded-2xl p-[2px] focus:outline-none focus:ring-4 focus:ring-pink-300 active:scale-[0.98] transition-transform cursor-pointer shadow-xl shadow-rose-200/80 hover:shadow-rose-300"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#FF5C93] via-[#D7193F] to-[#F5C451] rounded-2xl" />
            <span className="relative flex items-center justify-center gap-3 px-6 py-4 rounded-[14px] bg-gradient-to-r from-[#FF5C93] via-[#D7193F] to-[#FF5C93] text-white font-bold text-lg shadow-inner group-hover:brightness-105 transition-all">
              <span>Continue 🎁</span>
              <ArrowRight className="w-5 h-5 text-amber-200 group-hover:translate-x-1.5 transition-transform" />
            </span>
          </button>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex items-center justify-center gap-4 text-[11px] text-slate-600 font-medium mt-6"
        >
          <span className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-full border border-sky-100 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secure Registry</span>
          </span>
          <span className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-full border border-pink-100 shadow-2xs">
            <HeartHandshake className="w-3.5 h-3.5 text-[#D7193F]" />
            <span>Friendship Gift</span>
          </span>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-md pt-3 flex flex-col items-center gap-1 text-center">
        <button
          onClick={onOpenDbInfo}
          className="text-[11px] text-slate-500 hover:text-[#D7193F] font-semibold underline underline-offset-4 decoration-sky-300 hover:decoration-[#FF5C93] transition-colors cursor-pointer"
        >
          Database Persistence: SQLite Active
        </button>
        <p className="text-[10px] text-slate-500">
          Welcome Gift &bull; Official Celebration &amp; Registration Portal
        </p>
      </footer>
    </div>
  );
};
