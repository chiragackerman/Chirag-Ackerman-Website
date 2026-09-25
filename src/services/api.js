/**
 * Client API service for communicating with Express backend.
 * Provides fallback to client defaults if API is in offline mode.
 */
import { initialProducts } from '../data/initialProducts.js';
import { initialCategories } from '../data/initialCategories.js';
import { initialStores } from '../data/initialStores.js';
import { defaultSiteConfig } from '../data/defaultSiteConfig.js';

const API_BASE = '/api';

export async function fetchProducts(filters = {}) {
  try {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== 'all') params.append('category', filters.category);
    if (filters.featured) params.append('featured', 'true');
    if (filters.search) params.append('search', filters.search);

    const res = await fetch(`${API_BASE}/products?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return await res.json();
  } catch (err) {
    console.warn('API fetchProducts fallback:', err.message);
    let list = [...initialProducts];
    if (filters.category && filters.category !== 'all') {
      list = list.filter(p => p.category === filters.category);
    }
    if (filters.featured) {
      list = list.filter(p => p.featured);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(p => p.name?.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q));
    }
    return list;
  }
}

export async function fetchProductById(id) {
  try {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) throw new Error('Product not found');
    return await res.json();
  } catch (err) {
    console.warn('API fetchProductById fallback:', err.message);
    return initialProducts.find(p => p.id === id) || null;
  }
}

export async function uploadProductImage({ dataUrl, fileName, mimeType }, token) {
  const res = await fetch(`${API_BASE}/upload/image`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ dataUrl, fileName, mimeType })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to upload product image');
  }
  return await res.json();
}

export async function createProduct(productData, token) {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(productData)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create product');
  }
  return await res.json();
}

export async function updateProduct(id, productData, token) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(productData)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to update product');
  }
  return await res.json();
}

export async function deleteProduct(id, token) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to delete product');
  }
  return await res.json();
}

export async function fetchCategories() {
  try {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return await res.json();
  } catch {
    return initialCategories;
  }
}

export async function fetchStores() {
  try {
    const res = await fetch(`${API_BASE}/stores`);
    if (!res.ok) throw new Error('Failed to fetch stores');
    return await res.json();
  } catch {
    return initialStores;
  }
}

export async function fetchSiteConfig() {
  try {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to fetch site settings');
    return await res.json();
  } catch {
    return defaultSiteConfig;
  }
}

export async function saveSiteConfig(config, token) {
  const res = await fetch(`${API_BASE}/settings`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(config)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to save settings');
  }
  return await res.json();
}

/**
 * First-party outbound click tracking.
 * Captures product, store, and outbound affiliate URL click.
 */
export async function recordOutboundClick(product, storeName, affiliateUrl) {
  const deviceCategory = window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop';
  const payload = {
    productId: product?.id || 'direct-store',
    productName: product?.name || 'Direct Storefront Link',
    store: storeName || product?.storeName || 'Amazon India',
    affiliateUrl: affiliateUrl || product?.affiliateUrl || '',
    referrer: window.location.pathname,
    deviceCategory
  };

  try {
    await fetch(`${API_BASE}/track-click`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (e) {
    // Keep outbound link opening seamless even if background telemetry request fails
    console.debug('Click recorded locally:', payload);
  }
}

export async function fetchAnalytics(token) {
  const res = await fetch(`${API_BASE}/analytics`, {
    credentials: 'include'
  });
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return await res.json();
}

export async function loginAdmin(credentials) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Login failed');
  }
  return await res.json();
}

export async function fetchAdminSession() {
  const res = await fetch(`${API_BASE}/auth/session`, { credentials: 'include' });
  if (!res.ok) return null;
  return await res.json();
}

export async function logoutAdmin() {
  const res = await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    credentials: 'include'
  });
  if (!res.ok) throw new Error('Logout failed');
}

export async function submitCollab(data) {
  const res = await fetch(`${API_BASE}/collaborate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to submit proposal');
  }
  return await res.json();
}

export async function fetchCollaborationInquiries(token) {
  const res = await fetch(`${API_BASE}/collaborate`, {
    credentials: 'include'
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch collaboration inquiries');
  }
  return await res.json();
}

export async function updateCollaborationInquiryStatus(id, status, token) {
  const res = await fetch(`${API_BASE}/collaborate/${id}/status`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to update inquiry status');
  }
  return await res.json();
}

export async function deleteCollaborationInquiry(id, token) {
  const res = await fetch(`${API_BASE}/collaborate/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to delete inquiry');
  }
  return await res.json();
}

export async function submitContact(data) {
  const res = await fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to send message');
  }
  return await res.json();
}
