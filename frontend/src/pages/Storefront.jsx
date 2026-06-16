import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { AlertCircle, Loader2, SlidersHorizontal, RotateCcw } from 'lucide-react';

export default function Storefront() {
  const { categoryName } = useParams();
  const activeCategory = categoryName ? decodeURIComponent(categoryName) : 'all';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const location = useLocation();
  const collectionRef = useRef(null);

  // Parse search query
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('search') || '';

  // Multi-level Sidebar query filters
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedSeasons, setSelectedSeasons] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [maxPrice, setMaxPrice] = useState(15000); // PKR 15,000 upper bound
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Collapsible on mobile

  // Sync category path selection straight to active checkboxes to prevent filter conflicts
  useEffect(() => {
    if (categoryName) {
      const decoded = decodeURIComponent(categoryName).toLowerCase();
      if (decoded === 'menswear') {
        setSelectedGenders(['Mens']);
        setSelectedSeasons([]);
        setSelectedCollections([]);
      } else if (decoded === 'womenswear') {
        setSelectedGenders(['Womens']);
        setSelectedSeasons([]);
        setSelectedCollections([]);
      } else if (decoded === 'childrenswear') {
        setSelectedGenders(['Childrens']);
        setSelectedSeasons([]);
        setSelectedCollections([]);
      } else if (decoded === 'winter collection') {
        setSelectedSeasons(['Winter']);
        setSelectedGenders([]);
        setSelectedCollections([]);
      } else if (decoded === 'summer essentials') {
        setSelectedSeasons(['Summer']);
        setSelectedGenders([]);
        setSelectedCollections([]);
      }
    } else {
      setSelectedGenders([]);
      setSelectedSeasons([]);
      setSelectedCollections([]);
    }
  }, [categoryName]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let params = [];
        
        // Category filters (selectedCollections checkboxes + activeCategory from URL)
        let categoriesToFilter = [...selectedCollections];
        
        // Prevent query conflict by filtering out gender/season category aliases
        const genderOrSeasonCategories = ['menswear', 'womenswear', 'childrenswear', 'winter collection', 'summer essentials'];
        if (activeCategory && activeCategory !== 'all' && !genderOrSeasonCategories.includes(activeCategory.toLowerCase())) {
          categoriesToFilter.push(activeCategory);
        }
        
        if (categoriesToFilter.length > 0) {
          params.push(`category=${encodeURIComponent(categoriesToFilter.join(','))}`);
        }
        
        if (searchQuery) {
          params.push(`search=${encodeURIComponent(searchQuery)}`);
        }
        if (selectedGenders.length > 0) {
          params.push(`gender=${selectedGenders.join(',')}`);
        }
        if (selectedSeasons.length > 0) {
          params.push(`season=${selectedSeasons.join(',')}`);
        }
        if (maxPrice) {
          params.push(`maxPrice=${maxPrice}`);
        }

        const url = `/api/products${params.length > 0 ? '?' + params.join('&') : ''}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch catalog items');
        }
        
        setProducts(data.products || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory, searchQuery, selectedGenders, selectedSeasons, selectedCollections, maxPrice]);

  const scrollToCollection = () => {
    collectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGenderChange = (gender) => {
    setSelectedGenders(prev => 
      prev.includes(gender) 
        ? prev.filter(g => g !== gender) 
        : [...prev, gender]
    );
  };

  const handleSeasonChange = (season) => {
    setSelectedSeasons(prev => 
      prev.includes(season) 
        ? prev.filter(s => s !== season) 
        : [...prev, season]
    );
  };

  const handleCollectionChange = (collection) => {
    setSelectedCollections(prev => 
      prev.includes(collection) 
        ? prev.filter(c => c !== collection) 
        : [...prev, collection]
    );
  };

  const resetFilters = () => {
    setSelectedGenders([]);
    setSelectedSeasons([]);
    setSelectedCollections([]);
    setMaxPrice(15000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Campaign Billboard Hero */}
      <section 
        className="relative h-[85vh] w-full bg-zinc-900 overflow-hidden flex items-center justify-center bg-fixed bg-cover bg-center"
        style={{ backgroundImage: "url('/images/campaign_billboard.jpg')" }}
      >
        {/* Campaign Background Overlay */}
        <div className="absolute inset-0 bg-black/45 z-10" />
        
        {/* Hero Content */}
        <div className="relative z-20 text-center max-w-2xl px-6 flex flex-col items-center">
          <span className="text-[10px] font-semibold tracking-widest text-white uppercase mb-4">ZAVIER™ BRIDAL & FESTIVE 2026</span>
          <h1 className="text-white text-4xl sm:text-6xl font-bold tracking-tight uppercase mb-6 leading-tight">
            THE LUXURY TRADITIONAL EDIT
          </h1>
          <p className="text-[12px] sm:text-[13px] leading-relaxed text-zinc-300 font-light tracking-wider mb-8 max-w-lg">
            Impeccable craftsmanship meets localized heritage styling. High-end modest silhouettes tailored in Pakistan.
          </p>
          <button
            onClick={scrollToCollection}
            className="border border-white bg-white hover:bg-transparent text-charcoal hover:text-white px-8 py-3 text-[10px] font-semibold tracking-widest transition-all duration-300 uppercase"
          >
            EXPLORE THE STORES
          </button>
        </div>
      </section>

      {/* Grid Container */}
      <main ref={collectionRef} className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-16 text-center">
        
        {/* Grid Title / Count Row */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-zinc-200 pb-6">
          <div className="text-left">
            <h2 className="text-xl font-semibold tracking-wider text-charcoal uppercase mb-2">
              {searchQuery ? `SEARCH RESULTS FOR "${searchQuery}"` : `${activeCategory === 'all' ? 'ALL COLLECTIONS' : activeCategory}`}
            </h2>
            <p className="text-[11px] tracking-widest text-slateMuted uppercase">
              {products.length} {products.length === 1 ? 'Garment' : 'Garments'} Available
            </p>
          </div>

          {/* Toggle sidebar control */}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="mt-4 md:mt-0 flex items-center space-x-2 border border-zinc-200 bg-white hover:border-charcoal py-2 px-4 text-[10px] font-semibold tracking-widest uppercase transition-all"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>{isSidebarOpen ? 'Hide Filters' : 'Show Filters'}</span>
          </button>
        </div>

        {/* Outer Split-Screen Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* 1. Left Sidebar Filter Panel (3 Columns) */}
          {isSidebarOpen && (
            <aside className="lg:col-span-3 border border-zinc-200 bg-white p-6 space-y-8 h-fit text-left transition-all">
              
              {/* Header Reset */}
              <div className="flex justify-between items-center border-b border-zinc-100 pb-4">
                <h3 className="text-[11px] font-bold tracking-widest text-charcoal uppercase">FILTERS</h3>
                <button 
                  onClick={resetFilters}
                  className="text-zinc-400 hover:text-charcoal transition-colors flex items-center space-x-1 text-[9px] font-bold tracking-widest uppercase"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>RESET</span>
                </button>
              </div>

              {/* Filter Section 1: Categories (Gender) */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold tracking-widest text-charcoal uppercase border-b border-zinc-50 pb-2">CLASSIFICATION</h4>
                <div className="space-y-2.5">
                  {['Mens', 'Womens', 'Childrens'].map((gender) => (
                    <label key={gender} className="flex items-center space-x-3 text-[11px] font-medium tracking-wider text-zinc-600 uppercase cursor-pointer select-none hover:text-charcoal">
                      <input
                        type="checkbox"
                        checked={selectedGenders.includes(gender)}
                        onChange={() => handleGenderChange(gender)}
                        className="h-3.5 w-3.5 border-zinc-200 accent-charcoal rounded-none focus:ring-0"
                      />
                      <span>{gender === 'Childrens' ? 'Childrenswear' : gender}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filter Section 1.5: Collections Edit */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold tracking-widest text-charcoal uppercase border-b border-zinc-50 pb-2">THE EDIT COLLECTIONS</h4>
                <div className="space-y-2.5">
                  {[
                    { label: 'New Arrivals', id: 'new arrivals' },
                    { label: 'Editorial Edit', id: 'edit' }
                  ].map((col) => (
                    <label key={col.id} className="flex items-center space-x-3 text-[11px] font-medium tracking-wider text-zinc-600 uppercase cursor-pointer select-none hover:text-charcoal">
                      <input
                        type="checkbox"
                        checked={selectedCollections.includes(col.id)}
                        onChange={() => handleCollectionChange(col.id)}
                        className="h-3.5 w-3.5 border-zinc-200 accent-charcoal rounded-none focus:ring-0"
                      />
                      <span>{col.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filter Section 2: Seasonal Sorting */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold tracking-widest text-charcoal uppercase border-b border-zinc-50 pb-2">SEASONAL SELECT</h4>
                <div className="space-y-2.5">
                  {[
                    { label: 'Winter Collection', id: 'Winter' },
                    { label: 'Summer Essentials', id: 'Summer' }
                  ].map((season) => (
                    <label key={season.id} className="flex items-center space-x-3 text-[11px] font-medium tracking-wider text-zinc-600 uppercase cursor-pointer select-none hover:text-charcoal">
                      <input
                        type="checkbox"
                        checked={selectedSeasons.includes(season.id)}
                        onChange={() => handleSeasonChange(season.id)}
                        className="h-3.5 w-3.5 border-zinc-200 accent-charcoal rounded-none focus:ring-0"
                      />
                      <span>{season.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filter Section 3: Price Slider */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold tracking-widest text-charcoal uppercase border-b border-zinc-50 pb-2">PRICE LIMIT (PKR)</h4>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="1500"
                    max="15000"
                    step="500"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    className="w-full accent-charcoal cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-semibold text-charcoal uppercase">
                    <span>Rs. 1,500</span>
                    <span className="bg-zinc-100 px-2 py-0.5 border border-zinc-200">Max: Rs. {maxPrice.toLocaleString()}</span>
                  </div>
                </div>

                {/* Price Presets */}
                <div className="pt-2 flex flex-wrap gap-1.5 border-t border-zinc-100">
                  {[4000, 8000, 12000].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setMaxPrice(preset)}
                      className={`py-1 px-2 text-[9px] font-bold tracking-widest uppercase border transition-all ${
                        maxPrice === preset
                          ? 'border-charcoal bg-charcoal text-white'
                          : 'border-zinc-200 bg-white text-zinc-500 hover:border-charcoal hover:text-charcoal'
                      }`}
                    >
                      &lt; Rs. {preset / 1000}k
                    </button>
                  ))}
                </div>
              </div>

            </aside>
          )}

          {/* 2. Right Column Product Grid (9 Columns if sidebar open, 12 if closed) */}
          <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:col-span-9' : 'lg:col-span-12'}`}>
            
            {/* Loading Indicator */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-24">
                <Loader2 className="h-8 w-8 animate-spin text-charcoal" />
                <p className="mt-4 text-[10px] tracking-widest text-slateMuted uppercase">Curating ZAVIER™ collection...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="flex flex-col items-center justify-center py-16 border border-dashed border-red-200 bg-red-50 text-red-700">
                <AlertCircle className="h-8 w-8 mb-3" />
                <p className="text-[11px] font-semibold tracking-widest uppercase">Failed to load lookbook</p>
                <p className="text-[10px] mt-1">{error}</p>
              </div>
            )}

            {/* Empty Catalog State */}
            {!loading && !error && products.length === 0 && (
              <div className="py-24 text-center border border-dashed border-zinc-200 bg-white">
                <p className="text-[11px] font-medium tracking-widest text-slateMuted uppercase">No items found matching the selected filters.</p>
                <button
                  onClick={resetFilters}
                  className="mt-6 border border-charcoal bg-charcoal px-6 py-2.5 text-[10px] font-semibold tracking-widest text-white hover:bg-zinc-800 uppercase"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Product Cards Row */}
            {!loading && !error && products.length > 0 && (
              <div className={`grid gap-8 grid-cols-1 sm:grid-cols-2 ${isSidebarOpen ? 'md:grid-cols-2 xl:grid-cols-3' : 'md:grid-cols-3 lg:grid-cols-4'}`}>
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
