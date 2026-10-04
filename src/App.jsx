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
import { resolveRoute } from './utils/routeResolver.js';

export default function App() {
  const [initialRoute] = useState(() => resolveRoute(window.location));
  const [activeRoute, setActiveRoute] = useState(initialRoute.route);
  const [selectedProductId, setSelectedProductId] = useState(initialRoute.productId || null);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState(initialRoute.categorySlug || 'all');

  // Keep route state in sync with existing hash navigation and direct path changes.
  useEffect(() => {
    const handleLocationChange = () => {
      const routeState = resolveRoute(window.location);
      setActiveRoute(routeState.route);
      if (routeState.productId) setSelectedProductId(routeState.productId);
      if (routeState.categorySlug) setSelectedCategorySlug(routeState.categorySlug);
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const navigateTo = (route, param = null) => {
    if (route === 'product' && param) {
      setSelectedProductId(param);
      window.location.hash = `product/${param}`;
      setActiveRoute('product');
    } else if (route === 'shop' && param) {
      const categorySlug = param === 'monitors' ? 'collectibles-decor' : param;
      setSelectedCategorySlug(categorySlug);
      window.location.hash = `category/${categorySlug}`;
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
