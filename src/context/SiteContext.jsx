import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  fetchProducts,
  fetchCategories,
  fetchStores,
  fetchSiteConfig,
  saveSiteConfig,
  recordOutboundClick
} from '../services/api.js';
import { defaultSiteConfig } from '../data/defaultSiteConfig.js';

const SiteContext = createContext(null);

export function SiteProvider({ children }) {
  const [siteConfig, setSiteConfig] = useState(defaultSiteConfig);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [configData, prodsData, catsData, storesData] = await Promise.all([
        fetchSiteConfig(),
        fetchProducts(),
        fetchCategories(),
        fetchStores()
      ]);
      setSiteConfig(configData || defaultSiteConfig);
      setProducts(prodsData || []);
      setCategories(catsData || []);
      setStores(storesData || []);
    } catch (err) {
      console.error('Error loading initial site data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateConfig = async (newConfig, token) => {
    const updated = await saveSiteConfig(newConfig, token);
    setSiteConfig(updated);
    return updated;
  };

  const trackAndOpenAffiliate = (product, targetUrl, storeName) => {
    const finalUrl = targetUrl || product?.affiliateUrl;
    if (!finalUrl) return;

    // Trigger asynchronous first-party tracking
    recordOutboundClick(product, storeName, finalUrl);

    // Open target affiliate link in new tab safely
    window.open(finalUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <SiteContext.Provider
      value={{
        siteConfig,
        products,
        categories,
        stores,
        loading,
        refreshData: loadData,
        updateConfig,
        trackAndOpenAffiliate
      }}
    >
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return ctx;
}
