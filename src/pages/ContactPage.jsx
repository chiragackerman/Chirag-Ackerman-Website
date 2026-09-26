import React, { useState } from 'react';
import { useSite } from '../context/SiteContext.jsx';
import { submitContact } from '../services/api.js';
import SEOHead from '../components/SEOHead.jsx';
import { Mail, Instagram, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function ContactPage() {
  const { siteConfig } = useSite();

  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setErrorMessage('Please fill in your name, email, and message.');
      return;
    }

    if (!form.email.includes('@') || !form.email.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitContact(form);
      setSuccessMessage(res.message || 'Message sent! Chirag will get back to you soon.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to send message. Please email chiragackerman1112@gmail.com directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 pt-20 sm:pt-24 pb-12 space-y-8 sm:space-y-10 text-left">
      <SEOHead
        title="Contact — CHIRAG ACKERMAN | Get In Touch"
        description="Send direct inquiries to CHIRAG ACKERMAN regarding gaming peripheral recommendations, desk setup questions, or creator collaborations."
        canonicalPath="/#contact"
        schema={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Contact CHIRAG ACKERMAN",
          "description": "Send questions or hardware recommendations to CHIRAG ACKERMAN.",
          "url": "https://chiragackerman.dev/#contact"
        }}
      />

      <div className="max-w-3xl space-y-2.5">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-purple-400 font-semibold">
          <Mail className="w-3.5 h-3.5" />
          <span>Direct Connection</span>
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
          GET IN TOUCH
        </h1>
        <p className="text-xs sm:text-sm text-[#A8A0B8]">
          Have questions about a peripheral review, custom desk build, or gaming accessory recommendations? Send a message directly to my inbox.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact info cards */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-6 rounded-2xl bg-[#120D1A] border border-purple-500/15 space-y-2">
            <span className="text-xs uppercase font-bold tracking-wider text-purple-400">
              Direct Inquiries
            </span>
            <div className="flex items-center gap-3 pt-1">
              <Mail className="w-5 h-5 text-purple-400" />
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-base font-semibold text-white hover:text-purple-300 transition-colors"
              >
                {siteConfig.email}
              </a>
            </div>
            <p className="text-xs text-[#A8A0B8] pt-1">
              For tech queries, creator inquiries, and hardware questions.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#120D1A] border border-purple-500/15 space-y-2">
            <span className="text-xs uppercase font-bold tracking-wider text-purple-400">
              Social Community
            </span>
            <div className="flex items-center gap-3 pt-1">
              <Instagram className="w-5 h-5 text-pink-400" />
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-semibold text-white hover:text-pink-300 transition-colors"
              >
                {siteConfig.instagramHandle}
              </a>
            </div>
            <p className="text-xs text-[#A8A0B8] pt-1">
              Daily setup reels, sound tests, and community DMs on Instagram.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#120D1A] border border-purple-500/15 space-y-2">
            <span className="text-xs uppercase font-bold tracking-wider text-purple-400">
              Studio Location
            </span>
            <div className="flex items-center gap-3 pt-1">
              <MapPin className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-semibold text-white">
                {siteConfig.location}
              </span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#120D1A] border border-purple-500/20 purple-glow">
            {successMessage ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="font-display font-bold text-xl text-white">Message Sent</h3>
                <p className="text-sm text-[#A8A0B8] max-w-sm mx-auto">{successMessage}</p>
                <button
                  onClick={() => setSuccessMessage('')}
                  className="mt-3 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold cursor-pointer"
                >
                  Send Another Message
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
                      placeholder="Your name"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0B0710] border border-purple-500/20 text-white text-sm focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#A8A0B8] mb-1.5">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@domain.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0B0710] border border-purple-500/20 text-white text-sm focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#A8A0B8] mb-1.5">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="e.g. Question about your mechanical keyboard setup"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B0710] border border-purple-500/20 text-white text-sm focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#A8A0B8] mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Write your note here..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B0710] border border-purple-500/20 text-white text-sm focus:outline-none focus:border-purple-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-purple-900/40"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Sending...' : 'SEND MESSAGE'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
