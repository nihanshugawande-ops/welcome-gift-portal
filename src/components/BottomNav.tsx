import React from 'react';
import { Home, Sparkles, Flame, Palette, Gamepad2 } from 'lucide-react';
import { MainSection } from '../types';

interface BottomNavProps {
  activeSection: MainSection;
  onSelectSection: (section: MainSection) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeSection,
  onSelectSection,
}) => {
  const primaryTabs: Array<{
    id: MainSection;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
  }> = [
    { id: 'home', label: 'Home', icon: Home, accentColor: '#FF5C93' },
    { id: 'spirituality', label: 'Spirituality', icon: Sparkles, accentColor: '#F59E0B' },
    { id: 'navratri', label: 'Navratri', icon: Flame, accentColor: '#D7193F' },
    { id: 'ai-art', label: 'Gallery', icon: Palette, accentColor: '#A855F7' },
    { id: 'fun-zone', label: 'Fun Zone', icon: Gamepad2, accentColor: '#10B981' },
  ];

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 pointer-events-none flex justify-center px-0 sm:px-4 sm:pb-3"
      aria-label="Primary Portal Navigation"
    >
      <div className="pointer-events-auto w-full sm:max-w-xl bg-white/95 sm:bg-[#FFFDF9]/95 backdrop-blur-xl border-t sm:border border-[#ECC86A]/60 sm:rounded-3xl shadow-xl shadow-amber-950/10 px-2 py-1.5 sm:px-4 sm:py-2">
        <div className="grid grid-cols-5 gap-1 items-center">
          {primaryTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onSelectSection(tab.id)}
                className={`flex flex-col items-center justify-center py-1 sm:py-1.5 px-1 rounded-2xl transition-all cursor-pointer relative group ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-500 hover:text-[#17243A] hover:bg-amber-50/60'
                }`}
                aria-label={tab.label}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Active Pill Background */}
                {isActive && (
                  <span
                    className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#FF5C93] via-[#D7193F] to-[#D4AF37] shadow-md shadow-pink-300/40 transform transition-transform"
                    aria-hidden="true"
                  />
                )}

                {/* Tab Icon */}
                <span className="relative z-10 flex items-center justify-center">
                  <Icon
                    className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : ''
                    }`}
                  />
                </span>

                {/* Tab Label */}
                <span
                  className={`relative z-10 text-[10px] sm:text-[11px] font-bold tracking-tight mt-0.5 truncate max-w-full ${
                    isActive ? 'text-white' : 'text-slate-600'
                  }`}
                >
                  {tab.label}
                </span>

                {/* Active Indicator Dot */}
                {isActive && (
                  <span
                    className="relative z-10 w-1 h-1 rounded-full bg-amber-200 mt-0.5 animate-pulse"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
