import React from 'react';
import { useSite } from '../context/SiteContext.jsx';
import Stats from '../components/Stats.jsx';
import {
  Instagram,
  Mail,
  MapPin,
  Code2,
  Gamepad2,
  Cpu,
  Tv,
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
const heroDeskImg = '/src/assets/images/hero_setup_desk_1790324766242.jpg';

export default function AboutPage({ onNavigate }) {
  const { siteConfig } = useSite();

  return (
    <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 pt-20 sm:pt-24 pb-12 space-y-10 sm:space-y-12 text-left">
      {/* Intro Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-4 sm:space-y-5">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-purple-400 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Headquarters</span>
          </div>

          <h1 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight">
            ABOUT CHIRAG
          </h1>

          <div className="flex items-center gap-3 text-xs uppercase font-medium text-purple-300">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-purple-400" />
              {siteConfig.location || 'Navi Mumbai, Maharashtra, India'}
            </span>
            <span>·</span>
            <span>Gaming • Coding • Tech</span>
          </div>

          <p className="text-base sm:text-lg text-[#F5F3FF] leading-relaxed">
            I'm Chirag S, an independent creator and developer based in Navi Mumbai. My work lives at the intersection of competitive PC gaming, software development, and aesthetic tech hardware.
          </p>

          <p className="text-sm text-[#A8A0B8] leading-relaxed">
            Over the past few years, I’ve cultivated a highly engaged audience around intentional desk ergonomics, custom mechanical keyboards, lightweight gaming peripherals, and developer workflows. Rather than endless unboxing spam, I focus on real-world testing, build durability, and how tools actually integrate into a focused daily routine.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium text-xs tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-purple-900/30"
            >
              <Instagram className="w-4 h-4" />
              <span>FOLLOW ON INSTAGRAM ({siteConfig.instagramHandle})</span>
            </a>

            <button
              onClick={() => onNavigate('collaborate')}
              className="px-5 py-3 rounded-xl bg-[#171020] hover:bg-[#20152C] border border-purple-500/25 text-purple-200 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>Work With Me</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right side portrait/workspace showcase */}
        <div className="lg:col-span-5">
          <div className="relative rounded-2xl overflow-hidden border border-purple-500/20 bg-[#120D1A] purple-glow">
            <div className="aspect-[4/5] w-full overflow-hidden">
              <img
                src={heroDeskImg}
                alt="Chirag Ackerman Workspace & Studio"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="p-4 bg-[#0B0710]/90 border-t border-purple-500/15">
              <span className="text-xs uppercase tracking-wider text-purple-400 font-semibold block">
                Primary Studio Rig
              </span>
              <p className="text-xs text-[#A8A0B8]">
                Customized for high-performance rendering, low-latency tracking, and multi-display coding.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Creator Metrics (Stats) */}
      <div className="space-y-4">
        <h2 className="text-xs uppercase font-bold tracking-widest text-purple-400">
          Media Kit &amp; Audience Reach
        </h2>
        <Stats />
      </div>

      {/* Pillars of Content */}
      <div className="space-y-6">
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
          Content Focus &amp; Creative Pillars
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#120D1A] border border-purple-500/15 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/25 flex items-center justify-center text-purple-300">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">
              Gaming &amp; Peripherals
            </h3>
            <p className="text-xs sm:text-sm text-[#A8A0B8] leading-relaxed">
              Evaluating mice sensors, switch actuation weights, mousepad textures, and low-latency audio headsets tested across competitive tactical games.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#120D1A] border border-purple-500/15 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/25 flex items-center justify-center text-purple-300">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">
              Coding &amp; Workstations
            </h3>
            <p className="text-xs sm:text-sm text-[#A8A0B8] leading-relaxed">
              Optimizing terminal ergonomics, monitor lightbars, mechanical macro keys, and dual-display arrangements tailored for long software engineering sessions.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#120D1A] border border-purple-500/15 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/25 flex items-center justify-center text-purple-300">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">
              Minimalist Desk Aesthetics
            </h3>
            <p className="text-xs sm:text-sm text-[#A8A0B8] leading-relaxed">
              Stealth purple atmospheric backlighting, invisible cable routing, and understated desk accessories that transform cluttered spaces into cinematic zones.
            </p>
          </div>
        </div>
      </div>

      {/* Brand Collaboration Statement */}
      <div className="p-8 sm:p-10 rounded-2xl bg-[#171020] border border-purple-500/25 space-y-4">
        <span className="text-xs uppercase font-bold tracking-widest text-purple-400">
          Editorial &amp; Brand Philosophy
        </span>
        <h3 className="font-display font-bold text-2xl text-white">
          Authentic Recommendations Only
        </h3>
        <p className="text-sm text-[#A8A0B8] leading-relaxed max-w-3xl">
          I only recommend gear that passes my personal standards for build quality, ergonomics, and value. When collaborating with hardware brands, content maintains honest, non-exaggerated commentary so the community knows every recommendation is grounded in real usage.
        </p>
        <button
          onClick={() => onNavigate('collaborate')}
          className="text-xs font-semibold text-purple-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>Explore Collaboration Formats</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
