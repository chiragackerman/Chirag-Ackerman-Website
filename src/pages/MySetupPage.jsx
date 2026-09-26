import React, { useEffect, useState } from 'react';
import SetupItem from '../components/SetupItem.jsx';
import AffiliateDisclosure from '../components/AffiliateDisclosure.jsx';
import { fetchSetupProducts } from '../services/api.js';
import { setupTourTags } from '../data/setupTourTags.js';
import { Monitor, Compass, Sparkles, SlidersHorizontal } from 'lucide-react';

export default function MySetupPage({ onSelectProduct, onNavigate }) {
  const [setupProducts, setSetupProducts] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    let active = true;
    fetchSetupProducts()
      .then((data) => {
        if (active) setSetupProducts(data);
      })
      .catch((error) => {
        console.warn('My Setup products could not be loaded:', error.message);
        if (active) setSetupProducts([]);
      });

    return () => {
      active = false;
    };
  }, []);

  const setupCategories = ['all', ...setupTourTags];
  const orderedSetupProducts = setupProducts
    .filter((product) => product.showInMySetup === true)
    .sort((a, b) => (a.setupOrder ?? Number.MAX_SAFE_INTEGER) - (b.setupOrder ?? Number.MAX_SAFE_INTEGER));
  const setupItems = setupTourTags.flatMap((category) =>
    orderedSetupProducts
      .filter((product) => Array.isArray(product.setupTags) && product.setupTags.includes(category))
      .map((product) => ({ ...product, category }))
  );

  const filteredItems = activeFilter === 'all'
    ? setupItems
    : setupItems.filter((product) => product.category === activeFilter);

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
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs">
        <span className="text-[11px] uppercase font-bold tracking-wider text-[#A8A0B8] pr-2 shrink-0">
          Jump to:
        </span>
        <div className="grid grid-cols-[repeat(5,max-content)] sm:flex sm:flex-nowrap items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
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
      </div>

      {/* Editorial Setup Items List */}
      <div className="space-y-4">
        {filteredItems.map((item, index) => (
          <SetupItem
            key={`${item.id}-${item.category}`}
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
