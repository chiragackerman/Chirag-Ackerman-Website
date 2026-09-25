import React, { useState } from 'react';
import { useSite } from '../context/SiteContext.jsx';
import { submitCollab } from '../services/api.js';
import {
  Mail,
  Send,
  CheckCircle,
  Briefcase,
  Layers,
  Video,
  Sparkles,
  Camera,
  AlertCircle
} from 'lucide-react';

export default function CollaboratePage() {
  const { siteConfig } = useSite();

  const [form, setForm] = useState({
    name: '',
    brand: '',
    email: '',
    website: '',
    collaborationType: 'Product Feature & Review',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const collaborationFormats = [
    {
      title: 'Product Features & Reviews',
      description: 'In-depth desk integration showcase focusing on tactile switches, sensor tracking, and ergonomics.'
    },
    {
      title: 'Sponsored Instagram Reels',
      description: 'High-retention aesthetic short-form videos highlighting your product under stealth purple ambient lighting.'
    },
    {
      title: 'UGC-Style Content',
      description: 'Clean, authentic b-roll and voiceover assets suitable for whitelisting or your brand’s native channels.'
    },
    {
      title: 'Gaming Setup Tour Integration',
      description: 'Featured placement in my quarterly virtual battlestation tour and permanent affiliate storefront listing.'
    },
    {
      title: 'Product Demonstrations',
      description: 'Focused software or hardware demos walking through real developer or gamer workflows.'
    },
    {
      title: 'Long-term Brand Ambassadorship',
      description: 'Multi-month partnerships with continuous desk presence and community Q&A coverage.'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!form.name.trim() || !form.brand.trim() || !form.email.trim() || !form.message.trim()) {
      setErrorMessage('Please fill in all required fields (Name, Brand, Email, Message).');
      return;
    }

    // Basic email validation
    if (!form.email.includes('@') || !form.email.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitCollab(form);
      setSuccessMessage(res.message || 'Collaboration proposal received! Chirag will respond within 24-48 hours.');
      setForm({
        name: '',
        brand: '',
        email: '',
        website: '',
        collaborationType: 'Product Feature & Review',
        message: ''
      });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit proposal. Please email chiragackerman1112@gmail.com directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 pt-20 sm:pt-24 pb-12 space-y-10 sm:space-y-12 text-left">
      {/* Page Header */}
      <div className="max-w-4xl space-y-3 sm:space-y-4">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-purple-400 font-semibold">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Brand Partnerships &amp; Sponsorships</span>
        </div>

        <h1 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight leading-none">
          LET'S BUILD SOMETHING TOGETHER.
        </h1>

        <p className="text-base sm:text-lg text-[#A8A0B8] leading-relaxed">
          I collaborate with forward-thinking hardware manufacturers, peripheral makers, and developer-tool companies that value authentic product storytelling. Together, we put your gear in front of an engaged audience of PC gamers, engineers, and setup enthusiasts.
        </p>

        <div className="pt-2 flex items-center gap-2 text-xs text-[#A8A0B8]">
          <Mail className="w-4 h-4 text-purple-400" />
          <span>Direct inquiries: </span>
          <a
            href={`mailto:${siteConfig.email}`}
            className="text-purple-300 font-semibold hover:underline"
          >
            {siteConfig.email}
          </a>
        </div>
      </div>

      {/* Collaboration Formats Grid */}
      <div className="space-y-6">
        <h2 className="font-display font-bold text-2xl text-white">
          Available Collaboration Formats
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collaborationFormats.map((format, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#120D1A] border border-purple-500/15 hover:border-purple-400/40 transition-colors space-y-2.5"
            >
              <div className="text-xs uppercase font-bold tracking-wider text-purple-400">
                0{idx + 1}. Format
              </div>
              <h3 className="font-display font-bold text-base text-white">
                {format.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#A8A0B8] leading-relaxed">
                {format.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Collaboration Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-5 space-y-4">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
            Partnership Inquiry
          </h2>
          <p className="text-sm text-[#A8A0B8] leading-relaxed">
            Fill out the brief below to share product specifications, campaign timelines, and intended deliverables. Please provide a working website or product link so I can inspect compatibility with my battlestation aesthetic.
          </p>
          <div className="p-4 rounded-xl bg-[#120D1A] border border-purple-500/15 text-xs text-[#A8A0B8] space-y-2">
            <span className="font-semibold text-purple-300 block uppercase tracking-wider">
              Creator Note
            </span>
            <p>
              I do not make guaranteed performance promises or fake audience claims. Every campaign is delivered with high-contrast cinematics and genuine creator commentary.
            </p>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#120D1A] border border-purple-500/20 purple-glow">
            {successMessage ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="font-display font-bold text-xl text-white">
                  Proposal Submitted
                </h3>
                <p className="text-sm text-[#A8A0B8] max-w-md mx-auto">
                  {successMessage}
                </p>
                <button
                  onClick={() => setSuccessMessage('')}
                  className="mt-4 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#A8A0B8] mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Alex Rivera"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0B0710] border border-purple-500/20 text-white text-sm focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#A8A0B8] mb-1.5">
                      Brand / Company *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.brand}
                      onChange={(e) => setForm({ ...form, brand: e.target.value })}
                      placeholder="e.g. Ant Esports, Evofox"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0B0710] border border-purple-500/20 text-white text-sm focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#A8A0B8] mb-1.5">
                      Business Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="alex@brand.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0B0710] border border-purple-500/20 text-white text-sm focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#A8A0B8] mb-1.5">
                      Company Website / Product Link
                    </label>
                    <input
                      type="url"
                      value={form.website}
                      onChange={(e) => setForm({ ...form, website: e.target.value })}
                      placeholder="https://brand.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0B0710] border border-purple-500/20 text-white text-sm focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#A8A0B8] mb-1.5">
                    Collaboration Format
                  </label>
                  <select
                    value={form.collaborationType}
                    onChange={(e) => setForm({ ...form, collaborationType: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B0710] border border-purple-500/20 text-white text-sm focus:outline-none focus:border-purple-400 cursor-pointer"
                  >
                    <option value="Product Feature & Review">Product Feature &amp; Review</option>
                    <option value="Sponsored Instagram Reels">Sponsored Instagram Reels</option>
                    <option value="UGC-style Content">UGC-Style Content Creation</option>
                    <option value="Gaming Setup Tour Integration">Gaming Setup Tour Integration</option>
                    <option value="Product Demonstration">Product Demonstration / Benchmark</option>
                    <option value="Long-term Brand Ambassadorship">Long-term Brand Ambassadorship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#A8A0B8] mb-1.5">
                    Campaign Scope &amp; Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell me about the product you'd like to feature, delivery timelines, and budget/compensation model..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B0710] border border-purple-500/20 text-white text-sm focus:outline-none focus:border-purple-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-purple-900/40"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Submitting Proposal...' : 'GET IN TOUCH'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
