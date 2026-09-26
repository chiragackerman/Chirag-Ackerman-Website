import React, { useState, useEffect } from 'react';
import { useSite } from '../context/SiteContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Search, Instagram, Menu, X, ShieldCheck } from 'lucide-react';

export default function Navbar({ activeRoute, onNavigate }) {
  const { siteConfig } = useSite();
  const { isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', route: 'home' },
    { label: 'Shop', route: 'shop' },
    { label: 'Categories', route: 'categories' },
    { label: 'My Setup', route: 'setup' },
    { label: 'About', route: 'about' },
    { label: 'Collaborate', route: 'collaborate' }
  ];

  const handleNav = (route, e) => {
    if (e) e.preventDefault();
    onNavigate(route);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'py-3 bg-[#0B0710]/90 backdrop-blur-md border-b border-purple-500/15 shadow-lg shadow-black/40'
          : 'py-5 bg-transparent border-b border-purple-500/10'
      }`}
    >
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 flex items-center justify-between">
        {/* Left: Official Brand Logo & Name */}
        <a
          href="#home"
          onClick={(e) => handleNav('home', e)}
          className="flex items-center gap-3 group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded-lg p-1"
        >
          <div className="h-9 sm:h-10 w-9 sm:w-10 rounded-full overflow-hidden border border-purple-400/40 bg-[#171020] flex items-center justify-center shrink-0 shadow-sm group-hover:border-purple-400/80 transition-all duration-300">
            <img
              src={siteConfig.logoUrl || '/src/assets/images/chirag_official_logo.jpg'}
              alt={`${siteConfig.creatorName} Official Logo`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
              style={{ width: 'auto', height: '100%' }}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-base sm:text-lg tracking-tight text-white group-hover:text-purple-300 transition-colors leading-none">
              {siteConfig.creatorName.toUpperCase()}
            </span>
          </div>
        </a>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive = activeRoute === link.route;
            return (
              <a
                key={link.route}
                href={`#${link.route}`}
                onClick={(e) => handleNav(link.route, e)}
                className={`text-sm w-fit font-medium transition-colors relative py-1 ${
                  isActive
                    ? 'text-white'
                    : 'text-[#A8A0B8] hover:text-white'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-purple-400 rounded-full" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNav('shop')}
            title="Search gear"
            aria-label="Search gear"
            className="p-2 text-[#A8A0B8] hover:text-purple-300 hover:bg-purple-950/30 rounded-lg transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>

          <a
            href={siteConfig.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Follow on Instagram @chirag.ackerman"
            aria-label="Instagram profile"
            className="p-2 text-[#A8A0B8] hover:text-pink-400 hover:bg-purple-950/30 rounded-lg transition-colors"
          >
            <Instagram className="w-4 h-4" />
          </a>

          <button
            onClick={() => handleNav('admin')}
            title="Admin Dashboard"
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isAuthenticated
                ? 'bg-purple-900/40 text-purple-200 border-purple-500/40 hover:bg-purple-900/60'
                : 'text-[#A8A0B8] border-purple-500/20 hover:text-white hover:border-purple-400/40'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Admin</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            className="md:hidden p-2 text-[#A8A0B8] hover:text-white rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0F0A18] border-b border-purple-500/20 px-4 pt-3 pb-6 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.route}
              href={`#${link.route}`}
              onClick={(e) => handleNav(link.route, e)}
              className={`block px-3 py-2 text-base font-medium rounded-lg ${
                activeRoute === link.route
                  ? 'bg-purple-950/60 text-purple-300 font-semibold'
                  : 'text-[#A8A0B8] hover:bg-purple-950/30 hover:text-white'
              }`}
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-purple-500/20 flex items-center justify-between px-3">
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-pink-300 hover:text-pink-200"
            >
              <Instagram className="w-4 h-4" />
              <span>@chirag.ackerman</span>
            </a>
            <button
              onClick={() => handleNav('admin')}
              className="flex items-center gap-1.5 text-xs text-purple-300 hover:text-purple-200"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
