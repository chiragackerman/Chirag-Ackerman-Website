import React from 'react';
import { useSite } from '../context/SiteContext.jsx';
import { Instagram, Mail, ArrowUpRight } from 'lucide-react';

export default function Footer({ onNavigate }) {
  const { siteConfig } = useSite();

  const handleNav = (route, e) => {
    if (e) e.preventDefault();
    onNavigate(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#070509] border-t border-purple-900/30 pt-12 pb-10 mt-12 sm:mt-16">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 border-b border-purple-900/20">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full overflow-hidden border border-purple-400/40 bg-[#171020] flex items-center justify-center shrink-0 shadow-sm">
                <img
                  src={siteConfig.logoUrl || '/src/assets/images/chirag_official_logo.jpg'}
                  alt={`${siteConfig.creatorName} Official Logo`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                  style={{ width: 'auto', height: '100%' }}
                />
              </div>
              <span className="font-display font-bold text-lg tracking-tight text-white">
                {siteConfig.creatorName.toUpperCase()}
              </span>
            </div>
            <p className="text-xs uppercase tracking-widest text-purple-400/90 font-medium">
              Gaming • Coding • Tech • Creator
            </p>
            <p className="text-sm text-[#A8A0B8] max-w-md leading-relaxed">
              Minimalist desk aesthetics, performance peripherals, and real-world developer setups. Sharing the tools that fuel modern digital creation from Navi Mumbai, India.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-[#A8A0B8] hover:text-pink-400 transition-colors"
              >
                <Instagram className="w-4 h-4" />
                <span>{siteConfig.instagramHandle}</span>
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-2 text-xs text-[#A8A0B8] hover:text-purple-300 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>{siteConfig.email}</span>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-white font-semibold">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-[#A8A0B8]">
              <li>
                <a href="#home" onClick={(e) => handleNav('home', e)} className="hover:text-purple-300 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#shop" onClick={(e) => handleNav('shop', e)} className="hover:text-purple-300 transition-colors">
                  Shop My Gear
                </a>
              </li>
              <li>
                <a href="#setup" onClick={(e) => handleNav('setup', e)} className="hover:text-purple-300 transition-colors">
                  Virtual Setup Tour
                </a>
              </li>
              <li>
                <a href="#categories" onClick={(e) => handleNav('categories', e)} className="hover:text-purple-300 transition-colors">
                  Gear Categories
                </a>
              </li>
              <li>
                <a href="#about" onClick={(e) => handleNav('about', e)} className="hover:text-purple-300 transition-colors">
                  About Chirag
                </a>
              </li>
            </ul>
          </div>

          {/* Business & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-white font-semibold">
              Partners & Legal
            </h4>
            <ul className="space-y-2 text-sm text-[#A8A0B8]">
              <li>
                <a href="#collaborate" onClick={(e) => handleNav('collaborate', e)} className="hover:text-purple-300 transition-colors flex items-center gap-1">
                  Brand Collaboration <ArrowUpRight className="w-3.5 h-3.5 text-purple-400" />
                </a>
              </li>
              <li>
                <a href="#contact" onClick={(e) => handleNav('contact', e)} className="hover:text-purple-300 transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#affiliate-disclosure" onClick={(e) => handleNav('affiliate-disclosure', e)} className="hover:text-purple-300 transition-colors">
                  Affiliate Disclosure
                </a>
              </li>
              <li>
                <a href="#privacy" onClick={(e) => handleNav('privacy', e)} className="hover:text-purple-300 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#admin" onClick={(e) => handleNav('admin', e)} className="hover:text-purple-400 text-xs transition-colors">
                  Admin Login
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A8A0B8]">
          <p>© 2026 {siteConfig.creatorName}. All rights reserved.</p>
          <p className="text-purple-400/80 font-mono text-[11px]">
            Built with code, creativity &amp; caffeine.
          </p>
        </div>
      </div>
    </footer>
  );
}
