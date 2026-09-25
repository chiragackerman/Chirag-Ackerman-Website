import React, { useState, useMemo } from 'react';
import { useSite } from '../context/SiteContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import FilterPanel from '../components/FilterPanel.jsx';
import AffiliateDisclosure from '../components/AffiliateDisclosure.jsx';
import { ShoppingBag, PackageOpen } from 'lucide-react';

export default function ShopPage({ initialCategory = 'all', onSelectProduct, onNavigate }) {
  const { products, categories } = useSite();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');

  // Derive unique platforms from current products
  const platforms = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (p.platform) set.add(p.platform);
    });
    return Array.from(set);
  }, [products]);

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // published check
        if (p.published === false) return false;

        // search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name?.toLowerCase().includes(q);
          const matchBrand = p.brand?.toLowerCase().includes(q);
          const matchDesc = p.description?.toLowerCase().includes(q);
          const matchTags = p.tags?.some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchBrand && !matchDesc && !matchTags) return false;
        }

        // category
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }

        // platform
        if (selectedPlatform !== 'all' && p.platform !== selectedPlatform) {
          return false;
        }

        // featured only
        if (featuredOnly && !p.featured) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'featured') {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return (b.createdAt || '').localeCompare(a.createdAt || '');
        }
        if (sortBy === 'newest') {
          return (b.createdAt || '').localeCompare(a.createdAt || '');
        }
        if (sortBy === 'name-asc') {
          return (a.name || '').localeCompare(b.name || '');
        }
        if (sortBy === 'name-desc') {
          return (b.name || '').localeCompare(a.name || '');
        }
        return 0;
      });
  }, [products, searchQuery, selectedCategory, selectedPlatform, featuredOnly, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedPlatform('all');
    setFeaturedOnly(false);
    setSortBy('featured');
  };

  return (
    <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 pt-20 sm:pt-24 pb-12 space-y-6 sm:space-y-8 text-left">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-purple-400 font-semibold">
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Curated Storefront</span>
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
          SHOP MY GEAR
        </h1>
        <p className="text-xs sm:text-sm text-[#A8A0B8] max-w-2xl">
          Discover the exact peripherals, ergonomic desk accessories, and developer hardware I personally run and endorse.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <FilterPanel
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
        selectedPlatform={selectedPlatform}
        onPlatformChange={setSelectedPlatform}
        platforms={platforms}
        featuredOnly={featuredOnly}
        onFeaturedChange={setFeaturedOnly}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onReset={handleResetFilters}
      />

      {/* Results Count & Current Active Filters info */}
      <div className="flex items-center justify-between text-xs text-[#A8A0B8] px-1 font-mono">
        <span>
          Showing <strong className="text-white font-mono-nums">{filteredProducts.length}</strong> items
        </span>
        {selectedCategory !== 'all' && (
          <span className="text-purple-300">
            Category: {categories.find((c) => (c.slug || c.id) === selectedCategory)?.name || selectedCategory}
          </span>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {filteredProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-4 rounded-3xl bg-[#120D1A]/50 border border-purple-500/10 space-y-4">
          <PackageOpen className="w-12 h-12 mx-auto text-purple-400/50" />
          <h3 className="font-display font-bold text-xl text-white">
            No gear found matching your criteria
          </h3>
          <p className="text-sm text-[#A8A0B8] max-w-md mx-auto">
            Try adjusting your search terms or resetting filters to see the full collection.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold cursor-pointer transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Subtle Bottom Disclosure */}
      <AffiliateDisclosure compact={true} onNavigate={onNavigate} />
    </div>
  );
}
