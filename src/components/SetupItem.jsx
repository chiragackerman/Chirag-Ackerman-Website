import React from 'react';
import { useSite } from '../context/SiteContext.jsx';
import { ExternalLink, ArrowRight, Quote } from 'lucide-react';

export default function SetupItem({ item, index, onSelectProduct }) {
  const { trackAndOpenAffiliate, products } = useSite();

  const matchedProduct = products.find((p) => p.id === item.productId);
  const displayImage = matchedProduct?.imageUrl || matchedProduct?.image || item.image;
  const displayTitle = matchedProduct?.name || item.productName;

  const handleOpenProduct = (e) => {
    e.stopPropagation();
    if (matchedProduct && onSelectProduct) {
      onSelectProduct(matchedProduct.id);
    } else if (item.affiliateUrl) {
      trackAndOpenAffiliate({ id: item.id, name: item.productName }, item.affiliateUrl, 'Setup Tour');
    }
  };

  const isEven = index % 2 === 0;

  return (
    <div className="py-12 border-b border-purple-900/20 last:border-b-0">
      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${isEven ? '' : 'lg:flex-row-reverse'}`}>
        {/* Media Frame */}
        <div className={`lg:col-span-6 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
          <div className="relative rounded-2xl overflow-hidden border border-purple-500/20 bg-[#120D1A] purple-glow group">
            <div className="aspect-[4/3] w-full overflow-hidden">
              <img
                src={displayImage}
                alt={displayTitle}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-700"
              />
            </div>
            <div className="absolute top-4 left-4 text-xs font-semibold text-purple-200 bg-[#070509]/80 backdrop-blur-md px-3 py-1 rounded-md border border-purple-400/20">
              {item.category}
            </div>
          </div>
        </div>

        {/* Editorial Story & Specs */}
        <div className={`lg:col-span-6 space-y-5 text-left ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
          <div className="space-y-1.5">
            <span className="text-xs uppercase font-bold tracking-widest text-purple-400">
              {item.category}
            </span>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
              {displayTitle}
            </h3>
            <p className="text-sm font-semibold text-purple-300">
              {matchedProduct?.shortDescription || item.itemTitle}
            </p>
          </div>

          {/* Why I Use It */}
          <div className="p-4 rounded-xl bg-[#171020]/90 border border-purple-500/15 relative">
            <div className="flex items-start gap-3">
              <Quote className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs uppercase tracking-wider text-purple-300 font-bold block mb-1">
                  Why I Use It
                </span>
                <p className="text-sm text-[#A8A0B8] leading-relaxed">
                  {item.whyIUseIt}
                </p>
              </div>
            </div>
          </div>

          {/* Specifications */}
          {item.specs && (
            <div className="text-xs text-[#A8A0B8]/80 font-mono">
              <span className="text-purple-400/80 font-semibold font-sans uppercase tracking-wider text-[11px] block mb-1">
                Highlights &amp; Dimensions
              </span>
              <span>{item.specs}</span>
            </div>
          )}

          {/* CTAs */}
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={handleOpenProduct}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold tracking-wide flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-purple-900/30"
            >
              <span>View Product Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {item.affiliateUrl && (
              <a
                href={item.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackAndOpenAffiliate({ id: item.id, name: item.productName }, item.affiliateUrl, 'Direct Setup Link')}
                className="px-4 py-2.5 rounded-xl bg-[#171020] hover:bg-[#1E142B] border border-purple-500/25 text-purple-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <span>Direct Retailer</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
