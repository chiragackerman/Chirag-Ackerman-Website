import React from 'react';
import { useSite } from '../context/SiteContext.jsx';
import SEOHead from '../components/SEOHead.jsx';
import { Shield, Lock } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const { siteConfig } = useSite();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-10 text-left">
      <SEOHead
        title="Privacy Policy — CHIRAG ACKERMAN"
        description="Privacy policy and data protection disclosures for CHIRAG ACKERMAN creator storefront and personal website."
        canonicalPath="/#privacy"
      />

      <div className="space-y-3 border-b border-purple-900/30 pb-8">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-purple-400 font-semibold">
          <Shield className="w-4 h-4" />
          <span>Privacy &amp; Data Rights</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
          PRIVACY POLICY
        </h1>
        <p className="text-sm text-[#A8A0B8]">
          Last revised: 2026 · Personal brand website for {siteConfig.creatorName}.
        </p>
      </div>

      <div className="space-y-6 text-sm text-[#A8A0B8] leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-display font-bold text-lg text-white">
            1. First-Party Analytics &amp; Click Tracking
          </h2>
          <p>
            When you click on affiliate links to view products on external partner stores (such as Amazon or manufacturer websites), we record anonymous first-party outbound telemetry (including the product title, destination store, coarse device category like desktop/mobile, and timestamp). We do not collect personally identifiable information, cross-site profiling cookies, or financial details during this click.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-bold text-lg text-white">
            2. Contact &amp; Collaboration Submissions
          </h2>
          <p>
            When you send a message through our Contact or Collaboration form, we collect your name, email address, brand name, and the text of your message. This data is utilized solely for communicating regarding the requested partnership and is never sold to third-party data brokers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-bold text-lg text-white">
            3. External Retailer Privacy Practices
          </h2>
          <p>
            Once you follow an affiliate link to a merchant site (e.g. Amazon.in), your interaction is governed by that retailer's individual privacy policy and terms of service. Chirag Ackerman is not responsible for the privacy practices of external merchants.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-bold text-lg text-white">
            4. Contact
          </h2>
          <p>
            For privacy inquiries or data requests, contact{' '}
            <a href={`mailto:${siteConfig.email}`} className="text-purple-300 underline">
              {siteConfig.email}
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
