import React from 'react';
import { useSite } from '../context/SiteContext.jsx';
import { ShieldCheck, Info, ExternalLink, HeartHandshake, CheckCircle2 } from 'lucide-react';

export default function AffiliateDisclosurePage({ onNavigate }) {
  const { siteConfig } = useSite();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-10 text-left">
      <div className="space-y-3 border-b border-purple-900/30 pb-8">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-purple-400 font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Editorial Transparency</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
          AFFILIATE DISCLOSURE
        </h1>
        <p className="text-sm text-[#A8A0B8]">
          Last revised: 2026 · Committed to genuine recommendations and transparent creator practices.
        </p>
      </div>

      <div className="space-y-8 text-sm text-[#A8A0B8] leading-relaxed">
        {/* Core Summary Callout */}
        <div className="p-6 rounded-2xl bg-[#120D1A] border border-purple-500/25 purple-glow-card space-y-3">
          <div className="flex items-center gap-2 text-purple-300 font-semibold text-base">
            <Info className="w-5 h-5 text-purple-400" />
            <span>Summary of Disclosure</span>
          </div>
          <p className="text-white font-medium">
            {siteConfig.affiliateDisclosure ||
              'Some links on this website are affiliate links. If you make a purchase through these links, I may earn an affiliate commission at zero additional cost to you. I only recommend hardware, peripherals, and developer tools that I personally test or genuinely believe in.'}
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl text-white">
            1. How Affiliate Links Function
          </h2>
          <p>
            When you click on buttons such as "VIEW ON AMAZON", "VIEW ON BRAND WEBSITE", or "VIEW PRODUCT" across this site, you are redirected to third-party merchant sites (including Amazon.in, manufacturer webshops, and authorized distributors). If you complete a transaction, the retailer pays a small percentage to help support my content production, independent gear testing, and video production costs.
          </p>
          <p>
            The retail price you pay remains exactly the same whether you use an affiliate link or navigate directly. In some cases, brand partnerships may even provide discounted promo codes that lower your purchase cost.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl text-white">
            2. Amazon Associates &amp; Creator Program
          </h2>
          <p>
            Chirag Ackerman is a participant in the Amazon Associates Program and Amazon Influencer Program. As an Amazon Associate, I earn from qualifying purchases made via links and my curated storefront at{' '}
            <a
              href={siteConfig.amazonStorefrontUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-300 underline"
            >
              amazon.in/shop/chirag.ackerman
            </a>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl text-white">
            3. Editorial Integrity &amp; Review Policy
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[#120D1A] border border-purple-500/15 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero Fake Data</span>
              </div>
              <p className="text-xs text-[#A8A0B8]">
                I never fabricate review scores, discounts, or exaggerated performance stats.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#120D1A] border border-purple-500/15 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Authentic Usage</span>
              </div>
              <p className="text-xs text-[#A8A0B8]">
                Every product featured in the Virtual Setup Tour is an item I actively run or test.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl text-white">
            4. Questions or Inquiries
          </h2>
          <p>
            If you have questions regarding any product recommendations or affiliate partnerships, feel free to reach out directly at{' '}
            <a href={`mailto:${siteConfig.email}`} className="text-purple-300 font-semibold underline">
              {siteConfig.email}
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
