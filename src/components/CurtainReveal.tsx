import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface CurtainRevealProps {
  isOpen: boolean;
  onAnimationComplete?: () => void;
  children: React.ReactNode;
}

export const CurtainReveal: React.FC<CurtainRevealProps> = ({
  isOpen,
  onAnimationComplete,
  children,
}) => {
  const [showCurtains, setShowCurtains] = useState(true);

  useEffect(() => {
    if (isOpen) {
      // Allow curtain slide animation to complete before unmounting decorative overlay
      const timer = setTimeout(() => {
        setShowCurtains(false);
        onAnimationComplete?.();
      }, 1400);
      return () => clearTimeout(timer);
    } else {
      setShowCurtains(true);
    }
  }, [isOpen, onAnimationComplete]);

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Underlying Main Portal Website */}
      <div className="relative z-10 w-full min-h-screen">
        {children}
      </div>

      {/* Red Velvet Opening Curtains Overlay */}
      {showCurtains && (
        <div
          className={`fixed inset-0 z-50 pointer-events-none flex overflow-hidden transition-opacity duration-500 ${
            isOpen ? 'opacity-95' : 'opacity-100'
          }`}
          aria-hidden={isOpen ? 'true' : 'false'}
        >
          {/* Top Valance (Golden Decorative Fringe) */}
          <motion.div
            initial={{ y: 0 }}
            animate={isOpen ? { y: -120 } : { y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-0 left-0 right-0 h-14 sm:h-20 bg-gradient-to-b from-[#881337] via-[#be123c] to-[#9f1239] border-b-4 border-[#F5C451] shadow-2xl z-30 flex items-center justify-center select-none"
          >
            {/* Golden fringe scallop decoration */}
            <div className="flex items-center gap-4 text-amber-200">
              <span className="text-xl sm:text-2xl">✨</span>
              <span className="font-serif-display font-bold text-sm sm:text-base tracking-widest uppercase text-amber-100">
                Welcome Gift Presentation
              </span>
              <span className="text-xl sm:text-2xl">✨</span>
            </div>
          </motion.div>

          {/* Left Red Velvet Curtain */}
          <motion.div
            initial={{ x: '0%' }}
            animate={isOpen ? { x: '-102%' } : { x: '0%' }}
            transition={{
              duration: 1.3,
              ease: [0.4, 0.0, 0.2, 1],
            }}
            className="relative w-1/2 h-full curtain-velvet curtain-fold border-r-4 border-[#F5C451] shadow-2xl flex flex-col justify-center items-end pr-4 sm:pr-8"
          >
            {/* Golden Tassel Tieback Rope */}
            <div className="w-6 h-28 sm:w-10 sm:h-36 rounded-full border-2 border-[#F5C451] bg-gradient-to-b from-[#F5C451] via-[#d97706] to-[#b45309] shadow-lg flex items-center justify-center text-white text-xs font-bold" />
          </motion.div>

          {/* Right Red Velvet Curtain */}
          <motion.div
            initial={{ x: '0%' }}
            animate={isOpen ? { x: '102%' } : { x: '0%' }}
            transition={{
              duration: 1.3,
              ease: [0.4, 0.0, 0.2, 1],
            }}
            className="relative w-1/2 h-full curtain-velvet curtain-fold border-l-4 border-[#F5C451] shadow-2xl flex flex-col justify-center items-start pl-4 sm:pl-8"
          >
            {/* Golden Tassel Tieback Rope */}
            <div className="w-6 h-28 sm:w-10 sm:h-36 rounded-full border-2 border-[#F5C451] bg-gradient-to-b from-[#F5C451] via-[#d97706] to-[#b45309] shadow-lg flex items-center justify-center text-white text-xs font-bold" />
          </motion.div>

          {/* Golden Celebration Sparkles & Confetti Effect */}
          {isOpen && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-40">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.4, 1.8], opacity: [0, 1, 0] }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="flex items-center gap-3 text-4xl sm:text-6xl text-[#F5C451]"
              >
                <span>🌟</span>
                <span>🎉</span>
                <span>✨</span>
              </motion.div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
