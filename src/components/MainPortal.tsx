import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  DEITIES,
  NAVRATRI_FORMS,
  INDIA_LANDMARKS,
  AI_ART_ITEMS,
  KNOWLEDGE_ARTICLES,
  BRAIN_TEASERS,
  GK_QUIZ,
  FRIENDSHIP_QUOTES,
  DAILY_SURPRISES,
  DeityItem,
  KnowledgeArticle,
  ArtItem,
} from '../data/portalData';
import { MainSection } from '../types';
import { BottomNav } from './BottomNav';
import { SettingsModal } from './SettingsModal';
import { DatabaseInfoModal } from './DatabaseInfoModal';
import {
  Gift,
  Home,
  Flame,
  Sparkles,
  MapPin,
  Palette,
  BookOpen,
  Gamepad2,
  Heart,
  Info,
  Menu,
  X,
  Search,
  Bookmark,
  Share2,
  Copy,
  Check,
  RotateCcw,
  Trophy,
  HelpCircle,
  Lock,
  Sun,
  ChevronRight,
  ExternalLink,
  Settings,
  MoreVertical,
} from 'lucide-react';

interface MainPortalProps {
  displayName?: string;
  registrationId?: string;
  onOpenAdmin: () => void;
  onBackToWelcome: () => void;
}

