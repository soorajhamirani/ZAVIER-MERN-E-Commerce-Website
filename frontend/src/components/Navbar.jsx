import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, Search, User, LogOut, ShieldAlert } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { cartCount, isBagAnimating, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${searchQuery}`);
      setSearchQuery('');
    }
  };

  const navCategories = [
    { label: 'ALL ARRIVALS', id: 'all' },
    { label: 'MENSWEAR', id: 'menswear' },
    { label: 'WOMENSWEAR', id: 'womenswear' },
    { label: 'CHILDRENSWEAR', id: 'childrenswear' },
    { label: 'WINTER COLLECTION', id: 'winter collection' },
    { label: 'SUMMER ESSENTIALS', id: 'summer essentials' }
  ];

  // Parse active category from route path
  const pathParts = location.pathname.split('/');
  const activeCategory = pathParts[1] === 'category' ? decodeURIComponent(pathParts[2]) : 'all';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/95 backdrop-blur-md">
      {/* Top Banner */}
      <div className="bg-charcoal py-2 text-center text-[10px] font-semibold tracking-widest text-canvas-light uppercase">
        Cash on Delivery Across Pakistan | Easy 7-Day Hassle-Free Returns
      </div>

      {/* Main Header Container */}
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Serif Logo */}
        <div className="flex-1">
          <Link to="/" className="font-serifBrand text-3xl font-bold tracking-tight text-charcoal hover:opacity-85 transition-opacity">
            ZAVIER™
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden lg:flex space-x-8">
          {navCategories.map((cat) => (
            <Link
              key={cat.id}
              to={cat.id === 'all' ? '/' : `/category/${encodeURIComponent(cat.id)}`}
              className={`text-[11px] font-medium tracking-widest uppercase transition-all duration-300 relative py-1 hover:text-charcoal ${
                activeCategory === cat.id ? 'text-charcoal font-semibold' : 'text-slateMuted'
              }`}
            >
              {cat.label}
              {activeCategory === cat.id && (
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-charcoal animate-pulse"></span>
              )}
            </Link>
          ))}
        </nav>

        {/* Right: Search, Wishlist, Bag, Auth */}
        <div className="flex flex-1 items-center justify-end space-x-6">
          
          {/* Search Box Outline */}
          <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search Collection..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-44 border border-zinc-200 bg-canvas-light py-1.5 pl-3 pr-8 text-[11px] uppercase tracking-wider text-charcoal outline-none transition-all duration-300 focus:w-60 focus:border-charcoal"
            />
            <button type="submit" className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-charcoal">
              <Search className="h-3.5 w-3.5" />
            </button>
          </form>

          {/* User Profile / Admin Controls */}
          {user ? (
            <div className="flex items-center space-x-4">
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  title="Admin Dashboard"
                  className="text-zinc-500 hover:text-charcoal flex items-center space-x-1"
                >
                  <ShieldAlert className="h-4.5 w-4.5 text-rose-600" />
                  <span className="text-[10px] font-semibold tracking-widest text-rose-600 hidden xl:inline">ADMIN</span>
                </Link>
              )}
              <span className="hidden md:inline text-[10px] font-medium tracking-widest text-slateMuted uppercase">
                HI, {user.name.split(' ')[0]}
              </span>
              <button onClick={logout} title="Sign Out" className="text-zinc-500 hover:text-charcoal">
                <LogOut className="h-4.5 w-4.5" />
              </button>
            </div>
          ) : (
            <Link to="/checkout" className="text-zinc-500 hover:text-charcoal" title="Sign In">
              <User className="h-4.5 w-4.5" />
            </Link>
          )}

          {/* Wishlist Node */}
          <button className="text-zinc-500 hover:text-charcoal relative" title="Wishlist">
            <Heart className="h-4.5 w-4.5" />
          </button>

          {/* Minimalist Shopping Bag Widget */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center text-zinc-500 hover:text-charcoal relative focus:outline-none"
            title="Shopping Bag"
          >
            <ShoppingBag className="h-4.5 w-4.5" />
            <span
              className={`absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-charcoal text-[9px] font-bold text-white transition-all ${
                isBagAnimating ? 'animate-bag-pop bg-emerald-600 scale-125' : ''
              }`}
            >
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
