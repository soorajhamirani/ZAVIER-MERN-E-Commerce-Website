import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';

// Pages
import Storefront from './pages/Storefront';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-canvas-light text-charcoal font-sansSystem">
            {/* Header Navigation */}
            <Navbar />

            {/* Slide-out Cart Sidebar Drawer */}
            <CartDrawer />

            {/* Page Content Viewport */}
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<Storefront />} />
                <Route path="/category/:categoryName" element={<Storefront />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </div>

            {/* Global Footer */}
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