export const MainPortal: React.FC<MainPortalProps> = ({
  displayName,
  registrationId,
  onOpenAdmin,
  onBackToWelcome,
}) => {
  const [activeSection, setActiveSection] = useState<MainSection>('home');
  const [secondaryMenuOpen, setSecondaryMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDbInfoOpen, setIsDbInfoOpen] = useState(false);

  // Modals & Active state
  const [selectedDeity, setSelectedDeity] = useState<DeityItem | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);
  const [selectedArt, setSelectedArt] = useState<ArtItem | null>(null);

  // Navratri configurable year
  const currentYear = new Date().getFullYear();
  const [navratriYear, setNavratriYear] = useState(currentYear);

  // Knowledge search & filters
  const [knowledgeSearch, setKnowledgeSearch] = useState('');
  const [knowledgeCategory, setKnowledgeCategory] = useState<string>('All');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('wg_bookmarked_articles');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // AI Art Category filter
  const [artCategory, setArtCategory] = useState<string>('All');

  // Fun Zone state
  const [funSubTab, setFunSubTab] = useState<'memory' | 'quiz' | 'teasers' | 'quotes' | 'celebration'>('memory');

  // Memory Challenge Game state
  const memoryIcons = useMemo(() => ['🎁', '🪔', '🌸', '🐘', '🦚', '🌟'], []);
  const [memoryCards, setMemoryCards] = useState(() => {
    const deck = [...memoryIcons, ...memoryIcons]
      .sort(() => Math.random() - 0.5)
      .map((icon, index) => ({ id: index, icon, isFlipped: false, isMatched: false }));
    return deck;
  });
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [memoryMoves, setMemoryMoves] = useState(0);

  const resetMemoryGame = () => {
    const deck = [...memoryIcons, ...memoryIcons]
      .sort(() => Math.random() - 0.5)
      .map((icon, index) => ({ id: index, icon, isFlipped: false, isMatched: false }));
    setMemoryCards(deck);
    setFlippedIndices([]);
    setMemoryMoves(0);
  };

  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2 || memoryCards[index].isFlipped || memoryCards[index].isMatched) return;

    const newCards = [...memoryCards];
    newCards[index].isFlipped = true;
    const newFlipped = [...flippedIndices, index];
    setMemoryCards(newCards);
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMemoryMoves((m) => m + 1);
      const [first, second] = newFlipped;
      if (newCards[first].icon === newCards[second].icon) {
        newCards[first].isMatched = true;
        newCards[second].isMatched = true;
        setMemoryCards(newCards);
        setFlippedIndices([]);
      } else {
        setTimeout(() => {
          newCards[first].isFlipped = false;
          newCards[second].isFlipped = false;
          setMemoryCards([...newCards]);
          setFlippedIndices([]);
        }, 850);
      }
    }
  };

  // GK Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleQuizAnswer = (optionIdx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIdx);
    if (optionIdx === GK_QUIZ[quizIndex].correctIndex) {
      setQuizScore((s) => s + 1);
    }
  };

  const handleNextQuestion = () => {
    if (quizIndex < GK_QUIZ.length - 1) {
      setQuizIndex((i) => i + 1);
      setSelectedOption(null);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setSelectedOption(null);
    setQuizScore(0);
    setQuizFinished(false);
  };

  // Brain Teaser states
  const [revealedHints, setRevealedHints] = useState<{ [id: number]: boolean }>({});
  const [revealedAnswers, setRevealedAnswers] = useState<{ [id: number]: boolean }>({});

  // Friendship Card Generator state
  const [cardFriendName, setCardFriendName] = useState('');
  const [cardTheme, setCardTheme] = useState<'gold' | 'rose' | 'emerald' | 'sky'>('gold');
  const [cardWish, setCardWish] = useState('Wishing you boundless joy, peace, and prosperity! 💝');
  const [cardCopied, setCardCopied] = useState(false);

  // Daily surprise state
  const [dailySurpriseIndex, setDailySurpriseIndex] = useState(0);

  // Quotes copy helper
  const [copiedQuote, setCopiedQuote] = useState<string | null>(null);
  const handleCopyQuote = (q: string) => {
    navigator.clipboard.writeText(q);
    setCopiedQuote(q);
    setTimeout(() => setCopiedQuote(null), 2000);
  };

  // Bookmark toggle
  const toggleBookmark = (id: string) => {
    const updated = bookmarkedIds.includes(id)
      ? bookmarkedIds.filter((b) => b !== id)
      : [...bookmarkedIds, id];
    setBookmarkedIds(updated);
    try {
      localStorage.setItem('wg_bookmarked_articles', JSON.stringify(updated));
    } catch {
      // Storage safe
    }
  };

  // Filtered knowledge articles
  const filteredArticles = useMemo(() => {
    return KNOWLEDGE_ARTICLES.filter((item) => {
      const matchCat = knowledgeCategory === 'All' || item.category === knowledgeCategory;
      const matchSearch =
        knowledgeSearch === '' ||
        item.title.toLowerCase().includes(knowledgeSearch.toLowerCase()) ||
        item.summary.toLowerCase().includes(knowledgeSearch.toLowerCase()) ||
        item.fullContent.toLowerCase().includes(knowledgeSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [knowledgeCategory, knowledgeSearch]);

  // Filtered AI Art
  const filteredArt = useMemo(() => {
    return AI_ART_ITEMS.filter((item) => {
      return artCategory === 'All' || item.category === artCategory;
    });
  }, [artCategory]);

  // Coordinated section-specific background styling (Section 1 requirement)
  const sectionBgClass = useMemo(() => {
    switch (activeSection) {
      case 'home':
        return 'bg-gradient-to-b from-[#FFFDF9] via-[#FAF8F5] to-[#FFF5F8]';
      case 'spirituality':
        return 'bg-gradient-to-b from-[#FFFBEB] via-[#FFF7ED] to-[#FAF8F5]';
      case 'navratri':
        return 'bg-gradient-to-b from-[#FFF1F2] via-[#FFF9E6] to-[#FFE4EC]';
      case 'india':
        return 'bg-gradient-to-b from-[#F0FDFA] via-[#FFFDF9] to-[#FEF3C7]';
      case 'ai-art':
        return 'bg-gradient-to-b from-[#F3E8FF] via-[#EFF6FF] to-[#FDF2F8]';
      case 'knowledge':
        return 'bg-gradient-to-b from-[#F0F9FF] via-[#FFFFFF] to-[#E0F2FE]';
      case 'fun-zone':
        return 'bg-gradient-to-b from-[#FAF8F5] via-[#FFFDF9] to-[#F5F3FF]';
      case 'friendship':
        return 'bg-gradient-to-b from-[#FFF1F2] via-[#FFFDF9] to-[#FFF8F6]';
      case 'daily-surprise':
        return 'bg-gradient-to-b from-[#FFFBEB] via-[#FEF3C7] to-[#FFFDF9]';
      case 'about':
        return 'bg-gradient-to-b from-[#FFFDF9] via-[#FAF8F5] to-[#F5F5F4]';
      default:
        return 'bg-gradient-to-b from-[#FFFDF9] via-[#FAF8F5] to-[#FFF5F8]';
    }
  }, [activeSection]);

  return (
    <div className={`min-h-screen text-[#17243A] flex flex-col font-sans transition-colors duration-500 ${sectionBgClass}`}>
      {/* Top Header with Luxury Celebration Accents */}
      <header className="sticky top-0 z-30 bg-white/95 sm:bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#ECC86A]/50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Portal title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveSection('home')}
              className="flex items-center gap-2 group cursor-pointer text-left"
              title="Return to Home"
            >
              <span className="flex items-center justify-center w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#FF5C93] via-[#D7193F] to-[#D4AF37] text-white shadow-md shadow-pink-200 text-base group-hover:scale-105 transition-transform">
                🎁
              </span>
              <div>
                <span className="font-extrabold text-[#17243A] text-base tracking-tight block font-serif-display">
                  Welcome Gift
                </span>
                <span className="text-[10px] text-[#D7193F] font-bold block">
                  Celebration Portal
                </span>
              </div>
            </button>
          </div>

          {/* Secondary Quick Zones Switcher (Desktop & Tablet) */}
          <nav className="hidden md:flex items-center gap-1.5" aria-label="Secondary Zones">
            <button
              onClick={() => setActiveSection('india')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSection === 'india'
                  ? 'bg-teal-50 text-teal-800 border border-teal-300 shadow-2xs'
                  : 'text-slate-600 hover:text-teal-800 hover:bg-teal-50/50'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              <span>India</span>
            </button>

            <button
              onClick={() => setActiveSection('knowledge')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSection === 'knowledge'
                  ? 'bg-sky-50 text-sky-800 border border-sky-300 shadow-2xs'
                  : 'text-slate-600 hover:text-sky-800 hover:bg-sky-50/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-600" />
              <span>Knowledge</span>
            </button>

            <button
              onClick={() => setActiveSection('friendship')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSection === 'friendship'
                  ? 'bg-rose-50 text-[#D7193F] border border-pink-300 shadow-2xs'
                  : 'text-slate-600 hover:text-[#D7193F] hover:bg-rose-50/50'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-[#FF5C93]" />
              <span>Friendship</span>
            </button>

            <button
              onClick={() => setActiveSection('daily-surprise')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSection === 'daily-surprise'
                  ? 'bg-amber-50 text-amber-900 border border-amber-300 shadow-2xs'
                  : 'text-slate-600 hover:text-amber-900 hover:bg-amber-50/50'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-600" />
              <span>Surprise</span>
            </button>
          </nav>

          {/* Right Header Controls: Settings & Admin & Secondary Menu */}
          <div className="flex items-center gap-2">
            {/* Settings Button (Requirement 3: Opens Settings containing full Terms & Conditions) */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#17243A] hover:text-[#D7193F] bg-white hover:bg-amber-50/50 border border-[#ECC86A]/70 shadow-2xs transition-colors cursor-pointer"
              title="Portal Settings & Terms"
            >
              <Settings className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden sm:inline">Settings</span>
            </button>

            {/* Admin Portal Button */}
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#17243A] hover:text-[#D7193F] bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs transition-colors cursor-pointer"
              title="Admin Portal"
            >
              <Lock className="w-3.5 h-3.5 text-[#FF5C93]" />
              <span className="hidden sm:inline">Admin</span>
            </button>

            {/* Secondary Options Toggle (Three-dot menu with ONLY secondary options, NO main section list) */}
            <button
              onClick={() => setSecondaryMenuOpen(!secondaryMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:text-[#17243A] bg-white border border-slate-200 shadow-2xs cursor-pointer"
              aria-label="Toggle secondary menu"
            >
              {secondaryMenuOpen ? <X className="w-5 h-5" /> : <MoreVertical className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Secondary Menu Dropdown: Contains ONLY secondary options (Settings, Terms, About, More Zones, Admin) */}
        <AnimatePresence>
          {secondaryMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-b border-amber-100 bg-[#FFFDF9]/98 backdrop-blur-xl px-4 py-3 space-y-3 overflow-hidden shadow-xl"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Secondary Exploration Zones
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setActiveSection('india');
                      setSecondaryMenuOpen(false);
                    }}
                    className="flex items-center gap-2 p-2 rounded-xl text-xs font-bold bg-teal-50 text-teal-900 border border-teal-200 cursor-pointer text-left"
                  >
                    <MapPin className="w-4 h-4 text-teal-600" />
                    <span>Beautiful India</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveSection('knowledge');
                      setSecondaryMenuOpen(false);
                    }}
                    className="flex items-center gap-2 p-2 rounded-xl text-xs font-bold bg-sky-50 text-sky-900 border border-sky-200 cursor-pointer text-left"
                  >
                    <BookOpen className="w-4 h-4 text-sky-600" />
                    <span>Knowledge Corner</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveSection('friendship');
                      setSecondaryMenuOpen(false);
                    }}
                    className="flex items-center gap-2 p-2 rounded-xl text-xs font-bold bg-pink-50 text-pink-900 border border-pink-200 cursor-pointer text-left"
                  >
                    <Heart className="w-4 h-4 text-[#FF5C93]" />
                    <span>Friendship Zone</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveSection('daily-surprise');
                      setSecondaryMenuOpen(false);
                    }}
                    className="flex items-center gap-2 p-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 cursor-pointer text-left"
                  >
                    <Sun className="w-4 h-4 text-amber-600" />
                    <span>Daily Surprise</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-amber-100/70 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setSecondaryMenuOpen(false);
                    setIsSettingsOpen(true);
                  }}
                  className="flex items-center justify-between p-2 rounded-xl text-xs font-bold bg-white text-[#17243A] border border-amber-200 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-[#D4AF37]" />
                    <span>Settings &amp; Terms &amp; Conditions</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Code: {registrationId || 'WG-FRIEND'}</span>
                  <button
                    onClick={() => {
                      setSecondaryMenuOpen(false);
                      onBackToWelcome();
                    }}
                    className="text-[#D7193F] hover:underline font-bold"
                  >
                    Return to Welcome
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content Area (pb-28 ensures bottom navigation bar never covers content) */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 pt-6 pb-28 sm:pb-32">
        {/* ============================================================== */}
        {/* 1. HOME SECTION                                                */}
        {/* ============================================================== */}
        {activeSection === 'home' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Hero Welcome Banner (Ivory white, Champagne Gold & Rose Pink) */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#FFFDF9] via-[#FAF8F5] to-[#FFF5F8] border-2 border-[#ECC86A]/70 p-6 sm:p-10 shadow-xl">
              <div className="relative z-10 max-w-2xl">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/95 border border-[#ECC86A]/80 text-[#D7193F] text-xs font-bold mb-4 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Welcome Gift Portal Unlocked</span>
                </span>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#17243A] tracking-tight font-serif-display">
                  Welcome to Your Special Gift, {displayName ? displayName : 'Friend'}! 💝
                </h1>

                <p className="text-sm sm:text-base text-slate-700 mt-3 leading-relaxed font-medium">
                  Thank you for registering. We have curated a magnificent celebration of sacred spirituality,
                  Navratri devotion, Indian heritage, visionary AI art, enlightening knowledge, and cheerful interactive games.
                </p>

                {registrationId && (
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/95 border border-[#ECC86A]/60 text-xs text-slate-700 font-medium shadow-2xs">
                    <span className="text-slate-500">Your Registration Code:</span>
                    <span className="font-mono font-bold text-[#D7193F]">{registrationId}</span>
                  </div>
                )}
              </div>

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-rose-200/25 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 right-8 text-8xl opacity-15 select-none pointer-events-none hidden sm:block">
                🎁
              </div>
            </div>

            {/* Feature Exploration Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-extrabold text-[#17243A]">Explore Your Gift Sections</h2>
                <span className="text-xs text-slate-500 font-semibold">9 Dedicated Zones</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[
                  {
                    id: 'spirituality' as MainSection,
                    title: 'God & Spirituality',
                    desc: 'Darshan of Lord Ganesha, Shiva, Krishna, Rama, Durga, Lakshmi & Hanuman with sacred mantras.',
                    emoji: '🕉️',
                    bg: 'bg-white border-amber-200 hover:border-amber-400',
                    tag: 'Sacred Mantras',
                    tagColor: 'bg-amber-50 text-amber-900 border-amber-200',
                  },
                  {
                    id: 'navratri' as MainSection,
                    title: 'Navratri Special',
                    desc: 'Nine divine forms of Goddess Durga (Navadurga), daily sacred colors, and festival greetings.',
                    emoji: '🪔',
                    bg: 'bg-white border-rose-200 hover:border-rose-400',
                    tag: 'Navadurga',
                    tagColor: 'bg-rose-50 text-rose-900 border-rose-200',
                  },
                  {
                    id: 'india' as MainSection,
                    title: 'Beautiful India',
                    desc: 'Taj Mahal, Varanasi Ghats, Kashmir, Kedarnath, and magnificent historical landmarks.',
                    emoji: '🇮🇳',
                    bg: 'bg-white border-teal-200 hover:border-teal-400',
                    tag: 'Heritage Marvels',
                    tagColor: 'bg-teal-50 text-teal-900 border-teal-200',
                  },
                  {
                    id: 'ai-art' as MainSection,
                    title: 'AI Art Gallery',
                    desc: 'High-concept creative artwork spanning Fantasy Worlds, Cosmic Galaxies & Solarpunk.',
                    emoji: '🎨',
                    bg: 'bg-white border-purple-200 hover:border-purple-400',
                    tag: 'Visual Prompts',
                    tagColor: 'bg-purple-50 text-purple-900 border-purple-200',
                  },
                  {
                    id: 'knowledge' as MainSection,
                    title: 'Knowledge Corner',
                    desc: 'Chandrayaan-3, ancient Indian science, neural networks, and inspiring life stories.',
                    emoji: '📖',
                    bg: 'bg-white border-sky-200 hover:border-sky-400',
                    tag: 'Science & History',
                    tagColor: 'bg-sky-50 text-sky-900 border-sky-200',
                  },
                  {
                    id: 'fun-zone' as MainSection,
                    title: 'Fun Zone',
                    desc: 'Memory challenge matching game, GK quiz with scores, brain teasers, and surprises.',
                    emoji: '🎮',
                    bg: 'bg-white border-pink-200 hover:border-pink-400',
                    tag: 'Games & Puzzles',
                    tagColor: 'bg-pink-50 text-pink-900 border-pink-200',
                  },
                  {
                    id: 'friendship' as MainSection,
                    title: 'Friendship Zone',
                    desc: 'Heartfelt wishes, positive quotes, and customizable greeting card creator.',
                    emoji: '💝',
                    bg: 'bg-white border-rose-200 hover:border-rose-400',
                    tag: 'Greeting Cards',
                    tagColor: 'bg-rose-50 text-rose-900 border-rose-200',
                  },
                  {
                    id: 'daily-surprise' as MainSection,
                    title: 'Daily Surprise',
                    desc: 'Discover uplifting daily thoughts, fascinating archaeological facts, and reflections.',
                    emoji: '✨',
                    bg: 'bg-white border-amber-200 hover:border-amber-400',
                    tag: 'Daily Joy',
                    tagColor: 'bg-amber-50 text-amber-900 border-amber-200',
                  },
                  {
                    id: 'about' as MainSection,
                    title: 'About This Gift',
                    desc: 'Our pledge of authentic transparency, server-side data security, and registration rights.',
                    emoji: '🛡️',
                    bg: 'bg-white border-slate-200 hover:border-slate-400',
                    tag: 'Privacy Notice',
                    tagColor: 'bg-slate-50 text-slate-800 border-slate-200',
                  },
                ].map((card) => (
                  <button
                    key={card.id}
                    onClick={() => setActiveSection(card.id)}
                    className={`group relative p-6 rounded-3xl ${card.bg} border text-left transition-all hover:scale-[1.02] cursor-pointer shadow-md hover:shadow-xl flex flex-col justify-between`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-3xl">{card.emoji}</span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${card.tagColor}`}>
                          {card.tag}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-[#17243A] text-lg group-hover:text-[#D7193F] transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                        {card.desc}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#FF5C93] group-hover:text-[#D7193F]">
                      <span>Open Zone</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Wisdom Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-50 via-white to-pink-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🕊️</span>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                    Thought for the Day
                  </span>
                  <p className="text-sm font-semibold text-[#17243A] mt-1 italic">
                    "True joy lies in the celebration of life, sincere friendship, and selfless kindness towards all living beings."
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveSection('daily-surprise')}
                className="px-4 py-2 rounded-xl bg-[#F5C451] hover:bg-amber-400 text-[#17243A] font-bold text-xs shrink-0 transition-colors cursor-pointer shadow-xs"
              >
                Discover Daily Surprise ✨
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 2. GOD & SPIRITUALITY SECTION                                  */}
        {/* ============================================================== */}
        {activeSection === 'spirituality' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center max-w-2xl mx-auto mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold mb-2">
                🕉️ Sacred Darshan &amp; Wisdom
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17243A] font-serif-display">
                God &amp; Spirituality Gallery
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                Revered sacred deities embodying divine compassion, cosmic wisdom, and supreme righteousness.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {DEITIES.map((deity) => (
                <div
                  key={deity.id}
                  className="bg-white border border-sky-100 rounded-3xl overflow-hidden shadow-lg hover:border-amber-300 transition-all flex flex-col justify-between group"
                >
                  <div className="relative h-56 overflow-hidden bg-slate-100">
                    <img
                      src={deity.image}
                      alt={deity.name}
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md border border-amber-200 text-[11px] font-mono font-bold text-amber-900">
                      🕉️ Sacred
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="text-lg font-bold">{deity.name}</h3>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs text-[#D7193F] font-bold">{deity.title}</p>

                      <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 font-mono text-xs text-amber-900 font-medium">
                        {deity.mantra}
                      </div>

                      <p className="text-xs text-slate-600 mt-3 leading-relaxed font-medium">
                        {deity.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <div className="flex items-start gap-2 text-[11px] text-slate-600">
                        <span className="text-amber-700 font-bold shrink-0">Devotional Fact:</span>
                        <span className="italic leading-snug">{deity.devotionalFact}</span>
                      </div>

                      <button
                        onClick={() => setSelectedDeity(deity)}
                        className="w-full mt-3 py-2 px-3 rounded-xl bg-[#EAF7FF] hover:bg-sky-100 text-[#17243A] text-xs font-bold transition-colors cursor-pointer text-center"
                      >
                        Read Full Significance &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 3. NAVRATRI SPECIAL SECTION                                    */}
        {/* ============================================================== */}
        {activeSection === 'navratri' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Navratri Festival Header (Red, Pink, Gold, Warm Festive Gradients) */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#FFF0F5] via-[#FFF9E6] to-[#FFE8EC] border-2 border-[#FF5C93]/40 p-6 sm:p-10 shadow-xl">
              <div className="max-w-2xl relative z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-pink-200 text-[#D7193F] text-xs font-bold mb-3 shadow-2xs">
                  🪔 Shubh Navratri Mahotsav
                </span>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17243A] tracking-tight font-serif-display">
                  Navratri Special: The Nine Forms of Maa Durga
                </h2>

                <p className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed font-medium">
                  Celebrate the nine divine nights honoring the primordial cosmic energy (Shakti).
                  Explore the sacred forms, colors, weapons, and mantras of Navadurga.
                </p>

                {/* Configurable Year Selector */}
                <div className="mt-5 flex items-center gap-3">
                  <span className="text-xs font-bold text-amber-900">Festival Year:</span>
                  <div className="flex items-center gap-1.5">
                    {[currentYear, currentYear + 1, currentYear + 2].map((yr) => (
                      <button
                        key={yr}
                        onClick={() => setNavratriYear(yr)}
                        className={`px-3.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          navratriYear === yr
                            ? 'bg-gradient-to-r from-[#FF5C93] to-[#D7193F] text-white shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:border-pink-300'
                        }`}
                      >
                        {yr}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Nine Durgas Grid */}
            <div>
              <h3 className="text-xl font-bold text-[#17243A] mb-4">Navadurga: Nine Sacred Forms</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {NAVRATRI_FORMS.map((form) => (
                  <div
                    key={form.day}
                    className="p-5 rounded-3xl bg-white border border-sky-100 shadow-md relative overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all"
                  >
                    {/* Top color bar */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1.5"
                      style={{ backgroundColor: form.colorHex }}
                    />

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-[#D7193F] font-mono">
                          Day {form.day} of Navratri
                        </span>
                        <span
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-2xs"
                          style={{
                            backgroundColor: `${form.colorHex}25`,
                            color: '#17243A',
                            border: `1px solid ${form.colorHex}`,
                          }}
                        >
                          {form.color}
                        </span>
                      </div>

                      <h4 className="text-lg font-bold text-[#17243A]">{form.name}</h4>
                      <p className="text-xs text-[#FF5C93] font-bold">{form.formName}</p>

                      <p className="text-xs text-slate-600 mt-2.5 leading-relaxed font-medium">
                        {form.description}
                      </p>

                      <div className="mt-3 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-[11px] font-mono text-amber-900 leading-snug">
                        {form.mantra}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-600 space-y-1 font-medium">
                      <div>
                        <strong className="text-[#17243A]">Mount:</strong> {form.mount}
                      </div>
                      <div>
                        <strong className="text-[#17243A]">Weapons/Attributes:</strong> {form.weapon}
                      </div>
                      <div>
                        <strong className="text-[#17243A]">Spiritual Grace:</strong> {form.significance}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 4. BEAUTIFUL INDIA SECTION                                     */}
        {/* ============================================================== */}
        {activeSection === 'india' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center max-w-2xl mx-auto mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold mb-2">
                🇮🇳 Incredible Heritage &amp; Landscapes
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17243A] font-serif-display">
                Beautiful India Gallery
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                From high Himalayan shrines to marble wonders and coastal backwaters, explore iconic Indian heritage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {INDIA_LANDMARKS.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-sky-100 rounded-3xl overflow-hidden shadow-md flex flex-col justify-between group hover:border-teal-300 transition-all hover:shadow-xl"
                >
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-white">
                      <span className="flex items-center gap-1 font-bold">
                        <MapPin className="w-3.5 h-3.5 text-amber-300" />
                        {item.location}, {item.state}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                        {item.category}
                      </span>
                      <h4 className="font-bold text-[#17243A] text-base mt-1.5">{item.name}</h4>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                      <div>
                        <strong className="text-[#17243A]">Best Time:</strong> {item.bestTimeToVisit}
                      </div>
                      <div className="text-[10px] truncate" title={item.attribution}>
                        Source: {item.attribution}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 5. AI ART GALLERY SECTION                                      */}
        {/* ============================================================== */}
        {activeSection === 'ai-art' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center max-w-2xl mx-auto mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-900 text-xs font-bold mb-2">
                🎨 Creative Concept Gallery
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17243A] font-serif-display">
                AI Art Gallery
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                Visualizing futuristic architectures, cosmic vistas, fantasy worlds, and digital harmony.
              </p>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center justify-center flex-wrap gap-2 pb-2">
              {[
                'All',
                'Fantasy Worlds',
                'Space and Galaxies',
                'Futuristic Cities',
                'Nature',
                'Digital Art',
                'Festival Art',
                'Beautiful Landscapes',
              ].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setArtCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    artCategory === cat
                      ? 'bg-gradient-to-r from-[#FF5C93] to-purple-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:text-[#17243A] border border-sky-100 hover:border-purple-200 shadow-2xs'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Art Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArt.map((art) => (
                <div
                  key={art.id}
                  onClick={() => setSelectedArt(art)}
                  className="bg-white border border-sky-100 rounded-3xl overflow-hidden shadow-md cursor-pointer group hover:border-purple-300 transition-all flex flex-col justify-between hover:shadow-xl"
                >
                  <div className="relative h-60 bg-slate-100 overflow-hidden">
                    <img
                      src={art.image}
                      alt={art.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-md text-purple-900 border border-purple-200 shadow-xs">
                      {art.category}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-[#17243A] text-base group-hover:text-[#D7193F] transition-colors">
                        {art.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                        {art.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {art.colorPalette.map((col, idx) => (
                          <span
                            key={idx}
                            className="w-4 h-4 rounded-full border border-slate-300 shadow-xs"
                            style={{ backgroundColor: col }}
                            title={col}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-[#FF5C93] font-bold group-hover:underline">
                        View Prompt &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 6. KNOWLEDGE CORNER SECTION                                   */}
        {/* ============================================================== */}
        {activeSection === 'knowledge' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center max-w-2xl mx-auto mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-900 text-xs font-bold mb-2">
                📖 Science, History &amp; Innovation
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17243A] font-serif-display">
                Knowledge Corner
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                Deep dives into space discoveries, ancient mathematical genius, and modern technologies.
              </p>
            </div>

            {/* Search & Filter Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white border border-sky-100 p-3.5 rounded-2xl shadow-sm">
              <div className="flex items-center px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus-within:border-sky-400 focus-within:bg-white flex-1 transition-all">
                <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search science, Chandrayaan, history, AI..."
                  value={knowledgeSearch}
                  onChange={(e) => setKnowledgeSearch(e.target.value)}
                  className="w-full bg-transparent text-sm text-[#17243A] placeholder-slate-400 focus:outline-none font-medium"
                />
                {knowledgeSearch && (
                  <button
                    onClick={() => setKnowledgeSearch('')}
                    className="text-xs text-slate-500 hover:text-[#17243A]"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Category Selector */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {['All', 'Space', 'Science', 'Indian History', 'AI & Innovation', 'Inspirational Stories'].map(
                  (cat) => (
                    <button
                      key={cat}
                      onClick={() => setKnowledgeCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 cursor-pointer transition-colors ${
                        knowledgeCategory === cat
                          ? 'bg-[#17243A] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredArticles.map((article) => {
                const isBookmarked = bookmarkedIds.includes(article.id);
                return (
                  <div
                    key={article.id}
                    className="p-6 rounded-3xl bg-white border border-sky-100 hover:border-sky-300 transition-all shadow-md flex flex-col justify-between hover:shadow-xl"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                          {article.category}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-500 font-semibold">{article.readTime}</span>
                          <button
                            onClick={() => toggleBookmark(article.id)}
                            className="p-1 text-slate-400 hover:text-amber-500 cursor-pointer"
                            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Article'}
                          >
                            <Bookmark
                              className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-500' : ''}`}
                            />
                          </button>
                        </div>
                      </div>

                      <h4 className="font-bold text-[#17243A] text-base mt-2 hover:text-[#D7193F] transition-colors">
                        {article.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                        {article.summary}
                      </p>

                      <div className="mt-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-medium">
                        <strong className="text-amber-800">Key Fact:</strong> {article.keyFact}
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100">
                      <button
                        onClick={() => setSelectedArticle(article)}
                        className="w-full py-2.5 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-[#17243A] border border-sky-200 text-xs font-bold transition-colors cursor-pointer text-center"
                      >
                        Read Full Article &rarr;
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 7. FUN ZONE SECTION                                            */}
        {/* ============================================================== */}
        {activeSection === 'fun-zone' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center max-w-2xl mx-auto mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-[#D7193F] text-xs font-bold mb-2">
                🎮 Interactive Mini-Games
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17243A] font-serif-display">
                Fun Zone
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                Challenge your memory, test your global knowledge, and crack brain teasers.
              </p>
            </div>

            {/* Sub-tabs */}
            <div className="flex items-center justify-center flex-wrap gap-2">
              {[
                { id: 'memory', label: 'Memory Challenge 🃏' },
                { id: 'quiz', label: 'GK Quiz 🏆' },
                { id: 'teasers', label: 'Brain Teasers 🧩' },
                { id: 'quotes', label: 'Friendship Quotes 💬' },
                { id: 'celebration', label: 'Celebration Confetti 🎉' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFunSubTab(tab.id as any)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    funSubTab === tab.id
                      ? 'bg-gradient-to-r from-[#FF5C93] to-[#D7193F] text-white shadow-md shadow-pink-200'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border border-sky-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* A. Memory Challenge */}
            {funSubTab === 'memory' && (
              <div className="max-w-md mx-auto bg-white border border-sky-100 rounded-3xl p-6 shadow-xl text-center">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-[#17243A] text-base">Festive Memory Match</h3>
                    <p className="text-xs text-slate-500 font-medium">Match all 6 pairs of cards</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-sky-50 font-mono text-xs font-bold text-sky-800 border border-sky-200">
                      Moves: {memoryMoves}
                    </span>
                    <button
                      onClick={resetMemoryGame}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                      title="Restart Game"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2.5 my-4">
                  {memoryCards.map((card, idx) => (
                    <button
                      key={card.id}
                      onClick={() => handleCardClick(idx)}
                      className={`h-20 sm:h-24 rounded-2xl text-3xl flex items-center justify-center transition-all duration-300 select-none cursor-pointer border ${
                        card.isFlipped || card.isMatched
                          ? 'bg-rose-50 border-pink-300 shadow-xs'
                          : 'bg-gradient-to-br from-white to-sky-50 border-sky-200 hover:border-pink-300 shadow-2xs'
                      }`}
                    >
                      {card.isFlipped || card.isMatched ? card.icon : '🎁'}
                    </button>
                  ))}
                </div>

                {memoryCards.every((c) => c.isMatched) && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold"
                  >
                    🎉 Congratulations! You completed the challenge in {memoryMoves} moves!
                  </motion.div>
                )}
              </div>
            )}

            {/* B. GK Quiz */}
            {funSubTab === 'quiz' && (
              <div className="max-w-md mx-auto bg-white border border-sky-100 rounded-3xl p-6 shadow-xl">
                {!quizFinished ? (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-bold text-slate-500">
                        Question {quizIndex + 1} of {GK_QUIZ.length}
                      </span>
                      <span className="text-xs font-bold text-[#D7193F] bg-rose-50 px-2 py-0.5 rounded-full border border-pink-200">
                        Score: {quizScore}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-[#17243A] mb-4">
                      {GK_QUIZ[quizIndex].question}
                    </h4>

                    <div className="space-y-2 mb-4">
                      {GK_QUIZ[quizIndex].options.map((option, idx) => {
                        let btnStyle = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-sky-50';
                        if (selectedOption !== null) {
                          if (idx === GK_QUIZ[quizIndex].correctIndex) {
                            btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-800 font-bold';
                          } else if (idx === selectedOption) {
                            btnStyle = 'bg-rose-50 border-rose-400 text-[#D7193F] font-bold';
                          }
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => handleQuizAnswer(idx)}
                            className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${btnStyle}`}
                          >
                            <span>{option}</span>
                            {selectedOption !== null && idx === GK_QUIZ[quizIndex].correctIndex && (
                              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {selectedOption !== null && (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 mb-4 font-medium">
                        <strong className="text-[#17243A]">Explanation:</strong>{' '}
                        {GK_QUIZ[quizIndex].explanation}
                      </div>
                    )}

                    {selectedOption !== null && (
                      <button
                        onClick={handleNextQuestion}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF5C93] to-[#D7193F] text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                      >
                        {quizIndex < GK_QUIZ.length - 1 ? 'Next Question &rarr;' : 'See Final Score 🏆'}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4 space-y-4">
                    <Trophy className="w-12 h-12 text-[#F5C451] mx-auto" />
                    <h3 className="text-xl font-bold text-[#17243A]">Quiz Completed!</h3>
                    <p className="text-sm text-slate-600 font-medium">
                      You scored <strong className="text-[#D7193F]">{quizScore}</strong> out of{' '}
                      <strong>{GK_QUIZ.length}</strong>!
                    </p>
                    <button
                      onClick={resetQuiz}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF5C93] to-[#D7193F] text-white text-xs font-bold transition-all cursor-pointer shadow-md"
                    >
                      Retry Quiz
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* C. Brain Teasers */}
            {funSubTab === 'teasers' && (
              <div className="max-w-2xl mx-auto space-y-4">
                {BRAIN_TEASERS.map((teaser) => (
                  <div
                    key={teaser.id}
                    className="p-5 rounded-3xl bg-white border border-sky-100 shadow-md space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-[#FF5C93]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-[#D7193F] font-mono">
                        Riddle #{teaser.id}
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-[#17243A] leading-relaxed">
                      "{teaser.question}"
                    </p>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() =>
                          setRevealedHints((prev) => ({ ...prev, [teaser.id]: !prev[teaser.id] }))
                        }
                        className="px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold cursor-pointer"
                      >
                        {revealedHints[teaser.id] ? 'Hide Hint' : '💡 Show Hint'}
                      </button>

                      <button
                        onClick={() =>
                          setRevealedAnswers((prev) => ({ ...prev, [teaser.id]: !prev[teaser.id] }))
                        }
                        className="px-3 py-1.5 rounded-lg bg-pink-50 hover:bg-pink-100 text-[#D7193F] border border-pink-200 text-xs font-bold cursor-pointer"
                      >
                        {revealedAnswers[teaser.id] ? 'Hide Answer' : 'Reveal Answer 🔑'}
                      </button>
                    </div>

                    {revealedHints[teaser.id] && (
                      <p className="p-2.5 rounded-xl bg-amber-50 text-xs text-amber-900 italic border border-amber-200">
                        Hint: {teaser.hint}
                      </p>
                    )}

                    {revealedAnswers[teaser.id] && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1 font-medium">
                        <div>
                          <strong>Answer:</strong> {teaser.answer}
                        </div>
                        <p className="text-[11px] text-slate-600">{teaser.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* D. Friendship Quotes */}
            {funSubTab === 'quotes' && (
              <div className="max-w-2xl mx-auto space-y-3">
                {FRIENDSHIP_QUOTES.map((quote, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white border border-sky-100 shadow-xs flex items-center justify-between gap-4"
                  >
                    <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed font-medium">
                      {quote}
                    </p>
                    <button
                      onClick={() => handleCopyQuote(quote)}
                      className="p-2 rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-600 shrink-0 cursor-pointer border border-slate-200"
                      title="Copy quote"
                    >
                      {copiedQuote === quote ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* E. Celebration */}
            {funSubTab === 'celebration' && (
              <div className="max-w-md mx-auto bg-white border border-pink-200 rounded-3xl p-8 shadow-xl text-center space-y-4">
                <span className="text-5xl block animate-bounce">🎉</span>
                <h3 className="text-xl font-bold text-[#17243A]">Celebration Moments!</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Rejoice in friendship, life's sweet blessings, and auspicious new beginnings!
                </p>
                <button
                  onClick={() => setActiveSection('friendship')}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FF5C93] via-[#D7193F] to-[#F5C451] text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  Create a Greeting Card 💝
                </button>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* 8. FRIENDSHIP ZONE SECTION                                     */}
        {/* ============================================================== */}
        {activeSection === 'friendship' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center max-w-2xl mx-auto mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-[#D7193F] text-xs font-bold mb-2">
                💝 Bonds of Friendship
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17243A] font-serif-display">
                Friendship Zone &amp; Card Creator
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                Generate a personalized, shareable friendship greeting card for someone special in your life.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Card Configuration Controls */}
              <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-xl space-y-4">
                <h3 className="font-bold text-[#17243A] text-base">Customize Your Greeting Card</h3>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Friend's Name
                  </label>
                  <input
                    type="text"
                    value={cardFriendName}
                    onChange={(e) => setCardFriendName(e.target.value)}
                    placeholder="Enter friend's name (e.g. Rahul)"
                    maxLength={40}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-[#17243A] focus:outline-none focus:border-[#FF5C93] font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Select Card Theme
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'gold', label: 'Golden Joy', bg: 'bg-amber-100 text-amber-900 border-amber-300' },
                      { id: 'rose', label: 'Velvet Rose', bg: 'bg-pink-100 text-pink-900 border-pink-300' },
                      { id: 'emerald', label: 'Spring Green', bg: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
                      { id: 'sky', label: 'Sky Blossom', bg: 'bg-sky-100 text-sky-900 border-sky-300' },
                    ].map((th) => (
                      <button
                        key={th.id}
                        onClick={() => setCardTheme(th.id as any)}
                        className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          cardTheme === th.id
                            ? `${th.bg} shadow-xs`
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        {th.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Card Message
                  </label>
                  <textarea
                    rows={3}
                    value={cardWish}
                    onChange={(e) => setCardWish(e.target.value)}
                    maxLength={150}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#17243A] focus:outline-none focus:border-[#FF5C93] font-medium"
                  />
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => {
                      const shareText = `Dear ${
                        cardFriendName || 'Friend'
                      },\n\n${cardWish}\n\n— Sent with warmth from the Welcome Gift Portal 🎁`;
                      navigator.clipboard.writeText(shareText);
                      setCardCopied(true);
                      setTimeout(() => setCardCopied(false), 2000);
                    }}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#FF5C93] to-[#D7193F] text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 shadow-rose-200"
                  >
                    {cardCopied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-200" />
                        <span>Greeting Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4" />
                        <span>Copy Shareable Text</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Card Live Preview */}
              <div
                className={`p-8 rounded-3xl shadow-xl border flex flex-col justify-between min-h-[300px] relative overflow-hidden ${
                  cardTheme === 'gold'
                    ? 'bg-gradient-to-br from-[#FFF9E6] via-white to-[#FFF0D4] border-amber-300'
                    : cardTheme === 'rose'
                    ? 'bg-gradient-to-br from-[#FFF0F5] via-white to-[#FFE4EC] border-pink-300'
                    : cardTheme === 'emerald'
                    ? 'bg-gradient-to-br from-[#EDFAF5] via-white to-[#D9F5EA] border-emerald-300'
                    : 'bg-gradient-to-br from-[#EAF7FF] via-white to-[#D8EFFF] border-sky-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">💝</span>
                  <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-[#D7193F]">
                    Welcome Gift Special
                  </span>
                </div>

                <div className="my-6">
                  <h4 className="text-2xl font-extrabold text-[#17243A] font-serif-display">
                    Dear {cardFriendName || 'Friend'},
                  </h4>
                  <p className="text-sm text-slate-700 mt-3 leading-relaxed italic font-medium">
                    "{cardWish}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 font-semibold">
                  <span>Forever Grateful for Your Friendship</span>
                  <span className="font-mono text-xs text-[#F5C451]">★ ★ ★</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 9. DAILY SURPRISE SECTION (Dedicated Section - Section 9 req)  */}
        {/* ============================================================== */}
        {activeSection === 'daily-surprise' && (
          <div className="max-w-xl mx-auto space-y-6 animate-fadeIn text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold mb-2">
              ✨ Daily Sparkle of Inspiration
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17243A] font-serif-display">
              Daily Surprise
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              A daily dose of uplifting thoughts, archaeological facts, and heartwarming reminders.
            </p>

            <div className="bg-white border border-amber-200 rounded-3xl p-8 shadow-xl space-y-4">
              <span className="text-5xl block animate-spin" style={{ animationDuration: '10s' }}>
                🌟
              </span>
              <h3 className="text-xl font-extrabold text-[#17243A]">
                {DAILY_SURPRISES[dailySurpriseIndex].title}
              </h3>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed italic p-5 rounded-2xl bg-amber-50/60 border border-amber-200 font-medium">
                "{DAILY_SURPRISES[dailySurpriseIndex].content}"
              </p>
              <span className="text-xs text-[#D7193F] font-bold block">
                — {DAILY_SURPRISES[dailySurpriseIndex].author}
              </span>

              <button
                onClick={() =>
                  setDailySurpriseIndex((prev) => (prev + 1) % DAILY_SURPRISES.length)
                }
                className="mt-4 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FF5C93] via-[#D7193F] to-[#F5C451] text-white font-bold text-xs shadow-md cursor-pointer hover:shadow-lg transition-all"
              >
                Discover Another Thought ✨
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 10. ABOUT THIS GIFT SECTION                                    */}
        {/* ============================================================== */}
        {activeSection === 'about' && (
          <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold mb-2">
                🛡️ Transparency &amp; Security
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17243A] font-serif-display">
                About the Welcome Gift Portal
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                Authentic, respectful, and safe registration built with durable persistence.
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm space-y-2">
                <h3 className="font-bold text-[#17243A] text-base flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Our Promise of Transparency</span>
                </h3>
                <p className="text-slate-600 font-medium">
                  The Welcome Gift Portal never creates fake OTP verification screens or simulates delivery.
                  Registrations are recorded solely with explicit user consent and stored on a persistent database.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm space-y-2">
                <h3 className="font-bold text-[#17243A] text-base flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#D7193F]" />
                  <span>Privacy &amp; Data Protection</span>
                </h3>
                <p className="text-slate-600 font-medium">
                  Mobile numbers and submitted names are accessible strictly by authorized system administrators
                  via authenticated endpoints. Your information is never sold, shared with marketing trackers, or exposed in public URLs.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm space-y-2">
                <h3 className="font-bold text-[#17243A] text-base flex items-center gap-2">
                  <Info className="w-4 h-4 text-sky-600" />
                  <span>User Right to Data Deletion</span>
                </h3>
                <p className="text-slate-600 font-medium">
                  If you wish to remove your registration record, an administrator can permanently delete your record
                  using your Registration Reference ID via the protected Admin Dashboard.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-sky-200 flex items-center justify-between text-xs shadow-2xs">
              <span className="text-slate-600 font-semibold">Want to register another number?</span>
              <button
                onClick={onBackToWelcome}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF5C93] to-[#D7193F] text-white font-bold transition-all cursor-pointer shadow-xs"
              >
                Return to Welcome Page
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Deity Detail Modal */}
      <AnimatePresence>
        {selectedDeity && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white border border-amber-200 rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedDeity(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:text-[#17243A] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-2xl font-bold text-[#17243A] font-serif-display">{selectedDeity.name}</h3>
              <p className="text-xs text-[#D7193F] font-bold mt-0.5">{selectedDeity.title}</p>

              <div className="my-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 font-mono text-xs text-amber-900 font-semibold">
                🕉️ {selectedDeity.mantra}
              </div>

              <div className="space-y-3 text-xs text-slate-700 font-medium leading-relaxed">
                <div>
                  <strong className="text-[#17243A] block mb-1">Spiritual Description:</strong>
                  <p className="text-slate-600">{selectedDeity.description}</p>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                  <strong className="block mb-0.5 text-amber-800">Devotional Fact:</strong>
                  {selectedDeity.devotionalFact}
                </div>

                <div>
                  <strong className="text-[#17243A] block mb-1">Divine Symbolism:</strong>
                  <p className="text-slate-600">{selectedDeity.symbolism}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedDeity(null)}
                className="w-full mt-6 py-2.5 rounded-xl bg-[#17243A] text-white text-xs font-bold cursor-pointer hover:bg-slate-800 transition-colors"
              >
                Close Darshan
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Article Detail Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-white border border-sky-100 rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:text-[#17243A] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                {selectedArticle.category}
              </span>

              <h3 className="text-xl font-bold text-[#17243A] mt-2">{selectedArticle.title}</h3>
              <span className="text-xs text-slate-500 font-semibold block mt-1">{selectedArticle.readTime}</span>

              <div className="my-4 whitespace-pre-line text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {selectedArticle.fullContent}
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
                <strong className="text-amber-800">Key Takeaway:</strong> {selectedArticle.keyFact}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={() => toggleBookmark(selectedArticle.id)}
                  className="flex items-center gap-1.5 text-xs text-slate-700 font-bold hover:text-amber-600 cursor-pointer"
                >
                  <Bookmark
                    className={`w-4 h-4 ${
                      bookmarkedIds.includes(selectedArticle.id) ? 'fill-amber-400 text-amber-500' : ''
                    }`}
                  />
                  <span>
                    {bookmarkedIds.includes(selectedArticle.id) ? 'Bookmarked' : 'Save Bookmark'}
                  </span>
                </button>

                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-5 py-2 rounded-xl bg-[#17243A] text-white text-xs font-bold cursor-pointer"
                >
                  Close Article
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI Art Detail Modal */}
      <AnimatePresence>
        {selectedArt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white border border-purple-200 rounded-3xl overflow-hidden shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedArt(null)}
                className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-white/80 text-slate-600 hover:text-[#17243A] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="h-64 bg-slate-100 relative">
                <img src={selectedArt.image} alt={selectedArt.title} className="w-full h-full object-cover" />
              </div>

              <div className="p-6 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                  {selectedArt.category}
                </span>
                <h3 className="text-xl font-bold text-[#17243A]">{selectedArt.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{selectedArt.description}</p>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <strong className="text-purple-900 block mb-1">Prompt Concept:</strong>
                  <p className="text-slate-600 font-mono text-[11px] italic">"{selectedArt.promptConcept}"</p>
                </div>

                <button
                  onClick={() => setSelectedArt(null)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FF5C93] to-purple-600 text-white text-xs font-bold transition-colors cursor-pointer mt-2 shadow-xs"
                >
                  Close Preview
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Responsive Bottom Navigation Bar (Section 2 Requirement) */}
      <BottomNav
        activeSection={activeSection}
        onSelectSection={setActiveSection}
      />

      {/* Settings Modal (Section 3 Requirement - Full Terms & Conditions in Settings) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        registrationId={registrationId}
        displayName={displayName}
        onSelectSection={setActiveSection}
        onOpenAdmin={onOpenAdmin}
        onOpenDbInfo={() => setIsDbInfoOpen(true)}
      />

      {/* Database Diagnostic Modal */}
      <DatabaseInfoModal
        isOpen={isDbInfoOpen}
        onClose={() => setIsDbInfoOpen(false)}
      />
    </div>
  );
};
