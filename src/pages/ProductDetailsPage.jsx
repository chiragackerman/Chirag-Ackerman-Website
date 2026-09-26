import React, { useState } from 'react';
import { useSite } from '../context/SiteContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import AffiliateDisclosure from '../components/AffiliateDisclosure.jsx';
import SEOHead from '../components/SEOHead.jsx';
import {
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  Tag,
  CheckCircle,
  Sparkles,
  Box,
  Share2,
  Check
} from 'lucide-react';
import { formatPrice } from '../utils/formatters.js';

export default function ProductDetailsPage({ productId, onNavigate, onSelectProduct }) {
  const { products, trackAndOpenAffiliate } = useSite();
  const [imageError, setImageError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [couponCopied, setCouponCopied] = useState(false);

  const product = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 pt-32 pb-20 text-center space-y-4">
        <SEOHead
          title="Product Not Found — CHIRAG ACKERMAN"
          description="The requested gear item could not be found in Chirag Ackerman's tech catalog."
          noindex={true}
        />
        <h2 className="font-display font-bold text-2xl text-white">Product Not Found</h2>
        <p className="text-sm text-[#A8A0B8]">The requested gear item does not exist or has been removed.</p>
        <button
          onClick={() => onNavigate('shop')}
          className="px-5 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-semibold cursor-pointer"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const productTitle = `${product.name} — Gaming & Tech Gear | CHIRAG ACKERMAN`;
  const productDesc = (product.shortDescription || product.description || `Explore ${product.name} by ${product.brand}, curated and tested by CHIRAG ACKERMAN.`).slice(0, 160);
  const productImage = product.imageUrl || product.image || '/chirag_official_logo.jpg';
  const canonicalPath = `/#product/${product.id}`;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": [productImage],
    "description": product.shortDescription || product.description || product.name,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "CHIRAG ACKERMAN"
    },
    "category": product.categoryName || product.category,
    ...(product.price ? {
      "offers": {
        "@type": "Offer",
        "price": product.price,
        "priceCurrency": product.currency === "₹" ? "INR" : (product.currency || "INR"),
        "availability": "https://schema.org/InStock",
        "url": product.affiliateUrl || `https://chiragackerman.dev${canonicalPath}`
      }
    } : {})
  };

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id && p.published)
    .slice(0, 3);

  const handleBuyClick = () => {
    trackAndOpenAffiliate(product, product.affiliateUrl, product.storeName || product.platform);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCoupon = async () => {
    const couponCode = product.couponCode?.trim();
    if (!couponCode || !navigator.clipboard) return;

    try {
      await navigator.clipboard.writeText(couponCode);
      setCouponCopied(true);
      setTimeout(() => setCouponCopied(false), 2000);
    } catch {
      setCouponCopied(false);
    }
  };

  const getCtaLabel = () => {
    if (product.platform === 'Amazon') return 'VIEW ON AMAZON';
    if (product.platform === 'Brand Website') return 'VIEW ON BRAND WEBSITE';
    return 'VIEW PRODUCT AT RETAILER';
  };

  return (
    <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 pt-20 sm:pt-24 pb-12 space-y-8 sm:space-y-10 text-left">
      <SEOHead
        title={productTitle}
        description={productDesc}
        image={productImage}
        canonicalPath={canonicalPath}
        type="product"
        schema={productSchema}
      />

      {/* Back Button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('shop')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#A8A0B8] hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Gear Catalog</span>
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-xs text-[#A8A0B8] hover:text-purple-300 transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copied ? 'Link Copied!' : 'Share Product'}</span>
        </button>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Product Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-[#120D1A] border border-purple-500/20 purple-glow aspect-[4/3] flex items-center justify-center">
            {(product.imageUrl || product.image) && !imageError ? (
              <img
                src={product.imageUrl || product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-purple-300">
                <Box className="w-16 h-16 opacity-30 text-purple-400 mb-3" />
                <span className="text-sm font-semibold text-white">{product.name}</span>
                <span className="text-xs text-[#A8A0B8]">{product.brand}</span>
              </div>
            )}

            {product.featured && (
              <div className="absolute top-4 left-4 text-xs font-semibold text-purple-200 bg-purple-950/80 backdrop-blur-md px-3 py-1 rounded-md border border-purple-400/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Featured Daily Driver</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Contiguous Purchase & Specs Module */}
        <div className="lg:col-span-6 space-y-6">
          {/* Metadata: Brand · Category */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-widest">
              <span>{product.brand}</span>
              <span aria-hidden="true" className="text-purple-600">·</span>
              <span>{product.categoryName || product.category}</span>
            </div>

            <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
              {product.name}
            </h1>
          </div>

          {/* Price (if stored) & Retailer platform info */}
          <div className="p-5 rounded-2xl bg-[#120D1A] border border-purple-500/20 space-y-4">
            <div className="flex items-baseline justify-between">
              {product.price ? (
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#A8A0B8] block mb-0.5">
                    Current Retail Estimate
                  </span>
                  <div className="text-3xl font-black text-white font-mono-nums">
                    {formatPrice(product.price, product.currency)}
                  </div>
                </div>
              ) : (
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#A8A0B8] block mb-0.5">
                    Pricing
                  </span>
                  <div className="text-sm text-purple-300 font-medium">
                    Available at retailer store
                  </div>
                </div>
              )}

              <div className="text-right">
                <span className="text-xs text-[#A8A0B8] block">Fulfillment Platform</span>
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  {product.storeName || product.platform || 'Direct Partner'}
                </span>
              </div>
            </div>

            {product.couponCode?.trim() && (
              <div className="rounded-xl border border-purple-400/25 bg-purple-950/35 p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-300">
                  <Tag className="w-4 h-4" />
                  <span>Exclusive Discount</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
                  <div className="min-w-0">
                    <span className="block text-[11px] text-[#A8A0B8] mb-1">Use code</span>
                    <code className="block max-w-full break-all text-lg font-bold tracking-wider text-white">
                      {product.couponCode.trim()}
                    </code>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyCoupon}
                    className="shrink-0 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg border border-purple-400/30 text-xs font-semibold text-purple-200 hover:bg-purple-900/40 transition-colors cursor-pointer"
                  >
                    {couponCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
                    <span>{couponCopied ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-[#A8A0B8]">
                  Apply this code at checkout to get your discount.
                </p>
              </div>
            )}

            {/* Main Affiliate CTA Button */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleBuyClick}
                className="w-full py-4 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm tracking-wider uppercase transition-all shadow-lg shadow-purple-900/40 hover:shadow-purple-700/50 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{getCtaLabel()}</span>
                <ExternalLink className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-center text-[#A8A0B8]/75">
                You'll be redirected to the retailer's official website. Purchases do not occur directly on this site.
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase font-bold tracking-wider text-purple-400">
              Overview &amp; Creator Notes
            </h3>
            <p className="text-sm text-[#A8A0B8] leading-relaxed">
              {product.description || product.shortDescription}
            </p>
          </div>

          {/* Specifications Table */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-xs uppercase font-bold tracking-wider text-purple-400">
                Hardware Specifications
              </h3>
              <div className="rounded-xl border border-purple-500/15 overflow-hidden bg-[#120D1A]/60">
                {product.specifications.map((spec, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-3 p-3 text-xs border-b border-purple-900/15 last:border-b-0"
                  >
                    <span className="font-semibold text-purple-300/90">{spec.key}</span>
                    <span className="col-span-2 text-[#F5F3FF] font-mono-nums">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap text-xs text-[#A8A0B8]">
              <Tag className="w-3.5 h-3.5 text-purple-400" />
              {product.tags.map((tag, idx) => (
                <span key={idx} className="after:content-['·'] last:after:content-none after:ml-2">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Affiliate Transparency Callout */}
      <AffiliateDisclosure compact={false} onNavigate={onNavigate} />

      {/* Related Gear */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-10 border-t border-purple-900/20">
          <h2 className="font-display font-bold text-2xl text-white">
            More in {product.categoryName || product.category}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
