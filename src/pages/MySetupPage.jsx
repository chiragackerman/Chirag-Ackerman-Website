import React, { useState } from 'react';
import SetupItem from '../components/SetupItem.jsx';
import AffiliateDisclosure from '../components/AffiliateDisclosure.jsx';
import { initialSetupItems } from '../data/initialSetupItems.js';
import { Monitor, Compass, Sparkles, SlidersHorizontal } from 'lucide-react';
import heroDeskImg from '../assets/images/hero_setup_desk_1790324766242.jpg';

export default function MySetupPage({ onSelectProduct, onNavigate }) {
  const [activeFilter, setActiveFilter] = useState('all');

  const setupCategories = [
    'all',
    'Gaming Setup',
    'Mouse',
    'Keyboard',
    'Mousepad / Desk Mat',
    'Headphones',
    'Lighting',
    'Laptop Accessories',
    'Creator Gear',
    'Coding Gear'
  ];

  const filteredItems = activeFilter === 'all'
    ? initialSetupItems
    : initialSetupItems.filter((i) => i.category === activeFilter);

  return (
    <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 pt-20 sm:pt-24 pb-12 space-y-10 sm:space-y-12 text-left">
      {/* Editorial Header Banner */}
      <div className="relative rounded-3xl p-6 sm:p-10 lg:p-12 bg-gradient-to-br from-[#120D1A] via-[#171020] to-[#0A0612] border border-purple-500/25 purple-glow overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-purple-400 font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>Virtual Battlestation Walkthrough</span>
          </div>

          <h1 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight leading-none">
            COME INSIDE MY SETUP
          </h1>

          <p className="text-sm sm:text-base text-[#A8A0B8] leading-relaxed">
            Welcome to my personal command center in Navi Mumbai. This workstation serves two high-demand disciplines: competitive, low-latency gaming and sustained software engineering. Every cable is hidden, every switch chosen for feedback, and every lumen calibrated to avoid eye strain.
          </p>

          <div className="pt-1 flex items-center gap-6 text-xs text-[#A8A0B8] font-mono">
            <span>Location: Navi Mumbai, India</span>
            <span>·</span>
            <span>Theme: Stealth Violet</span>
          </div>
        </div>

        {/* Ambient glow accent */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-purple-700/10 blur-3xl pointer-events-none" />
      </div>

      {/* Quick Category Jump Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar text-xs">
        <span className="text-[11px] uppercase font-bold tracking-wider text-[#A8A0B8] pr-2 shrink-0">
          Jump to:
        </span>
        {setupCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeFilter === cat
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-[#120D1A] text-[#A8A0B8] hover:text-white border border-purple-500/10'
            }`}
          >
            {cat === 'all' ? 'All Items (Virtual Tour)' : cat}
          </button>
        ))}
      </div>

      {/* Editorial Setup Items List */}
      <div className="space-y-4">
        {filteredItems.map((item, index) => (
          <SetupItem
            key={item.id}
            item={item}
            index={index}
            onSelectProduct={onSelectProduct}
          />
        ))}
      </div>

      {/* Footer Disclosure */}
      <AffiliateDisclosure compact={false} onNavigate={onNavigate} />
    </div>
  );
}
