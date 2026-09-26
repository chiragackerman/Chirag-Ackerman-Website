import React from 'react';
import { useSite } from '../context/SiteContext.jsx';
import CategoryCard from '../components/CategoryCard.jsx';
import AffiliateDisclosure from '../components/AffiliateDisclosure.jsx';
import SEOHead from '../components/SEOHead.jsx';
import { Layers } from 'lucide-react';

export default function CategoriesPage({ onSelectCategory, onNavigate }) {
  const { categories, products } = useSite();

  return (
    <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 pt-20 sm:pt-24 pb-12 space-y-8 sm:space-y-10 text-left">
      <SEOHead
        title="Gear Categories — CHIRAG ACKERMAN"
        description="Browse gaming gear, mechanical keyboards, audio setups, and workspace essentials organized by category by CHIRAG ACKERMAN."
        canonicalPath="/#categories"
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Gear Categories — CHIRAG ACKERMAN",
          "description": "Browse gaming gear, mechanical keyboards, audio setups, and workspace essentials organized by category by CHIRAG ACKERMAN.",
          "url": "https://chiragackerman.dev/#categories"
        }}
      />
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-purple-400 font-semibold">
          <Layers className="w-3.5 h-3.5" />
          <span>Curated Index</span>
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
          SHOP BY CATEGORY
        </h1>
        <p className="text-xs sm:text-sm text-[#A8A0B8] max-w-2xl">
          Gear I use, create with, and genuinely recommend. Select any category below to filter available hardware specifications and affiliate options.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr gap-6">
        {categories.map((cat) => {
          const count = products.filter((p) => p.category === (cat.slug || cat.id) && p.published).length;
          return (
            <div key={cat.slug || cat.id} className="relative">
              <CategoryCard category={cat} onSelectCategory={onSelectCategory} className="h-full" />
              {count > 0 && (
                <div className="absolute top-4 right-4 text-[11px] font-mono font-medium text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/20">
                  {count} {count === 1 ? 'item' : 'items'}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <AffiliateDisclosure compact={true} onNavigate={onNavigate} />
    </div>
  );
}
