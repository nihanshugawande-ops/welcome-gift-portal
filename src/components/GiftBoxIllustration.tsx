import React from 'react';
import { motion } from 'motion/react';

interface GiftBoxProps {
  isOpen?: boolean;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onClick?: () => void;
}

export const GiftBoxIllustration: React.FC<GiftBoxProps> = ({
  isOpen = false,
  size = 'md',
  interactive = true,
  onClick,
}) => {
  const sizeMap = {
    sm: 'w-36 h-36',
    md: 'w-52 h-52 sm:w-60 sm:h-60',
    lg: 'w-64 h-64 sm:w-72 sm:h-72',
  };

  return (
    <div
      onClick={interactive ? onClick : undefined}
      className={`relative flex items-center justify-center select-none ${sizeMap[size]} ${
        interactive ? 'cursor-pointer group' : ''
      }`}
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#87CEEB]/25 via-[#FF5C93]/30 to-[#F5C451]/30 blur-2xl animate-pulse-glow" />

      {/* Floating Sparkles */}
      <motion.div
        animate={{ y: [-4, 4, -4], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-2 -right-2 text-2xl filter drop-shadow-[0_0_8px_rgba(245,196,81,0.8)]"
      >
        ✨
      </motion.div>
      <motion.div
        animate={{ y: [4, -4, 4], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute -bottom-1 -left-2 text-xl filter drop-shadow-[0_0_8px_rgba(255,92,147,0.8)]"
      >
        🌟
      </motion.div>

      {/* Gift Box SVG */}
      <motion.div
        whileHover={interactive ? { scale: 1.05, rotate: [-1, 1, 0] } : {}}
        whileTap={interactive ? { scale: 0.97 } : {}}
        transition={{ type: 'spring', stiffness: 350, damping: 20 }}
        className="relative z-10 w-full h-full flex items-center justify-center"
      >
        <svg
          viewBox="0 0 240 240"
          className="w-full h-full filter drop-shadow-[0_12px_24px_rgba(215,25,63,0.22)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Box Body Gradient: Rose Pink #FF5C93 to Deep Red #D7193F */}
            <linearGradient id="boxBodyGrad" x1="40" y1="80" x2="200" y2="210" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FF5C93" />
              <stop offset="45%" stopColor="#D7193F" />
              <stop offset="100%" stopColor="#9E0C29" />
            </linearGradient>

            {/* Box Lid Gradient */}
            <linearGradient id="lidGrad" x1="30" y1="65" x2="210" y2="105" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FF7AA8" />
              <stop offset="50%" stopColor="#D7193F" />
              <stop offset="100%" stopColor="#9E0C29" />
            </linearGradient>

            {/* Gold Ribbon Gradient: Gold #F5C451 */}
            <linearGradient id="goldRibbonGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFF4C2" />
              <stop offset="35%" stopColor="#F5C451" />
              <stop offset="70%" stopColor="#E5A720" />
              <stop offset="100%" stopColor="#B87D08" />
            </linearGradient>

            {/* Gold Bow Gradient */}
            <linearGradient id="goldBowGrad" x1="80" y1="20" x2="160" y2="80" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#FDE68A" />
              <stop offset="65%" stopColor="#F5C451" />
              <stop offset="100%" stopColor="#B87D08" />
            </linearGradient>

            {/* Drop Shadow for Lid */}
            <filter id="shadowUnderLid" x="-10%" y="0%" width="120%" height="200%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#17243A" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Open Mode Fireworks / Burst */}
          {isOpen && (
            <g className="animate-pulse">
              <circle cx="120" cy="50" r="4" fill="#F5C451" opacity="0.9" />
              <circle cx="80" cy="35" r="3" fill="#FF5C93" opacity="0.8" />
              <circle cx="160" cy="40" r="3.5" fill="#87CEEB" opacity="0.8" />
              <circle cx="60" cy="70" r="2.5" fill="#EDE7FF" opacity="0.9" />
              <circle cx="180" cy="65" r="3" fill="#10B981" opacity="0.8" />
            </g>
          )}

          {/* Box Shadow on ground */}
          <ellipse cx="120" cy="216" rx="64" ry="12" fill="#17243A" opacity="0.14" />

          {/* Box Body */}
          <rect
            x="48"
            y="94"
            width="144"
            height="112"
            rx="14"
            fill="url(#boxBodyGrad)"
          />

          {/* Inner Light Reflection Line on Body */}
          <path
            d="M52 108 C 52 100, 60 98, 70 98 L 170 98"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Vertical Ribbon on Body */}
          <rect
            x="106"
            y="94"
            width="28"
            height="112"
            fill="url(#goldRibbonGrad)"
          />
          {/* Vertical Ribbon highlight */}
          <line x1="114" y1="94" x2="114" y2="206" stroke="#fffbeb" strokeWidth="1.5" strokeOpacity="0.6" />

          {/* Horizontal Ribbon on Body */}
          <rect
            x="48"
            y="140"
            width="144"
            height="22"
            fill="url(#goldRibbonGrad)"
          />
          <line x1="48" y1="147" x2="192" y2="147" stroke="#fffbeb" strokeWidth="1.5" strokeOpacity="0.5" />

          {/* Box Lid & Bow Group (with animation when open) */}
          <motion.g
            animate={
              isOpen
                ? { y: -24, rotate: -8, scale: 1.05 }
                : { y: 0, rotate: 0, scale: 1 }
            }
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            {/* Box Lid Base */}
            <rect
              x="40"
              y="68"
              width="160"
              height="30"
              rx="9"
              fill="url(#lidGrad)"
              filter="url(#shadowUnderLid)"
            />

            {/* Lid Top Sheen */}
            <path
              d="M44 73 C 44 70, 52 70, 60 70 L 180 70"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Vertical Ribbon on Lid */}
            <rect
              x="106"
              y="68"
              width="28"
              height="30"
              fill="url(#goldRibbonGrad)"
            />
            <line x1="114" y1="68" x2="114" y2="98" stroke="#fffbeb" strokeWidth="1.5" strokeOpacity="0.7" />

            {/* Golden Bow Ribbon Loops */}
            {/* Left Bow Loop */}
            <path
              d="M120 70 C 95 36, 60 40, 68 62 C 72 74, 98 72, 120 70 Z"
              fill="url(#goldBowGrad)"
              stroke="#ca8a04"
              strokeWidth="1.2"
            />
            <path
              d="M74 58 C 85 46, 105 52, 114 66"
              stroke="#fffbeb"
              strokeWidth="1.5"
              strokeOpacity="0.6"
              fill="none"
            />

            {/* Right Bow Loop */}
            <path
              d="M120 70 C 145 36, 180 40, 172 62 C 168 74, 142 72, 120 70 Z"
              fill="url(#goldBowGrad)"
              stroke="#ca8a04"
              strokeWidth="1.2"
            />
            <path
              d="M166 58 C 155 46, 135 52, 126 66"
              stroke="#fffbeb"
              strokeWidth="1.5"
              strokeOpacity="0.6"
              fill="none"
            />

            {/* Center Knot */}
            <ellipse
              cx="120"
              cy="70"
              rx="12"
              ry="9"
              fill="url(#goldBowGrad)"
              stroke="#a16207"
              strokeWidth="1.5"
            />
            <ellipse
              cx="119"
              cy="68"
              rx="4"
              ry="2.5"
              fill="#ffffff"
              fillOpacity="0.6"
            />

            {/* Hanging Ribbon Tails */}
            <path
              d="M112 76 C 104 90, 88 98, 80 106 L 90 108 C 98 98, 112 88, 116 76 Z"
              fill="url(#goldRibbonGrad)"
            />
            <path
              d="M128 76 C 136 90, 152 98, 160 106 L 150 108 C 142 98, 128 88, 124 76 Z"
              fill="url(#goldRibbonGrad)"
            />
          </motion.g>

          {/* Star Sparkle on Ribbon */}
          <polygon
            points="120,62 122,67 127,67 123,70 125,75 120,72 115,75 117,70 113,67 118,67"
            fill="#ffffff"
            className="animate-ping"
            style={{ transformOrigin: '120px 68px', animationDuration: '3s' }}
          />
        </svg>
      </motion.div>
    </div>
  );
};
