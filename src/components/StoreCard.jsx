import React from 'react';
import { useSite } from '../context/SiteContext.jsx';
import { ExternalLink, Store as StoreIcon, ShieldCheck } from 'lucide-react';

export default function StoreCard({ store }) {
  const { trackAndOpenAffiliate } = useSite();

  const handleOpenStore = () => {
    trackAndOpenAffiliate(
      { id: store.id, name: store.name },
      store.url,
      store.name
    );
  };

  return (
    <div className="flex flex-col justify-between p-6 rounded-2xl bg-[#120D1A] border border-purple-500/15 hover:border-purple-400/40 transition-all duration-300 hover:-translate-y-1 purple-glow-card">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-purple-950/50 border border-purple-500/25 flex items-center justify-center text-purple-300">
            <StoreIcon className="w-5 h-5" />
          </div>
          {store.badge && (
            <span className="text-[11px] font-medium text-purple-300 bg-purple-950/70 border border-purple-500/30 px-2.5 py-0.5 rounded-full">
              {store.badge}
            </span>
          )}
        </div>

        <div>
          <h3 className="font-display font-bold text-lg text-white">
            {store.name}
          </h3>
          <p className="text-xs uppercase tracking-wider text-purple-400/90 font-medium mt-0.5">
            {store.category}
          </p>
        </div>

        <p className="text-xs sm:text-sm text-[#A8A0B8] line-clamp-3 leading-relaxed">
          {store.description}
        </p>
      </div>

      <div className="pt-4 mt-4 border-t border-purple-900/20">
        <button
          onClick={handleOpenStore}
          className="w-full py-2.5 px-4 rounded-xl bg-[#171020] hover:bg-purple-900/30 border border-purple-500/20 hover:border-purple-400/50 text-purple-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <span>Visit Store</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
