import React from 'react';
import { Search, X, SlidersHorizontal, Sparkles } from 'lucide-react';

export default function FilterPanel({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  selectedPlatform,
  onPlatformChange,
  platforms,
  featuredOnly,
  onFeaturedChange,
  sortBy,
  onSortChange,
  onReset
}) {
  return (
    <div className="bg-[#120D1A] border border-purple-500/15 rounded-2xl p-5 space-y-5">
      {/* Top row: Search input & Sort */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8A0B8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search mice, keyboards, audio, desk gear..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#0B0710] border border-purple-500/20 text-white placeholder-[#A8A0B8]/60 text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8A0B8] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort & Featured toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onFeaturedChange(!featuredOnly)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
              featuredOnly
                ? 'bg-purple-600 text-white border-purple-400'
                : 'bg-[#171020] text-[#A8A0B8] border-purple-500/20 hover:text-white hover:border-purple-400/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Featured</span>
          </button>

          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="py-2 px-3 rounded-xl bg-[#0B0710] border border-purple-500/20 text-xs font-medium text-[#F5F3FF] focus:outline-none focus:border-purple-400 cursor-pointer"
          >
            <option value="featured">Sort: Featured First</option>
            <option value="newest">Sort: Newest Added</option>
            <option value="name-asc">Sort: A to Z</option>
            <option value="name-desc">Sort: Z to A</option>
          </select>

          {(searchQuery || selectedCategory !== 'all' || selectedPlatform !== 'all' || featuredOnly) && (
            <button
              onClick={onReset}
              title="Reset all filters"
              className="text-xs text-purple-400 hover:text-purple-300 underline underline-offset-2 py-1 px-2 cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Categories Horizontal Tabs */}
      <div className="space-y-2">
        <span className="text-[11px] uppercase font-bold tracking-wider text-[#A8A0B8]">
          Category Filter
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            onClick={() => onCategoryChange('all')}
            className={`px-3.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-[#171020] text-[#A8A0B8] hover:text-white border border-purple-500/10'
            }`}
          >
            All Gear
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug || cat.id}
              onClick={() => onCategoryChange(cat.slug || cat.id)}
              className={`px-3.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === (cat.slug || cat.id)
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-[#171020] text-[#A8A0B8] hover:text-white border border-purple-500/10'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Platform/Store Filter */}
      {platforms && platforms.length > 0 && (
        <div className="flex items-center gap-2 text-xs pt-1 border-t border-purple-900/20">
          <span className="text-[11px] uppercase font-bold tracking-wider text-[#A8A0B8]">
            Platform:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => onPlatformChange('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer ${
                selectedPlatform === 'all'
                  ? 'bg-purple-950 text-purple-200 border border-purple-400/40'
                  : 'text-[#A8A0B8] hover:text-white'
              }`}
            >
              All Platforms
            </button>
            {platforms.map((plat) => (
              <button
                key={plat}
                onClick={() => onPlatformChange(plat)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer ${
                  selectedPlatform === plat
                    ? 'bg-purple-950 text-purple-200 border border-purple-400/40'
                    : 'text-[#A8A0B8] hover:text-white'
                }`}
              >
                {plat}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
