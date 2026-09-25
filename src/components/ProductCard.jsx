import React, { useState } from 'react';
import { useSite } from '../context/SiteContext.jsx';
import { ExternalLink, Tag, Sparkles, Box } from 'lucide-react';
import { formatPrice } from '../utils/formatters.js';

export default function ProductCard({ product, onSelectProduct }) {
  const { trackAndOpenAffiliate } = useSite();
  const [imageError, setImageError] = useState(false);

  if (!product) return null;

  const handleAffiliateClick = (e) => {
    e.stopPropagation();
    trackAndOpenAffiliate(product, product.affiliateUrl, product.storeName || product.platform);
  };

  const handleCardClick = () => {
    if (onSelectProduct) {
      onSelectProduct(product.id);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col rounded-2xl bg-[#120D1A] border border-purple-500/15 hover:border-purple-400/40 transition-all duration-300 hover:-translate-y-1 purple-glow-card cursor-pointer overflow-hidden"
    >
      {/* Product Image Area */}
      <div className="relative aspect-[4/3] w-full bg-[#171020] overflow-hidden flex items-center justify-center">
        {(product.imageUrl || product.image) && !imageError ? (
          <img
            src={product.imageUrl || product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#171020] to-[#120D1A] text-purple-300">
            <Box className="w-10 h-10 mb-2 opacity-40 text-purple-400" />
            <span className="text-xs uppercase tracking-wider text-[#A8A0B8]">
              {product.brand || 'Gear Specimen'}
            </span>
          </div>
        )}

        {/* Subtle top indicator if featured */}
        {product.featured && (
          <div className="absolute top-3 left-3 flex items-center gap-1 text-[11px] font-semibold text-purple-200 bg-purple-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-purple-400/25">
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>Featured Gear</span>
          </div>
        )}

        {product.couponCode?.trim() && (
          <div className="absolute top-3 right-3 inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider text-emerald-100 bg-purple-950/90 backdrop-blur-md px-2 py-1 rounded-md border border-purple-400/30">
            <Tag className="w-3 h-3 text-purple-300" />
            <span>COUPON AVAILABLE</span>
          </div>
        )}

        {/* Platform/Store badge */}
        <div className="absolute bottom-3 right-3 text-[11px] font-medium text-white/90 bg-[#070509]/80 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
          {product.storeName || product.platform || 'Retailer'}
        </div>
      </div>

      {/* Content Details */}
      <div className="p-5 flex flex-col flex-1 justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Unboxed Brand · Category metadata */}
          <div className="flex items-center gap-1.5 text-xs text-[#A8A0B8] uppercase tracking-wider font-medium">
            <span className="text-purple-300/90">{product.brand}</span>
            <span aria-hidden="true" className="text-purple-600">·</span>
            <span>{product.categoryName || product.category}</span>
          </div>

          {/* Product Name */}
          <h3 className="font-display font-bold text-base sm:text-lg text-white group-hover:text-purple-200 transition-colors line-clamp-2">
            {product.name}
          </h3>

          {/* Short Description */}
          {product.shortDescription && (
            <p className="text-xs sm:text-sm text-[#A8A0B8] line-clamp-2 leading-relaxed">
              {product.shortDescription}
            </p>
          )}
        </div>

        {/* Bottom Actions & Price */}
        <div className="pt-3 border-t border-purple-900/20 flex items-center justify-between gap-3">
          <div>
            {product.price ? (
              <div className="text-base font-bold text-white font-mono-nums">
                {formatPrice(product.price, product.currency)}
              </div>
            ) : (
              <span className="text-xs text-[#A8A0B8]/60">Check retailer</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAffiliateClick}
              className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{product.platform === 'Amazon' ? 'Amazon' : 'View Link'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
