import React from 'react';
import { useSite } from '../context/SiteContext.jsx';
import { Info } from 'lucide-react';

export default function AffiliateDisclosure({ compact = false, onNavigate }) {
  const { siteConfig } = useSite();

  if (compact) {
    return (
      <div className="text-xs text-[#A8A0B8]/70 flex items-center justify-center gap-1.5 py-3">
        <Info className="w-3.5 h-3.5 text-purple-400 shrink-0" />
        <span>
          Some links on this page are affiliate links.{' '}
          <button
            onClick={() => onNavigate && onNavigate('affiliate-disclosure')}
            className="text-purple-300 underline hover:text-white transition-colors"
          >
            Learn more
          </button>
        </span>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#120D1A]/80 border border-purple-500/15 max-w-4xl mx-auto my-6 text-left">
      <div className="flex items-start gap-3">
        <div className="p-1.5 rounded-lg bg-purple-950/60 border border-purple-500/30 text-purple-300 shrink-0">
          <Info className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-wider text-purple-300 font-bold">
            Affiliate Transparency
          </span>
          <p className="text-xs sm:text-sm text-[#A8A0B8] leading-relaxed">
            {siteConfig.affiliateDisclosure ||
              'Disclosure: Some links on this website are affiliate links. If you purchase through one of these links, I may earn a commission at no additional cost to you. I only recommend gear I genuinely use, test, or trust.'}
          </p>
        </div>
      </div>
    </div>
  );
}
