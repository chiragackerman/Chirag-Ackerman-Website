import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useSite } from '../context/SiteContext.jsx';
import {
  fetchAnalytics,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  fetchCollaborationInquiries,
  updateCollaborationInquiryStatus,
  deleteCollaborationInquiry
} from '../services/api.js';
import {
  ShieldCheck,
  Package,
  Layers,
  BarChart3,
  Settings,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Check,
  X,
  AlertCircle,
  Sparkles,
  MousePointerClick,
  TrendingUp,
  Smartphone,
  Laptop,
  LogOut,
  Lock,
  Eye,
  EyeOff,
  Mail,
  Upload,
  Link2,
  Image as ImageIcon,
  CheckCircle2,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { formatPrice, formatDate } from '../utils/formatters.js';
import { setupTourTags } from '../data/setupTourTags.js';

export default function AdminDashboardPage({ onNavigate }) {
  const { adminUser, isAuthenticated, authLoading, login, logout } = useAuth();
  const { siteConfig, updateConfig, products, categories, refreshData } = useSite();

  const [activeTab, setActiveTab] = useState('overview');

  // Auth Form State
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Analytics Data
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [inquiries, setInquiries] = useState([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  // Product Editing / Modal State
  const [editingProduct, setEditingProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productFormError, setProductFormError] = useState('');
  const [productFormLoading, setProductFormLoading] = useState(false);

  // Site Settings Form State
  const [settingsForm, setSettingsForm] = useState({ ...siteConfig });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Product Form Initial Fields
  const [productFormData, setProductFormData] = useState({
    name: '',
    brand: '',
    shortDescription: '',
    description: '',
    image: '',
    imageUrl: '',
    category: 'setup-workspace',
    categoryName: 'Setup & Workspace',
    platform: 'Amazon',
    storeName: 'Amazon India',
    affiliateUrl: '',
    couponCode: '',
    price: '',
    currency: '₹',
    originalPrice: '',
    featured: false,
    published: true,
    showInMySetup: false,
    setupTags: [],
    tagsString: '',
    specsString: ''
  });

  // Product Image Two Options State
  const [imageInputMode, setImageInputMode] = useState('upload'); // 'upload' | 'url'
  const [uploadedFileInfo, setUploadedFileInfo] = useState(null); // { name, size, previewUrl, status, errorMsg, provider }
  const [urlInput, setUrlInput] = useState('');
  const [urlImageStatus, setUrlImageStatus] = useState('idle'); // 'idle' | 'loading' | 'valid' | 'error'
  const [urlImageError, setUrlImageError] = useState('');

  useEffect(() => {
    if (siteConfig) {
      setSettingsForm({ ...siteConfig });
    }
  }, [siteConfig]);

  useEffect(() => {
    if (isAuthenticated && (activeTab === 'overview' || activeTab === 'analytics')) {
      loadAnalyticsData();
    }
    if (isAuthenticated && activeTab === 'inquiries') {
      loadInquiriesData();
    }
  }, [isAuthenticated, activeTab]);

  const loadAnalyticsData = async () => {
    setAnalyticsLoading(true);
    try {
      const data = await fetchAnalytics();
      setAnalytics(data);
    } catch (e) {
      console.warn('Analytics loading error:', e);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const loadInquiriesData = async () => {
    setInquiriesLoading(true);
    try {
      const data = await fetchCollaborationInquiries();
      setInquiries(data || []);
    } catch (e) {
      console.warn('Inquiries loading error:', e);
      setInquiries([]);
    } finally {
      setInquiriesLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateCollaborationInquiryStatus(id, status);
      setInquiries((prev) => prev.map((item) => item.inquiryId === id ? { ...item, status } : item));
      if (selectedInquiry && selectedInquiry.inquiryId === id) {
        setSelectedInquiry((prev) => ({ ...prev, status }));
      }
    } catch (e) {
      console.error('Status update error:', e);
      alert(e.message || 'Failed to update inquiry status');
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (!window.confirm('Delete this collaboration inquiry?')) return;
    try {
      await deleteCollaborationInquiry(id);
      setInquiries((prev) => prev.filter((item) => item.inquiryId !== id));
      if (selectedInquiry && selectedInquiry.inquiryId === id) {
        setSelectedInquiry(null);
      }
    } catch (e) {
      console.error('Inquiry delete error:', e);
      alert(e.message || 'Failed to delete inquiry');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setLoginLoading(true);
    try {
      await login({ email: authEmail, password: authPassword });
    } catch (err) {
      setAuthError(err.message || 'Invalid credentials');
    } finally {
      setLoginLoading(false);
    }
  };

  // Product Management Handlers
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductFormData({
      name: '',
      brand: '',
      shortDescription: '',
      description: '',
      image: '',
      imageUrl: '',
      category: categories[0]?.slug || 'setup-workspace',
      categoryName: categories[0]?.name || 'Setup & Workspace',
      platform: 'Amazon',
      storeName: 'Amazon India',
      affiliateUrl: '',
      couponCode: '',
      price: '',
      currency: '₹',
      originalPrice: '',
      featured: false,
      published: true,
      showInMySetup: false,
      setupTags: [],
      tagsString: '',
      specsString: ''
    });
    setImageInputMode('upload');
    setUploadedFileInfo(null);
    setUrlInput('');
    setUrlImageStatus('idle');
    setUrlImageError('');
    setProductFormError('');
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    const existingImg = prod.imageUrl || prod.image || '';
    const isExternalUrl = existingImg.startsWith('http://') || existingImg.startsWith('https://');

    setProductFormData({
      name: prod.name || '',
      brand: prod.brand || '',
      shortDescription: prod.shortDescription || '',
      description: prod.description || '',
      image: existingImg,
      imageUrl: existingImg,
      category: prod.category || 'setup-workspace',
      categoryName: prod.categoryName || 'Setup & Workspace',
      platform: prod.platform || 'Amazon',
      storeName: prod.storeName || 'Amazon India',
      affiliateUrl: prod.affiliateUrl || '',
      couponCode: prod.couponCode || '',
      price: prod.price !== null && prod.price !== undefined ? prod.price : '',
      currency: prod.currency || '₹',
      originalPrice: prod.originalPrice || '',
      featured: !!prod.featured,
      published: prod.published !== false,
      showInMySetup: prod.showInMySetup === true,
      setupTags: prod.showInMySetup === true && Array.isArray(prod.setupTags) ? prod.setupTags : [],
      tagsString: prod.tags ? prod.tags.join(', ') : '',
      specsString: prod.specifications
        ? prod.specifications.map((s) => `${s.key}: ${s.value}`).join('\n')
        : ''
    });

    if (isExternalUrl) {
      setImageInputMode('url');
      setUrlInput(existingImg);
      setUrlImageStatus('valid');
      setUrlImageError('');
      setUploadedFileInfo(null);
    } else if (existingImg) {
      setImageInputMode('upload');
      setUploadedFileInfo({
        name: `${prod.name || 'Product'} Image`,
        size: 'Current image',
        previewUrl: existingImg,
        status: 'success'
      });
      setUrlInput('');
      setUrlImageStatus('idle');
      setUrlImageError('');
    } else {
      setImageInputMode('upload');
      setUploadedFileInfo(null);
      setUrlInput('');
      setUrlImageStatus('idle');
      setUrlImageError('');
    }

    setProductFormError('');
    setIsProductModalOpen(true);
  };

  const handleSwitchImageMode = (mode) => {
    setImageInputMode(mode);
    setProductFormError('');
    if (mode === 'upload') {
      const activeUploadImg = uploadedFileInfo?.previewUrl || '';
      setProductFormData((prev) => ({
        ...prev,
        image: activeUploadImg,
        imageUrl: activeUploadImg
      }));
    } else {
      const activeUrl = urlInput.trim();
      setProductFormData((prev) => ({
        ...prev,
        image: activeUrl,
        imageUrl: activeUrl
      }));
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = '';

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      setProductFormError('Unsupported file type. Supported formats: JPG, JPEG, PNG, WEBP.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setProductFormError('File size exceeds the 10MB limit. Please choose a smaller image.');
      return;
    }

    setProductFormError('');

    const formattedSize = file.size > 1024 * 1024
      ? (file.size / (1024 * 1024)).toFixed(1) + ' MB'
      : Math.round(file.size / 1024) + ' KB';

    const localPreview = URL.createObjectURL(file);

    setUploadedFileInfo({
      name: file.name,
      size: formattedSize,
      previewUrl: localPreview,
      status: 'uploading',
      errorMsg: ''
    });

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const uploadRes = await uploadProductImage({
          dataUrl: reader.result,
          fileName: file.name,
          mimeType: file.type
        });

        const hostedUrl = uploadRes.url || uploadRes.imageUrl;
        setUploadedFileInfo((prev) => ({
          ...prev,
          previewUrl: hostedUrl,
          status: 'success',
          provider: uploadRes.provider
        }));
        setProductFormData((prev) => ({
          ...prev,
          image: hostedUrl,
          imageUrl: hostedUrl
        }));
      } catch (err) {
        console.error('Image upload error:', err);
        setUploadedFileInfo((prev) => ({
          ...prev,
          status: 'error',
          errorMsg: err.message || 'Image upload failed.'
        }));
        setProductFormError(err.message || 'Image upload failed. Please try again.');
      }
    };

    reader.onerror = () => {
      setProductFormError('Failed to read image file from disk.');
      setUploadedFileInfo(null);
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveUploadedImage = () => {
    setUploadedFileInfo(null);
    setProductFormData((prev) => ({
      ...prev,
      image: '',
      imageUrl: ''
    }));
  };

  const handleUrlInputChange = (val) => {
    setUrlInput(val);
    setUrlImageError('');
    const trimmed = val.trim();

    if (!trimmed) {
      setUrlImageStatus('idle');
      setProductFormData((prev) => ({
        ...prev,
        image: '',
        imageUrl: ''
      }));
      return;
    }

    try {
      const parsed = new URL(trimmed);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        setUrlImageStatus('error');
        setUrlImageError('URL must begin with http:// or https://');
        return;
      }
    } catch {
      setUrlImageStatus('error');
      setUrlImageError('Invalid URL format. Example: https://example.com/product.jpg');
      return;
    }

    setUrlImageStatus('loading');
    setProductFormData((prev) => ({
      ...prev,
      image: trimmed,
      imageUrl: trimmed
    }));
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setProductFormError('');

    if (!productFormData.name.trim() || !productFormData.brand.trim() || !productFormData.affiliateUrl.trim()) {
      setProductFormError('Product Name, Brand, and Affiliate URL are mandatory.');
      return;
    }

    if (productFormData.showInMySetup && productFormData.setupTags.length === 0) {
      setProductFormError('Select at least one Setup Tour Tag to show this product in My Setup.');
      return;
    }

    try {
      new URL(productFormData.affiliateUrl);
    } catch {
      setProductFormError('Please enter a valid affiliate URL (e.g. https://amazon.in/dp/...)');
      return;
    }

    if (imageInputMode === 'upload' && uploadedFileInfo?.status === 'uploading') {
      setProductFormError('Please wait for the image upload to complete before saving.');
      return;
    }

    if (imageInputMode === 'url' && urlInput.trim() && urlImageStatus === 'error') {
      setProductFormError('The image URL could not be verified. Please check the URL or provide an accessible link.');
      return;
    }

    // Determine final image URL
    let finalImage = '';
    if (imageInputMode === 'upload') {
      finalImage = (uploadedFileInfo?.previewUrl || productFormData.imageUrl || productFormData.image || '').trim();
    } else {
      finalImage = urlInput.trim();
    }

    // Parse tags
    const tags = productFormData.tagsString
      ? productFormData.tagsString.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    // Parse specifications from key: value lines
    const specifications = productFormData.specsString
      ? productFormData.specsString
          .split('\n')
          .map((line) => {
            const parts = line.split(':');
            if (parts.length >= 2) {
              return { key: parts[0].trim(), value: parts.slice(1).join(':').trim() };
            }
            return null;
          })
          .filter(Boolean)
      : [];

    const matchedCategory = categories.find((c) => (c.slug || c.id) === productFormData.category);

    const payload = {
      name: productFormData.name.trim(),
      brand: productFormData.brand.trim(),
      shortDescription: productFormData.shortDescription.trim(),
      description: productFormData.description.trim(),
      image: finalImage,
      imageUrl: finalImage,
      category: productFormData.category,
      categoryName: matchedCategory?.name || productFormData.category,
      platform: productFormData.platform,
      storeName: productFormData.storeName,
      affiliateUrl: productFormData.affiliateUrl.trim(),
      couponCode: productFormData.couponCode.trim(),
      price: productFormData.price !== '' ? Number(productFormData.price) : null,
      currency: productFormData.currency || '₹',
      originalPrice: productFormData.originalPrice !== '' ? Number(productFormData.originalPrice) : null,
      featured: productFormData.featured,
      published: productFormData.published,
      showInMySetup: Boolean(productFormData.showInMySetup),
      setupTags: productFormData.showInMySetup ? [...productFormData.setupTags] : [],
      tags,
      specifications
    };

    setProductFormLoading(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
      } else {
        await createProduct(payload);
      }
      await refreshData();
      setIsProductModalOpen(false);
    } catch (err) {
      setProductFormError(err.message || 'Failed to save product');
    } finally {
      setProductFormLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      await refreshData();
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
  };

  const handleTogglePublish = async (prod) => {
    try {
      await updateProduct(prod.id, { published: !prod.published });
      await refreshData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleFeatured = async (prod) => {
    try {
      await updateProduct(prod.id, { featured: !prod.featured });
      await refreshData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Site Settings Handler
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await updateConfig(settingsForm);
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
    } catch (err) {
      alert(err.message || 'Failed to save site settings');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 pt-24 pb-16">
        <Loader2 className="w-8 h-8 text-purple-300 animate-spin" aria-label="Checking authentication" />
      </div>
    );
  }

  // If not authenticated, render Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 pt-24 pb-16">
        <div className="w-full max-w-md p-8 rounded-3xl bg-[#120D1A] border border-purple-500/25 purple-glow space-y-6 text-left">
          <div className="space-y-2 text-center">
            <div className="w-12 h-12 rounded-2xl bg-purple-950/70 border border-purple-400/30 flex items-center justify-center text-purple-300 mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="font-display font-black text-2xl text-white">
              Creator Admin Portal
            </h1>
            <p className="text-xs text-[#A8A0B8]">
              Manage products, track affiliate clicks, and update site configuration for Chirag Ackerman.
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <div className="relative flex items-center justify-center">
            <span className="h-px bg-purple-900/40 w-full" />
            <span className="px-3 bg-[#120D1A] text-[11px] uppercase tracking-wider text-[#A8A0B8] shrink-0 font-medium">
              Or password login
            </span>
            <span className="h-px bg-purple-900/40 w-full" />
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#A8A0B8] mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0710] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#A8A0B8] mb-1">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="Enter your password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0710] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 rounded-xl bg-[#171020] hover:bg-purple-950/50 border border-purple-500/25 text-purple-200 font-semibold text-xs transition-colors cursor-pointer"
            >
              {loginLoading ? 'Verifying...' : 'Login with Credentials'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard Layout
  return (
    <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 pt-20 sm:pt-24 pb-12 space-y-6 sm:space-y-8 text-left">
      {/* Top Header & Admin Profile */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-purple-900/30 pb-5 sm:pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-purple-400 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Authenticated Creator Portal</span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
            ADMIN DASHBOARD
          </h1>
          <p className="text-xs text-[#A8A0B8] mt-0.5">
            Logged in as <span className="text-white font-semibold">{adminUser?.name || 'Chirag Ackerman'}</span> ({adminUser?.email})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('shop')}
            className="px-4 py-2 rounded-xl bg-[#171020] hover:bg-purple-950/40 border border-purple-500/25 text-xs text-purple-300 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Live Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-xs text-red-300 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-purple-900/20 text-xs">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'products', label: `Products (${products.length})`, icon: Package },
          { id: 'categories', label: `Categories (${categories.length})`, icon: Layers },
          { id: 'inquiries', label: `Collaboration Inquiries (${inquiries.length})`, icon: Mail },
          { id: 'analytics', label: 'Click Analytics', icon: MousePointerClick },
          { id: 'settings', label: 'Site Settings', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl font-semibold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                  : 'text-[#A8A0B8] hover:text-white hover:bg-[#120D1A]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-[#120D1A] border border-purple-500/15 space-y-1">
              <span className="text-xs uppercase font-bold tracking-wider text-[#A8A0B8]">
                Total Catalog Products
              </span>
              <div className="text-3xl font-black text-white font-mono-nums">
                {products.length}
              </div>
              <span className="text-xs text-purple-300">
                {products.filter((p) => p.featured).length} marked featured
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#120D1A] border border-purple-500/15 space-y-1">
              <span className="text-xs uppercase font-bold tracking-wider text-[#A8A0B8]">
                Outbound Affiliate Clicks
              </span>
              <div className="text-3xl font-black text-white font-mono-nums">
                {analytics?.totalClicks || 0}
              </div>
              <span className="text-xs text-purple-300">
                Direct retailer referrals
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#120D1A] border border-purple-500/15 space-y-1">
              <span className="text-xs uppercase font-bold tracking-wider text-[#A8A0B8]">
                Active Categories
              </span>
              <div className="text-3xl font-black text-white font-mono-nums">
                {categories.length}
              </div>
              <span className="text-xs text-purple-300">Mice, Keyboards, Audio...</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#120D1A] border border-purple-500/15 space-y-1">
              <span className="text-xs uppercase font-bold tracking-wider text-[#A8A0B8]">
                Primary Storefront
              </span>
              <div className="text-lg font-bold text-white truncate">
                Amazon India
              </div>
              <span className="text-xs text-amber-400">Official Creator Program</span>
            </div>
          </div>

          {/* Quick Actions & Recent Clicks */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 p-6 rounded-2xl bg-[#120D1A] border border-purple-500/15 space-y-4">
              <h3 className="font-display font-bold text-lg text-white">
                Quick Actions
              </h3>
              <div className="space-y-2.5">
                <button
                  onClick={handleOpenAddProduct}
                  className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#171020] hover:bg-purple-950/40 border border-purple-500/25 text-purple-200 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Update Site Settings &amp; Stats</span>
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#171020] hover:bg-purple-950/40 border border-purple-500/25 text-purple-200 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Inspect Full Click Analytics</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-8 p-6 rounded-2xl bg-[#120D1A] border border-purple-500/15 space-y-4">
              <h3 className="font-display font-bold text-lg text-white">
                Recent Outbound Click Events
              </h3>
              {analytics?.recentClicks && analytics.recentClicks.length > 0 ? (
                <div className="space-y-2">
                  {analytics.recentClicks.slice(0, 5).map((clk, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-[#0B0710] border border-purple-500/10 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <span className="font-semibold text-white block">
                          {clk.productName}
                        </span>
                        <span className="text-[#A8A0B8]">
                          {clk.store} · {clk.deviceCategory}
                        </span>
                      </div>
                      <span className="text-purple-400 font-mono text-[11px]">
                        {formatDate(clk.timestamp)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#A8A0B8]">
                  No outbound clicks recorded yet. Clicks will populate in real time as visitors explore products.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-bold text-2xl text-white">
                Affiliate Products Catalog
              </h2>
              <p className="text-xs text-[#A8A0B8]">
                Add, edit, or publish products. All changes reflect instantly on the live storefront.
              </p>
            </div>
            <button
              onClick={handleOpenAddProduct}
              className="py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs tracking-wider uppercase flex items-center gap-1.5 cursor-pointer transition-colors shadow-md shadow-purple-900/40"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>

          <div className="rounded-2xl border border-purple-500/15 overflow-hidden bg-[#120D1A]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#171020] text-[#A8A0B8] uppercase tracking-wider font-semibold border-b border-purple-900/20">
                  <tr>
                    <th className="p-3.5">Product &amp; Brand</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Platform</th>
                    <th className="p-3.5">Price</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-900/15">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-purple-950/20 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          {(prod.imageUrl || prod.image) ? (
                            <img
                              src={prod.imageUrl || prod.image}
                              alt={prod.name}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-lg object-cover bg-[#171020] border border-purple-500/20 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-[#171020] border border-purple-500/20 flex items-center justify-center shrink-0 text-purple-400">
                              <Package className="w-5 h-5 opacity-40" />
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-white text-sm line-clamp-1">{prod.name}</div>
                            <div className="text-[11px] text-purple-300">{prod.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 text-[#A8A0B8]">
                        {prod.categoryName || prod.category}
                      </td>
                      <td className="p-3.5 text-white">
                        {prod.storeName || prod.platform}
                      </td>
                      <td className="p-3.5 font-mono-nums text-white">
                        {formatPrice(prod.price, prod.currency) || '—'}
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleTogglePublish(prod)}
                            title={prod.published ? 'Published (click to unpublish)' : 'Unpublished (click to publish)'}
                            className={`p-1 rounded cursor-pointer ${
                              prod.published ? 'text-emerald-400 bg-emerald-950/40' : 'text-[#A8A0B8] bg-gray-900'
                            }`}
                          >
                            {prod.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => handleToggleFeatured(prod)}
                            title={prod.featured ? 'Featured' : 'Not featured'}
                            className={`p-1 rounded cursor-pointer ${
                              prod.featured ? 'text-amber-400 bg-amber-950/40' : 'text-[#A8A0B8]/40'
                            }`}
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditProduct(prod)}
                            className="p-1.5 rounded-lg text-purple-300 hover:bg-purple-900/40 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-950/50 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: COLLABORATION INQUIRIES */}
      {activeTab === 'inquiries' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-bold text-2xl text-white">
                Collaboration Inquiries
              </h2>
              <p className="text-xs text-[#A8A0B8]">
                Review, update, and manage submitted brand partnership requests.
              </p>
            </div>
          </div>

          {inquiriesLoading ? (
            <div className="p-6 rounded-2xl bg-[#120D1A] border border-purple-500/15 text-xs text-[#A8A0B8]">
              Loading inquiries...
            </div>
          ) : inquiries.length === 0 ? (
            <div className="p-6 rounded-2xl bg-[#120D1A] border border-purple-500/15 text-xs text-[#A8A0B8]">
              No collaboration inquiries have been submitted yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-[1.1fr,0.9fr] gap-6">
              <div className="rounded-2xl border border-purple-500/15 overflow-hidden bg-[#120D1A]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#171020] text-[#A8A0B8] uppercase tracking-wider font-semibold border-b border-purple-900/20">
                      <tr>
                        <th className="p-3.5">Brand</th>
                        <th className="p-3.5">Contact</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-900/15">
                      {inquiries.map((inquiry) => (
                        <tr
                          key={inquiry.inquiryId}
                          className={`hover:bg-purple-950/20 transition-colors cursor-pointer ${selectedInquiry?.inquiryId === inquiry.inquiryId ? 'bg-purple-950/20' : ''}`}
                          onClick={() => setSelectedInquiry(inquiry)}
                        >
                          <td className="p-3.5">
                            <div className="font-bold text-white text-sm">{inquiry.brand}</div>
                            <div className="text-[11px] text-purple-300">{inquiry.collaborationType}</div>
                          </td>
                          <td className="p-3.5 text-[#A8A0B8]">
                            <div>{inquiry.name}</div>
                            <div className="text-[11px] text-purple-300">{inquiry.email}</div>
                          </td>
                          <td className="p-3.5">
                            <span className="inline-flex px-2 py-1 rounded-full border border-purple-500/25 bg-[#171020] text-purple-300 text-[10px] uppercase tracking-wider">
                              {inquiry.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-[#A8A0B8]">
                            {formatDate(inquiry.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-2xl bg-[#120D1A] border border-purple-500/15 p-5 space-y-4">
                {selectedInquiry ? (
                  <>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[11px] uppercase tracking-wider text-purple-400">Inquiry Details</div>
                        <h3 className="font-display font-bold text-xl text-white mt-1">{selectedInquiry.brand}</h3>
                      </div>
                      <button
                        onClick={() => handleDeleteInquiry(selectedInquiry.inquiryId)}
                        className="p-2 rounded-lg text-red-400 hover:bg-red-950/50 cursor-pointer"
                        title="Delete inquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3 text-xs text-[#A8A0B8]">
                      <div>
                        <span className="font-semibold text-white block">Contact person</span>
                        <span>{selectedInquiry.name}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-white block">Email</span>
                        <span>{selectedInquiry.email}</span>
                      </div>
                      {selectedInquiry.website && (
                        <div>
                          <span className="font-semibold text-white block">Website / Social</span>
                          <a href={selectedInquiry.website} target="_blank" rel="noreferrer" className="text-purple-300 hover:underline break-all">
                            {selectedInquiry.website}
                          </a>
                        </div>
                      )}
                      <div>
                        <span className="font-semibold text-white block">Collaboration type</span>
                        <span>{selectedInquiry.collaborationType}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-white block">Submitted</span>
                        <span>{formatDate(selectedInquiry.createdAt)}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-white block">Message</span>
                        <p className="text-[#A8A0B8] whitespace-pre-wrap leading-relaxed">
                          {selectedInquiry.message}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-purple-900/20">
                      <label className="block text-[11px] uppercase tracking-wider text-[#A8A0B8] mb-2">
                        Update Status
                      </label>
                      <select
                        value={selectedInquiry.status}
                        onChange={(e) => handleStatusChange(selectedInquiry.inquiryId, e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0710] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400 cursor-pointer"
                      >
                        {['New', 'Contacted', 'In Discussion', 'Accepted', 'Rejected', 'Completed'].map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-[#A8A0B8] pt-8 text-center">
                    Select an inquiry to view full details.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-2xl text-white">
              Gear Categories
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div
                key={cat.slug || cat.id}
                className="p-5 rounded-2xl bg-[#120D1A] border border-purple-500/15 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-base text-white">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] font-mono text-purple-400">
                    {cat.slug}
                  </span>
                </div>
                <p className="text-xs text-[#A8A0B8] leading-relaxed">
                  {cat.description}
                </p>
                <div className="pt-2 text-[11px] text-purple-300/80">
                  Associated products: {products.filter((p) => p.category === (cat.slug || cat.id)).length}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: CLICK ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          <div className="space-y-1">
            <h2 className="font-display font-bold text-2xl text-white">
              First-Party Outbound Click Analytics
            </h2>
            <p className="text-xs text-[#A8A0B8]">
              Tracks when visitors click affiliate buttons to visit retailer stores.
            </p>
          </div>

          {/* Privacy & Affiliate Notice */}
          <div className="p-4 rounded-xl bg-[#120D1A] border border-purple-500/20 text-xs text-[#A8A0B8] space-y-1">
            <span className="font-bold text-purple-300 uppercase tracking-wider block">
              Important Measurement Notice
            </span>
            <p>
              This dashboard records first-party outbound redirect telemetry (clicks). Actual confirmed purchases, completed orders, and earned commissions are reported independently by Amazon Associates, brand affiliate portals, and respective network dashboards.
            </p>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#120D1A] border border-purple-500/15 space-y-2">
              <span className="text-xs uppercase font-bold tracking-wider text-[#A8A0B8]">
                Total Outbound Clicks
              </span>
              <div className="text-4xl font-black text-white font-mono-nums">
                {analytics?.totalClicks || 0}
              </div>
              <span className="text-xs text-purple-400">All-time tracked links</span>
            </div>

            <div className="p-6 rounded-2xl bg-[#120D1A] border border-purple-500/15 space-y-2">
              <span className="text-xs uppercase font-bold tracking-wider text-[#A8A0B8]">
                Desktop vs Mobile
              </span>
              <div className="text-sm font-semibold text-white space-y-1 pt-1 font-mono-nums">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-[#A8A0B8]">
                    <Laptop className="w-3.5 h-3.5" /> Desktop
                  </span>
                  <span>{analytics?.deviceBreakdown?.desktop || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-[#A8A0B8]">
                    <Smartphone className="w-3.5 h-3.5" /> Mobile
                  </span>
                  <span>{analytics?.deviceBreakdown?.mobile || 0}</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#120D1A] border border-purple-500/15 space-y-2">
              <span className="text-xs uppercase font-bold tracking-wider text-[#A8A0B8]">
                Top Destination Store
              </span>
              <div className="text-xl font-bold text-white truncate">
                {analytics?.storeBreakdown?.[0]?.store || 'Amazon India'}
              </div>
              <span className="text-xs text-purple-400">
                {analytics?.storeBreakdown?.[0]?.count || 0} clicks routed
              </span>
            </div>
          </div>

          {/* Top Clicked Gear Table */}
          <div className="p-6 rounded-2xl bg-[#120D1A] border border-purple-500/15 space-y-4">
            <h3 className="font-display font-bold text-lg text-white">
              Top Clicked Products
            </h3>
            {analytics?.topProducts && analytics.topProducts.length > 0 ? (
              <div className="space-y-2">
                {analytics.topProducts.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#0B0710] border border-purple-500/10 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-md bg-purple-950 text-purple-300 font-bold flex items-center justify-center font-mono">
                        0{idx + 1}
                      </span>
                      <span className="font-semibold text-white">{p.name}</span>
                    </div>
                    <span className="font-mono font-bold text-purple-300 font-mono-nums">
                      {p.count} {p.count === 1 ? 'click' : 'clicks'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#A8A0B8]">No top clicked products yet.</p>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: SITE SETTINGS */}
      {activeTab === 'settings' && (
        <div className="space-y-6 max-w-4xl">
          <div className="space-y-1">
            <h2 className="font-display font-bold text-2xl text-white">
              Global Site Settings
            </h2>
            <p className="text-xs text-[#A8A0B8]">
              Central configuration controlling creator brand information, stats, and affiliate disclosures.
            </p>
          </div>

          {settingsSaved && (
            <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Site settings saved and synced across all pages!</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#120D1A] border border-purple-500/15 space-y-4">
              <h3 className="font-display font-bold text-base text-white">
                Brand &amp; Identity
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#A8A0B8] mb-1">
                    Creator Name
                  </label>
                  <input
                    type="text"
                    value={settingsForm.creatorName || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, creatorName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0710] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#A8A0B8] mb-1">
                    Monogram Logo
                  </label>
                  <input
                    type="text"
                    value={settingsForm.monogram || 'CA'}
                    onChange={(e) => setSettingsForm({ ...settingsForm, monogram: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0710] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#A8A0B8] mb-1">
                    Instagram Handle
                  </label>
                  <input
                    type="text"
                    value={settingsForm.instagramHandle || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, instagramHandle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0710] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#A8A0B8] mb-1">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    value={settingsForm.instagramUrl || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0710] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#A8A0B8] mb-1">
                    Contact / Collab Email
                  </label>
                  <input
                    type="email"
                    value={settingsForm.email || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0710] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#A8A0B8] mb-1">
                    Amazon Storefront URL
                  </label>
                  <input
                    type="url"
                    value={settingsForm.amazonStorefrontUrl || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, amazonStorefrontUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0710] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>
            </div>

            {/* Affiliate Disclosure text */}
            <div className="p-6 rounded-2xl bg-[#120D1A] border border-purple-500/15 space-y-3">
              <h3 className="font-display font-bold text-base text-white">
                Affiliate Disclosure Policy Text
              </h3>
              <textarea
                rows={3}
                value={settingsForm.affiliateDisclosure || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, affiliateDisclosure: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0710] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400"
              />
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-md shadow-purple-900/40 cursor-pointer"
            >
              Save Site Settings
            </button>
          </form>
        </div>
      )}

      {/* PRODUCT ADD / EDIT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#120D1A] border border-purple-500/30 p-6 sm:p-8 space-y-6 text-left">
            <div className="flex items-center justify-between border-b border-purple-900/30 pb-4">
              <div>
                <h2 className="font-display font-bold text-xl text-white">
                  {editingProduct ? 'Edit Product' : 'Add New Affiliate Product'}
                </h2>
                <p className="text-xs text-[#A8A0B8]">
                  Fill in genuine hardware specifications and affiliate destination URL.
                </p>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-2 text-[#A8A0B8] hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {productFormError && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{productFormError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#A8A0B8] mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={productFormData.name}
                    onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                    placeholder="e.g. EWEADN X23 Pro Wireless Mouse"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0710] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#A8A0B8] mb-1">
                    Brand *
                  </label>
                  <input
                    type="text"
                    required
                    value={productFormData.brand}
                    onChange={(e) => setProductFormData({ ...productFormData, brand: e.target.value })}
                    placeholder="e.g. EWEADN, Ant Esports"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0710] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#A8A0B8] mb-1">
                    Category *
                  </label>
                  <select
                    value={productFormData.category}
                    onChange={(e) => {
                      const sel = e.target.value;
                      const matched = categories.find((c) => (c.slug || c.id) === sel);
                      setProductFormData({
                        ...productFormData,
                        category: sel,
                        categoryName: matched?.name || sel
                      });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0710] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400 cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.slug || c.id} value={c.slug || c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#A8A0B8] mb-1">
                    Platform / Store
                  </label>
                  <select
                    value={productFormData.platform}
                    onChange={(e) => setProductFormData({
                      ...productFormData,
                      platform: e.target.value,
                      storeName: e.target.value === 'Amazon' ? 'Amazon India' : e.target.value
                    })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0710] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400 cursor-pointer"
                  >
                    <option value="Amazon">Amazon</option>
                    <option value="Brand Website">Brand Website</option>
                    <option value="Gaming Brand Store">Gaming Brand Store</option>
                    <option value="Other Affiliate Store">Other Affiliate Store</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#A8A0B8] mb-1">
                  Affiliate URL * (Redirect Target)
                </label>
                <input
                  type="url"
                  required
                  value={productFormData.affiliateUrl}
                  onChange={(e) => setProductFormData({ ...productFormData, affiliateUrl: e.target.value })}
                  placeholder="https://amazon.in/dp/... or https://brand.com/affiliate-link"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0710] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#A8A0B8] mb-1">
                  Coupon Code (Optional)
                </label>
                <input
                  type="text"
                  value={productFormData.couponCode}
                  onChange={(e) => setProductFormData({ ...productFormData, couponCode: e.target.value })}
                  placeholder="Enter coupon code (optional)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0710] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400 font-mono"
                />
                <p className="mt-1 text-[11px] text-[#A8A0B8]">
                  Leave blank if this product has no coupon code.
                </p>
              </div>

              {/* PRODUCT IMAGE: TWO INPUT OPTIONS */}
              <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-[#0B0710] border border-purple-500/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-900/20 pb-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white">
                      Product Image
                    </label>
                    <span className="text-[11px] text-[#A8A0B8]">
                      Choose an option to provide the product image
                    </span>
                  </div>

                  {/* Mode Selector Tabs */}
                  <div className="inline-flex rounded-xl bg-[#171020] p-1 border border-purple-500/25 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleSwitchImageMode('upload')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        imageInputMode === 'upload'
                          ? 'bg-purple-600 text-white shadow-sm shadow-purple-900/40'
                          : 'text-[#A8A0B8] hover:text-white'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Image</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSwitchImageMode('url')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        imageInputMode === 'url'
                          ? 'bg-purple-600 text-white shadow-sm shadow-purple-900/40'
                          : 'text-[#A8A0B8] hover:text-white'
                      }`}
                    >
                      <Link2 className="w-3.5 h-3.5" />
                      <span>Paste Image URL</span>
                    </button>
                  </div>
                </div>

                {/* OPTION 1 — UPLOAD IMAGE */}
                {imageInputMode === 'upload' && (
                  <div className="space-y-3 pt-1">
                    {uploadedFileInfo && uploadedFileInfo.previewUrl ? (
                      /* Preview of Uploaded / Selected Image */
                      <div className="p-3.5 rounded-xl bg-[#120D1A] border border-purple-500/20 flex flex-col sm:flex-row items-center gap-4">
                        <div className="relative w-28 h-24 rounded-lg bg-[#171020] border border-purple-500/25 overflow-hidden shrink-0 flex items-center justify-center">
                          <img
                            src={uploadedFileInfo.previewUrl}
                            alt="Uploaded Preview"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          {uploadedFileInfo.status === 'uploading' && (
                            <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center">
                              <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 space-y-1.5 w-full text-left">
                          <div className="flex items-center gap-2">
                            {uploadedFileInfo.status === 'uploading' ? (
                              <span className="inline-flex items-center gap-1.5 text-xs text-purple-300 font-medium">
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Uploading to secure storage...</span>
                              </span>
                            ) : uploadedFileInfo.status === 'error' ? (
                              <span className="inline-flex items-center gap-1.5 text-xs text-red-400 font-medium">
                                <AlertCircle className="w-3.5 h-3.5" />
                                <span>Upload Failed</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Image Ready &amp; Hosted</span>
                              </span>
                            )}
                          </div>

                          <div className="font-mono text-xs text-white truncate max-w-sm">
                            {uploadedFileInfo.name || 'product-image'}
                          </div>

                          {uploadedFileInfo.size && (
                            <div className="text-[11px] text-[#A8A0B8]">
                              {uploadedFileInfo.size}
                              {uploadedFileInfo.provider && ` · ${uploadedFileInfo.provider === 'cloudinary' ? 'Cloudinary CDN' : 'Server Storage'}`}
                            </div>
                          )}

                          {uploadedFileInfo.status === 'error' && (
                            <div className="text-[11px] text-red-300">
                              {uploadedFileInfo.errorMsg}
                            </div>
                          )}

                          {/* Action Buttons: Replace & Remove */}
                          <div className="flex items-center gap-2 pt-1">
                            <label className="px-2.5 py-1 rounded-lg bg-[#171020] hover:bg-purple-950/40 border border-purple-500/25 text-[11px] text-purple-300 font-medium cursor-pointer inline-flex items-center gap-1 transition-colors">
                              <RefreshCw className="w-3 h-3" />
                              <span>Replace Image</span>
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/jpg"
                                onChange={handleFileSelect}
                                className="hidden"
                              />
                            </label>

                            <button
                              type="button"
                              onClick={handleRemoveUploadedImage}
                              className="px-2.5 py-1 rounded-lg bg-red-950/30 hover:bg-red-950/60 border border-red-500/25 text-[11px] text-red-300 font-medium cursor-pointer inline-flex items-center gap-1 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Drag & Drop / File Input Box */
                      <div>
                        <label className="border-2 border-dashed border-purple-500/30 hover:border-purple-400/60 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all bg-[#120D1A]/50 hover:bg-purple-950/20 text-center group">
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/jpg"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                          <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-300 mb-2 group-hover:scale-105 transition-transform">
                            <Upload className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-semibold text-white">
                            Select an image file from your computer
                          </span>
                          <span className="text-[11px] text-[#A8A0B8] mt-1">
                            Supported formats: JPG, JPEG, PNG, WEBP (Max 10MB)
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                )}

                {/* OPTION 2 — PASTE IMAGE URL */}
                {imageInputMode === 'url' && (
                  <div className="space-y-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#A8A0B8] mb-1">
                        Image URL
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          value={urlInput}
                          onChange={(e) => handleUrlInputChange(e.target.value)}
                          placeholder="https://example.com/product-image.jpg"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#120D1A] border border-purple-500/25 text-white text-xs focus:outline-none focus:border-purple-400 font-mono pr-10"
                        />
                        {urlInput && (
                          <button
                            type="button"
                            onClick={() => handleUrlInputChange('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A8A0B8] hover:text-white p-1 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <span className="text-[11px] text-[#A8A0B8] block mt-1">
                        Paste an image URL hosted elsewhere (e.g. Amazon-hosted image, brand website, Cloudinary, etc.)
                      </span>
                    </div>

                    {/* Preview / Validation for URL */}
                    {urlInput.trim() && (
                      <div className="p-3.5 rounded-xl bg-[#120D1A] border border-purple-500/20 flex items-center gap-4">
                        <div className="relative w-24 h-20 rounded-lg bg-[#171020] border border-purple-500/25 overflow-hidden shrink-0 flex items-center justify-center">
                          {urlImageStatus === 'loading' && (
                            <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                          )}
                          <img
                            src={urlInput}
                            alt="URL Preview"
                            referrerPolicy="no-referrer"
                            onLoad={() => {
                              setUrlImageStatus('valid');
                              setUrlImageError('');
                            }}
                            onError={() => {
                              setUrlImageStatus('error');
                              setUrlImageError('Unable to load image from this URL. Please verify the URL is public and accessible.');
                            }}
                            className={`w-full h-full object-cover ${urlImageStatus === 'valid' ? 'block' : 'hidden'}`}
                          />
                          {urlImageStatus === 'error' && (
                            <div className="p-2 text-center text-red-400">
                              <AlertCircle className="w-6 h-6 mx-auto mb-1" />
                              <span className="text-[9px] uppercase tracking-wider block font-bold">Failed</span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 space-y-1 text-left min-w-0">
                          {urlImageStatus === 'valid' && (
                            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Image loaded &amp; verified successfully</span>
                            </div>
                          )}
                          {urlImageStatus === 'loading' && (
                            <div className="flex items-center gap-1.5 text-xs text-purple-300">
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Validating image URL...</span>
                            </div>
                          )}
                          {urlImageStatus === 'error' && (
                            <div className="text-xs text-red-400 font-medium">
                              {urlImageError}
                            </div>
                          )}
                          <div className="font-mono text-[11px] text-[#A8A0B8] truncate">
                            {urlInput}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#A8A0B8] mb-1">
                    Price (Optional - do not invent fake price)
                  </label>
                  <input
                    type="number"
                    value={productFormData.price}
                    onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })}
                    placeholder="e.g. 1999"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0710] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#A8A0B8] mb-1">
                    Currency Symbol
                  </label>
                  <input
                    type="text"
                    value={productFormData.currency}
                    onChange={(e) => setProductFormData({ ...productFormData, currency: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0710] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#A8A0B8] mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  value={productFormData.shortDescription}
                  onChange={(e) => setProductFormData({ ...productFormData, shortDescription: e.target.value })}
                  placeholder="One sentence summary for cards..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0710] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#A8A0B8] mb-1">
                  Full Description &amp; Creator Testing Notes
                </label>
                <textarea
                  rows={3}
                  value={productFormData.description}
                  onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                  placeholder="Detailed notes on ergonomics, switch feel, cable flex..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0710] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#A8A0B8] mb-1">
                  Specifications (one per line, format: Key: Value)
                </label>
                <textarea
                  rows={3}
                  value={productFormData.specsString}
                  onChange={(e) => setProductFormData({ ...productFormData, specsString: e.target.value })}
                  placeholder={"Sensor: Optical PMW3395\nWeight: 65g\nConnectivity: 2.4GHz / Bluetooth"}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0710] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#A8A0B8] mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={productFormData.tagsString}
                  onChange={(e) => setProductFormData({ ...productFormData, tagsString: e.target.value })}
                  placeholder="Wireless, Ultralight, RGB, Tactical"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0710] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
                  <input
                    type="checkbox"
                    checked={productFormData.showInMySetup}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setProductFormData((prev) => ({
                        ...prev,
                        showInMySetup: checked,
                        setupTags: checked ? prev.setupTags : []
                      }));
                    }}
                    className="rounded bg-[#0B0710] border-purple-500/30 text-purple-600 focus:ring-0"
                  />
                  <span>Show in My Setup</span>
                </label>
                <p className="ml-6 text-[11px] text-[#A8A0B8]">
                  Display this product in the My Setup virtual tour.
                </p>

                {productFormData.showInMySetup && (
                  <fieldset className="ml-6 space-y-2">
                    <legend className="block text-xs font-semibold uppercase tracking-wider text-[#A8A0B8]">
                      Setup Tour Tags *
                    </legend>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {setupTourTags.map((tag) => (
                        <label key={tag} className="flex items-center gap-2 rounded-lg bg-[#0B0710] border border-purple-500/15 px-2.5 py-2 cursor-pointer text-[11px] text-white">
                          <input
                            type="checkbox"
                            checked={productFormData.setupTags.includes(tag)}
                            onChange={() => setProductFormData((prev) => ({
                              ...prev,
                              setupTags: prev.setupTags.includes(tag)
                                ? prev.setupTags.filter((selectedTag) => selectedTag !== tag)
                                : [...prev.setupTags, tag]
                            }))}
                            className="rounded bg-[#0B0710] border-purple-500/30 text-purple-600 focus:ring-0"
                          />
                          <span>{tag}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                )}
              </div>

              {/* Checkboxes: Featured & Published */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
                  <input
                    type="checkbox"
                    checked={productFormData.featured}
                    onChange={(e) => setProductFormData({ ...productFormData, featured: e.target.checked })}
                    className="rounded bg-[#0B0710] border-purple-500/30 text-purple-600 focus:ring-0"
                  />
                  <span>Mark as Featured Gear</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
                  <input
                    type="checkbox"
                    checked={productFormData.published}
                    onChange={(e) => setProductFormData({ ...productFormData, published: e.target.checked })}
                    className="rounded bg-[#0B0710] border-purple-500/30 text-purple-600 focus:ring-0"
                  />
                  <span>Published (Visible to Visitors)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-purple-900/20">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#171020] hover:bg-[#20152C] text-xs font-semibold text-[#A8A0B8] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={productFormLoading}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md shadow-purple-900/40"
                >
                  {productFormLoading ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
