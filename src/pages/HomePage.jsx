import React from 'react';
import { useSite } from '../context/SiteContext.jsx';
import Hero from '../components/Hero.jsx';
import Stats from '../components/Stats.jsx';
import CategoryCard from '../components/CategoryCard.jsx';
import ProductCard from '../components/ProductCard.jsx';
import AmazonStorefrontSection from '../components/AmazonStorefrontSection.jsx';
import StoreCard from '../components/StoreCard.jsx';
import AffiliateDisclosure from '../components/AffiliateDisclosure.jsx';
import { ArrowRight, Sparkles, Monitor, Layers, Store as StoreIcon } from 'lucide-react';

export default function HomePage({ onNavigate, onSelectProduct, onSelectCategory }) {
  const { products, categories, stores } = useSite();

  const featuredProducts = products.filter((p) => p.featured && p.published).slice(0, 8);
  const displayCategories = categories.slice(0, 6);

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* 1. Hero Section */}
      <Hero onNavigate={onNavigate} />

      {/* 2. Dynamic Creator Stats */}
      <Stats />

      {/* 3. FEATURED GEAR (Now moved ABOVE Shop By Category) */}
      <section className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-purple-400 font-semibold mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Selection</span>
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
              FEATURED GEAR
            </h2>
            <p className="text-xs sm:text-sm text-[#A8A0B8] mt-1">
              Handpicked peripherals, mechanical boards, and battle-tested desk gear.
            </p>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs font-semibold text-purple-300 hover:text-purple-200 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Explore All Gear</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {featuredProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* 4. SHOP BY CATEGORY (Now follows Featured Gear) */}
      <section className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-purple-400 font-semibold mb-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Catalog Breakdown</span>
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
              SHOP BY CATEGORY
            </h2>
            <p className="text-xs sm:text-sm text-[#A8A0B8] mt-1">
              Gear I use, create with, and genuinely recommend.
            </p>
          </div>
          <button
            onClick={() => onNavigate('categories')}
            className="text-xs font-semibold text-purple-300 hover:text-purple-200 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {displayCategories.map((cat) => (
            <CategoryCard
              key={cat.slug || cat.id}
              category={cat}
              onSelectCategory={onSelectCategory}
            />
          ))}
        </div>
      </section>

      {/* 5. Amazon Storefront Spotlight */}
      <AmazonStorefrontSection />

      {/* 6. Virtual Setup Teaser */}
      <section className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-4 sm:py-6">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#120D1A] border border-purple-500/20 purple-glow flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-left max-w-2xl">
            <span className="text-xs uppercase font-bold tracking-wider text-purple-400">
              Virtual Walkthrough
            </span>
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-white">
              COME INSIDE MY SETUP
            </h3>
            <p className="text-sm text-[#A8A0B8] leading-relaxed">
              Step into my daily environment in Navi Mumbai. Discover the exact ergonomic riser, low-latency mouse, mechanical switches, and diffused ambient lighting that power my coding marathons and gaming sessions.
            </p>
          </div>
          <button
            onClick={() => onNavigate('setup')}
            className="px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-lg shadow-purple-900/40 flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Monitor className="w-4 h-4" />
            <span>Launch Virtual Setup Tour</span>
          </button>
        </div>
      </section>

      {/* 7. Other Stores & Brands */}
      <section className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-4 sm:py-6">
        <div className="mb-6 text-left">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-purple-400 font-semibold mb-1.5">
            <StoreIcon className="w-3.5 h-3.5" />
            <span>Retail &amp; Partner Network</span>
          </div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
            OTHER STORES &amp; BRANDS
          </h2>
          <p className="text-xs sm:text-sm text-[#A8A0B8] mt-1">
            Official partner stores, brand websites, and specialized tech distributors.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      </section>

      {/* 8. Affiliate Disclosure snippet */}
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <AffiliateDisclosure compact={false} onNavigate={onNavigate} />
      </div>
    </div>
  );
}
