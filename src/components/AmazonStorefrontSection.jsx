import React from 'react';
import { useSite } from '../context/SiteContext.jsx';
import { ExternalLink, ShoppingBag, CheckCircle2 } from 'lucide-react';

export default function AmazonStorefrontSection() {
  const { siteConfig, trackAndOpenAffiliate } = useSite();

  const handleOpenAmazon = () => {
    trackAndOpenAffiliate(
      { id: 'amazon-storefront-official', name: 'Chirag Ackerman Official Amazon Storefront' },
      siteConfig.amazonStorefrontUrl,
      'Amazon Storefront'
    );
  };

  return (
    <section className="py-6 sm:py-8 relative overflow-hidden">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="relative rounded-3xl p-6 sm:p-10 lg:p-12 bg-gradient-to-br from-[#120D1A] via-[#171020] to-[#0E0916] border border-purple-500/25 purple-glow overflow-hidden">
          {/* Subtle decorative glow */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
                <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                <span>Verified Creator List</span>
              </div>

              <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
                SHOP MY AMAZON STORE
              </h2>

              <p className="text-base text-[#A8A0B8] max-w-2xl leading-relaxed">
                Browse the gear and products I've added to my Amazon storefront. From tested keyboards and lightweight mice to cable management kits and studio lighting, find everything organized in one place.
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-[#A8A0B8]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  <span>Curated &amp; Personally Verified</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  <span>Direct Retailer Checkout</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  <span>Official Affiliate Partner</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-center">
              <button
                onClick={handleOpenAmazon}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-sm tracking-wide transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>VISIT AMAZON STOREFRONT</span>
                <ExternalLink className="w-4 h-4 text-black" />
              </button>
              <span className="text-[11px] text-[#A8A0B8]/70 mt-2.5">
                Redirects securely to Amazon.in storefront
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
