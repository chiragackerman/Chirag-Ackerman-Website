import React, { useState, useEffect } from 'react';
import { SiteProvider } from './context/SiteContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

// Pages
import HomePage from './pages/HomePage.jsx';
import ShopPage from './pages/ShopPage.jsx';
import ProductDetailsPage from './pages/ProductDetailsPage.jsx';
import CategoriesPage from './pages/CategoriesPage.jsx';
import MySetupPage from './pages/MySetupPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import CollaboratePage from './pages/CollaboratePage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import AffiliateDisclosurePage from './pages/AffiliateDisclosurePage.jsx';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.jsx';

export default function App() {
  const [activeRoute, setActiveRoute] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState('all');

  // Sync with browser hash on load and hashchange
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      if (hash.startsWith('product/')) {
        const pId = hash.replace('product/', '');
        setSelectedProductId(pId);
        setActiveRoute('product');
      } else if (hash.startsWith('category/')) {
        const cat = hash.replace('category/', '');
        setSelectedCategorySlug(cat);
        setActiveRoute('shop');
      } else {
        setActiveRoute(hash);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigateTo = (route, param = null) => {
    if (route === 'product' && param) {
      setSelectedProductId(param);
      window.location.hash = `product/${param}`;
      setActiveRoute('product');
    } else if (route === 'shop' && param) {
      setSelectedCategorySlug(param);
      window.location.hash = `category/${param}`;
      setActiveRoute('shop');
    } else {
      window.location.hash = route;
      setActiveRoute(route);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (productId) => {
    navigateTo('product', productId);
  };

  const handleSelectCategory = (categorySlug) => {
    navigateTo('shop', categorySlug);
  };

  return (
    <AuthProvider>
      <SiteProvider>
        <div className="min-h-screen bg-[#070509] text-[#F5F3FF] flex flex-col selection:bg-purple-600/30 selection:text-purple-200">
          <Navbar activeRoute={activeRoute} onNavigate={navigateTo} />

          <main className="flex-1">
            {activeRoute === 'home' && (
              <HomePage
                onNavigate={navigateTo}
                onSelectProduct={handleSelectProduct}
                onSelectCategory={handleSelectCategory}
              />
            )}

            {activeRoute === 'shop' && (
              <ShopPage
                initialCategory={selectedCategorySlug}
                onSelectProduct={handleSelectProduct}
                onNavigate={navigateTo}
              />
            )}

            {activeRoute === 'product' && (
              <ProductDetailsPage
                productId={selectedProductId}
                onNavigate={navigateTo}
                onSelectProduct={handleSelectProduct}
              />
            )}

            {activeRoute === 'categories' && (
              <CategoriesPage
                onSelectCategory={handleSelectCategory}
                onNavigate={navigateTo}
              />
            )}

            {activeRoute === 'setup' && (
              <MySetupPage
                onSelectProduct={handleSelectProduct}
                onNavigate={navigateTo}
              />
            )}

            {activeRoute === 'about' && (
              <AboutPage onNavigate={navigateTo} />
            )}

            {activeRoute === 'collaborate' && (
              <CollaboratePage />
            )}

            {activeRoute === 'contact' && (
              <ContactPage />
            )}

            {activeRoute === 'admin' && (
              <AdminDashboardPage onNavigate={navigateTo} />
            )}

            {activeRoute === 'affiliate-disclosure' && (
              <AffiliateDisclosurePage onNavigate={navigateTo} />
            )}

            {activeRoute === 'privacy' && (
              <PrivacyPolicyPage />
            )}
          </main>

          <Footer onNavigate={navigateTo} />
        </div>
      </SiteProvider>
    </AuthProvider>
  );
}
