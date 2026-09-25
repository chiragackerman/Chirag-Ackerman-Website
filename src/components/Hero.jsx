import React from 'react';
import { useSite } from '../context/SiteContext.jsx';
import { ArrowRight, Monitor, Instagram, Sparkles } from 'lucide-react';
const heroDeskImg = '/src/assets/images/hero_setup_desk_1790324766242.jpg';

export default function Hero({ onNavigate }) {
  const { siteConfig } = useSite();

  return (
    <section className="relative flex items-center pt-20 sm:pt-24 pb-8 sm:pb-10 overflow-hidden">
      {/* Background Ambient Purple Radial Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/12 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 -right-20 w-[400px] h-[400px] bg-purple-800/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Bold Typography & CTAs */}
          <div className="lg:col-span-6 space-y-5 text-left">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/40 border border-purple-500/25 text-purple-300 text-xs font-semibold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>{siteConfig.hero?.eyebrow || 'CHIRAG ACKERMAN'}</span>
            </div>

            {/* Main Headline - Modern, readable gaming typography */}
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05] text-white">
              <span className="block text-white">GAMING.</span>
              <span className="block bg-gradient-to-r from-purple-400 via-purple-300 to-lavender-200 bg-clip-text text-transparent">
                CODING.
              </span>
              <span className="block text-white">TECH.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#A8A0B8] max-w-xl leading-relaxed">
              {siteConfig.hero?.subtitle || 'Exploring the gear, setups and technology that power my creativity.'}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('shop')}
                className="px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm tracking-wide transition-all shadow-lg shadow-purple-900/40 hover:shadow-purple-700/50 flex items-center gap-2 group cursor-pointer"
              >
                <span>EXPLORE MY GEAR</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('setup')}
                className="px-6 py-3.5 rounded-xl bg-[#171020] hover:bg-[#20162D] border border-purple-500/30 hover:border-purple-400/60 text-purple-200 font-medium text-sm tracking-wide transition-all flex items-center gap-2 cursor-pointer"
              >
                <Monitor className="w-4 h-4 text-purple-400" />
                <span>VIEW MY SETUP</span>
              </button>

              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 text-sm text-[#A8A0B8] hover:text-pink-400 transition-colors"
              >
                <Instagram className="w-4 h-4" />
                <span className="font-medium">Instagram</span>
              </a>
            </div>

            {/* Subtle Affiliate Disclosure */}
            <p className="text-xs text-[#A8A0B8]/75 pt-3 flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-500/60" />
              <span>{siteConfig.hero?.affiliateNote || 'Some links may be affiliate links. I may earn a commission at no extra cost to you.'}</span>
            </p>
          </div>

          {/* Right Column: Dark Cinematic Desk Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-purple-500/25 bg-[#120D1A] purple-glow">
              {/* Image */}
              <div className="aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden relative">
                <img
                  src={heroDeskImg}
                  alt="Chirag Ackerman Dark Cinematic Battlestation Setup"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transform hover:scale-102 transition-transform duration-700"
                />
                {/* Measured Scrim & Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#070509]/90 via-[#070509]/20 to-transparent pointer-events-none" />
                <div className="absolute inset-0 border border-purple-400/10 pointer-events-none rounded-2xl" />
              </div>

              {/* Inset Label / Status info */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#0B0710]/80 backdrop-blur-md border border-purple-500/20 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-purple-400 font-semibold">
                    Studio Desk Tour
                  </p>
                  <p className="text-sm font-semibold text-white">
                    Navi Mumbai Setup · 2026 Edition
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('setup')}
                  className="px-3.5 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/30 text-xs font-medium text-purple-200 transition-colors"
                >
                  Tour Gear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
