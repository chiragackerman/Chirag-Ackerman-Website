import { useEffect } from 'react';

/**
 * Lightweight, zero-dependency client-side SEO manager.
 * Dynamically synchronizes document title, meta description, robots,
 * canonical link, Open Graph, Twitter cards, and Schema.org JSON-LD.
 */
export default function SEOHead({
  title = 'CHIRAG ACKERMAN — Gaming, Coding & Tech',
  description = 'CHIRAG ACKERMAN — gaming, coding and tech creator sharing gaming gear, setup essentials, product recommendations and creator-focused tech.',
  image = '/chirag_official_logo.jpg',
  canonicalPath = '',
  type = 'website',
  noindex = false,
  schema = null
}) {
  useEffect(() => {
    // 1. Resolve site origin (default to production domain if in local testing)
    const isLocal = typeof window !== 'undefined' && (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.includes('.internal')
    );
    const origin = isLocal
      ? (import.meta.env.VITE_SITE_URL || 'https://chiragackerman.dev')
      : window.location.origin;

    const normalizedPath = canonicalPath
      ? (canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`)
      : '';
    const canonicalUrl = `${origin}${normalizedPath}`;

    // Resolve full image URL for social crawlers
    const fullImageUrl = image?.startsWith('http://') || image?.startsWith('https://')
      ? image
      : `${origin}${image?.startsWith('/') ? image : `/${image || 'chirag_official_logo.jpg'}`}`;

    // 2. Set document title
    document.title = title;

    // Helper to create or update meta tags
    const setMeta = (attrName, attrValue, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // 3. Description & Robots
    setMeta('name', 'description', description);
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');

    // 4. Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // 5. OpenGraph Tags
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:image', fullImageUrl);
    setMeta('property', 'og:site_name', 'CHIRAG ACKERMAN');

    // 6. Twitter Card Tags
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', fullImageUrl);

    // 7. Schema.org Structured Data (JSON-LD)
    const scriptId = 'json-ld-structured-data';
    let scriptTag = document.getElementById(scriptId);
    if (schema) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = scriptId;
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schema);
    } else if (scriptTag) {
      scriptTag.remove();
    }

    return () => {
      // Optional cleanup on unmount
      const existingScript = document.getElementById(scriptId);
      if (existingScript) existingScript.remove();
    };
  }, [title, description, image, canonicalPath, type, noindex, schema]);

  return null;
}
