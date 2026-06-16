import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, Box, Truck, Coins, DollarSign, Percent, 
  ShoppingCart, Users, RefreshCw, Edit2, Loader2, Save, Trash2 
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if not admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  // Tab State: 'overview', 'inventory', 'orders', 'pricing'
  const [activeTab, setActiveTab] = useState('overview');

  // API Data States
  const [analytics, setAnalytics] = useState({
    grossTurnover: 0,
    conversionPercentage: 2.4,
    unfulfilledOrders: 0,
    liveConcurrentSessions: 5
  });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Edit State for Modal/Inline updates
  const [editingProduct, setEditingProduct] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState({}); // maps size to quantity

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${user.token}` };
      
      // Fetch Analytics
      const resAnal = await fetch('/api/orders/analytics', { headers });
      if (resAnal.ok) setAnalytics(await resAnal.ok ? await resAnal.json() : analytics);

      // Fetch Products
      const resProd = await fetch('/api/products?limit=100');
      if (resProd.ok) {
        const prodData = await resProd.json();
        setProducts(prodData.products || []);
      }

      // Fetch Orders
      const resOrd = await fetch('/api/orders', { headers });
      if (resOrd.ok) setOrders(await resOrd.json());

    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchData();
    }
  }, [user]);

  // Handle Order Dispatch Fulfilling
  const handleFulfillOrder = async (orderId, currentStatus) => {
    setActionLoading(true);
    let nextStatus = 'Shipped';
    if (currentStatus === 'Shipped') nextStatus = 'Delivered';

    try {
      const response = await fetch(`/api/orders/${orderId}/fulfill`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      if (response.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Open product editor
  const startEditing = (product) => {
    setEditingProduct(product);
    setEditPrice(product.price.toString());
    const stockMap = {};
    product.variants.forEach(v => {
      stockMap[v.size] = v.stockCount;
    });
    setEditStock(stockMap);
  };

  // Persist pricing/stock mutations back to DB
  const saveProductEdits = async (productId) => {
    setActionLoading(true);
    try {
      const updatedVariants = editingProduct.variants.map(v => ({
        ...v,
        stockCount: parseInt(editStock[v.size] || 0)
      }));

      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          price: parseFloat(editPrice),
          variants: updatedVariants
        })
      });

      if (response.ok) {
        setEditingProduct(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to remove this garment from the database?')) return;
    setActionLoading(true);
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (response.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="flex min-h-screen bg-canvas-light text-charcoal">
      
      {/* 1. Left Navigation Command Rail (Width: 280px) */}
      <aside className="w-[280px] bg-charcoal text-zinc-400 flex flex-col justify-between flex-shrink-0 border-r border-zinc-900 select-none">
        <div>
          {/* Logo Brand Title */}
          <div className="h-20 border-b border-zinc-800 flex items-center px-8">
            <span className="font-serifBrand text-2xl text-white tracking-widest uppercase font-bold">Zavier Hub</span>
          </div>
          
          {/* Navigation Links */}
          <nav className="mt-8 px-4 space-y-2">
            {[
              { id: 'overview', label: 'Overview Analytics', icon: BarChart3 },
              { id: 'inventory', label: 'Inventory Control', icon: Box },
              { id: 'orders', label: 'Order Dispatch Log', icon: Truck },
              { id: 'pricing', label: 'Dynamic Pricing Core', icon: Coins }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-4 px-4 py-3 text-[11px] font-semibold tracking-widest uppercase transition-all ${
                    activeTab === item.id 
                      ? 'bg-zinc-800 text-white border-l-2 border-white' 
                      : 'hover:bg-zinc-900 hover:text-zinc-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User context footer */}
        <div className="p-6 border-t border-zinc-800 text-left">
          <p className="text-[10px] tracking-widest text-zinc-500 uppercase">LOGGED IN ADMIN</p>
          <p className="text-[11px] font-semibold text-white uppercase mt-1 line-clamp-1">{user.name}</p>
          <button 
            onClick={() => navigate('/')} 
            className="text-[9px] tracking-widest font-semibold text-zinc-400 hover:text-white underline mt-3 block uppercase"
          >
            VIEW STOREFRONT
          </button>
        </div>
      </aside>

      {/* 2. Main Content Canvas */}
      <main className="flex-grow flex flex-col h-screen overflow-y-auto p-10 custom-scrollbar text-left">
        
        {/* Header Toolbar */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-widest text-charcoal uppercase">
              {activeTab === 'overview' && 'SYSTEM OVERVIEW'}
              {activeTab === 'inventory' && 'INVENTORY CONTROL SHEET'}
              {activeTab === 'orders' && 'ORDER DISPATCH LOG'}
              {activeTab === 'pricing' && 'DYNAMIC PRICING CORE'}
            </h1>
            <p className="text-[10px] tracking-widest text-slateMuted uppercase mt-1">
              Zavier Pakistan Operations Command Console
            </p>
          </div>
          <button 
            onClick={fetchData} 
            className="flex items-center space-x-2 border border-zinc-200 bg-white hover:border-charcoal py-2 px-4 text-[10px] font-semibold tracking-widest uppercase transition-all"
            disabled={loading || actionLoading}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Live Streams</span>
          </button>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center flex-grow py-32">
            <Loader2 className="h-8 w-8 animate-spin text-charcoal" />
            <p className="text-[10px] tracking-widest text-slateMuted uppercase mt-4">Streaming database records...</p>
          </div>
        ) : (
          <div className="space-y-10 flex-grow">
            
            {/* KPI Performance Horizon (Always shown on Overview, optionally others) */}
            {(activeTab === 'overview' || activeTab === 'pricing') && (
              <section className="grid grid-cols-1 md:grid-cols-4 gap-6 select-none">
                
                {/* Metric 1 */}
                <div className="bg-white p-6 border border-zinc-200">
                  <div className="flex justify-between items-center text-slateMuted mb-2">
                    <span className="text-[9px] font-bold tracking-widest uppercase">GROSS PLATFORM TURNOVER</span>
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <h3 className="text-2xl font-bold font-serif-luxury text-charcoal">Rs. {analytics.grossTurnover.toLocaleString()}</h3>
                  <span className="text-[8px] font-semibold text-emerald-600 tracking-wider uppercase mt-2 block">↑ 12% FROM LAST SESSION</span>
                </div>

                {/* Metric 2 */}
                <div className="bg-white p-6 border border-zinc-200">
                  <div className="flex justify-between items-center text-slateMuted mb-2">
                    <span className="text-[9px] font-bold tracking-widest uppercase">CONVERSION PERCENTAGE</span>
                    <Percent className="h-4 w-4" />
                  </div>
                  <h3 className="text-2xl font-bold font-serif-luxury text-charcoal">{analytics.conversionPercentage}%</h3>
                  <span className="text-[8px] font-semibold text-zinc-400 tracking-wider uppercase mt-2 block">INDUSTRY BENCHMARK: 2.1%</span>
                </div>

                {/* Metric 3 */}
                <div className="bg-white p-6 border border-zinc-200">
                  <div className="flex justify-between items-center text-slateMuted mb-2">
                    <span className="text-[9px] font-bold tracking-widest uppercase">UNFULFILLED PIPELINES</span>
                    <ShoppingCart className="h-4 w-4" />
                  </div>
                  <h3 className="text-2xl font-bold font-serif-luxury text-rose-600">{analytics.unfulfilledOrders} ORDERS</h3>
                  <span className="text-[8px] font-semibold text-rose-600 tracking-wider uppercase mt-2 block">CRITICAL RE-STOCK PENDING</span>
                </div>

                {/* Metric 4 */}
                <div className="bg-white p-6 border border-zinc-200">
                  <div className="flex justify-between items-center text-slateMuted mb-2">
                    <span className="text-[9px] font-bold tracking-widest uppercase">LIVE CONCURRENT GUESTS</span>
                    <Users className="h-4 w-4" />
                  </div>
                  <h3 className="text-2xl font-bold font-serif-luxury text-charcoal">{analytics.liveConcurrentSessions} ACTIVE</h3>
                  <span className="text-[8px] font-semibold text-emerald-600 tracking-wider uppercase mt-2 block">STREAMING LIVE CHECKOUTS</span>
                </div>

              </section>
            )}

            {/* TAB CONTENT: Overview Recent Orders */}
            {activeTab === 'overview' && (
              <section className="bg-white border border-zinc-200 p-6">
                <h3 className="text-[12px] font-semibold tracking-widest text-charcoal uppercase mb-6 border-b border-zinc-100 pb-4">
                  RECENT ACTIVITY FEED
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] tracking-wider font-light">
                    <thead>
                      <tr className="border-b border-zinc-200 text-charcoal font-bold uppercase text-[9px]">
                        <th className="pb-3">ORDER ID</th>
                        <th className="pb-3">CUSTOMER</th>
                        <th className="pb-3">DATE</th>
                        <th className="pb-3">TOTAL</th>
                        <th className="pb-3">PAYMENT STATUS</th>
                        <th className="pb-3">FULFILLMENT</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 text-zinc-600 uppercase">
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord._id}>
                          <td className="py-3 font-semibold text-charcoal">{ord._id}</td>
                          <td className="py-3">{ord.user?.name || 'Guest User'}</td>
                          <td className="py-3">{new Date(ord.createdAt).toLocaleDateString()}</td>
                          <td className="py-3 font-semibold text-charcoal">Rs. {ord.totalAmount.toLocaleString()}</td>
                          <td className="py-3">
                            <span className="bg-emerald-50 text-emerald-700 py-0.5 px-2 text-[9px] font-bold border border-emerald-100">
                              {ord.paymentStatus}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className={`py-0.5 px-2 text-[9px] font-bold border ${
                              ord.fulfillmentStatus === 'Delivered'
                                ? 'bg-zinc-100 text-zinc-600 border-zinc-200'
                                : 'bg-rose-50 text-rose-700 border-rose-100'
                            }`}>
                              {ord.fulfillmentStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan="6" className="py-8 text-center text-slateMuted uppercase">No transactions logged yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* TAB CONTENT: Inventory Control Sheet */}
            {activeTab === 'inventory' && (
              <section className="bg-white border border-zinc-200 p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] tracking-wider font-light">
                    <thead>
                      <tr className="border-b border-zinc-200 text-charcoal font-bold uppercase text-[9px]">
                        <th className="pb-3">GARMENT</th>
                        <th className="pb-3">TITLE / SKU</th>
                        <th className="pb-3">CATEGORIES</th>
                        <th className="pb-3">PRICE</th>
                        <th className="pb-3">SIZE VARIANTS (STOCK LEVEL)</th>
                        <th className="pb-3 text-right">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 text-zinc-600">
                      {products.map((prod) => {
                        const productSKU = `FN-${prod._id.substring(18).toUpperCase()}`;
                        return (
                          <tr key={prod._id} className="align-middle">
                            {/* Thumbnail */}
                            <td className="py-4">
                              <img 
                                src={prod.images && prod.images[0] ? prod.images[0] : ''} 
                                alt="" 
                                className="h-14 w-10 object-cover object-center bg-zinc-100 border border-zinc-200"
                              />
                            </td>
                            {/* Title / SKU */}
                            <td className="py-4">
                              <p className="font-semibold text-charcoal uppercase">{prod.title}</p>
                              <p className="text-[9px] tracking-widest text-slateMuted font-mono uppercase mt-0.5">{productSKU}</p>
                            </td>
                            {/* Categories */}
                            <td className="py-4">
                              <div className="flex flex-wrap gap-1">
                                {prod.categories.map(c => (
                                  <span key={c} className="bg-canvas-light border border-zinc-200 py-0.5 px-2 text-[9px] font-medium tracking-wider text-charcoal uppercase rounded-none">
                                    {c}
                                  </span>
                                ))}
                              </div>
                            </td>
                            {/* Price */}
                            <td className="py-4 font-semibold text-charcoal">Rs. {prod.price.toLocaleString()}</td>
                            {/* Variants stock bar */}
                            <td className="py-4">
                              <div className="space-y-1">
                                {prod.variants.map(v => (
                                  <div key={v.size} className="flex items-center space-x-2 text-[10px]">
                                    <span className="w-10 text-charcoal uppercase font-medium">{v.size}:</span>
                                    <div className="w-24 bg-zinc-100 h-2 rounded-none overflow-hidden relative border border-zinc-200">
                                      <div 
                                        className={`h-full ${
                                          v.stockCount <= 5 ? 'bg-red-500' : 'bg-charcoal'
                                        }`} 
                                        style={{ width: `${Math.min(100, (v.stockCount / 30) * 100)}%` }} 
                                      />
                                    </div>
                                    <span className="text-zinc-600 font-bold">{v.stockCount} left</span>
                                  </div>
                                ))}
                              </div>
                            </td>
                            {/* Actions */}
                            <td className="py-4 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => startEditing(prod)}
                                  className="border border-zinc-200 hover:border-charcoal bg-white p-2 text-zinc-500 hover:text-charcoal transition-all uppercase text-[9px] font-semibold tracking-wider flex items-center space-x-1"
                                >
                                  <Edit2 className="h-3 w-3" />
                                  <span>Adjust Details</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(prod._id)}
                                  className="border border-red-100 hover:border-red-600 bg-white p-2 text-red-400 hover:text-red-600 transition-all uppercase text-[9px]"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* TAB CONTENT: Order Dispatch Log */}
            {activeTab === 'orders' && (
              <section className="bg-white border border-zinc-200 p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] tracking-wider font-light">
                    <thead>
                      <tr className="border-b border-zinc-200 text-charcoal font-bold uppercase text-[9px]">
                        <th className="pb-3">ORDER ID</th>
                        <th className="pb-3">DATE</th>
                        <th className="pb-3">SHIPPING ADDRESS</th>
                        <th className="pb-3">LINE GARMENTS</th>
                        <th className="pb-3">TOTAL</th>
                        <th className="pb-3">DISPATCH STEP</th>
                        <th className="pb-3 text-right">DISPATCH TRIGGER</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 text-zinc-600 uppercase">
                      {orders.map((ord) => (
                        <tr key={ord._id} className="align-top">
                          <td className="py-4 font-semibold text-charcoal">{ord._id}</td>
                          <td className="py-4">{new Date(ord.createdAt).toLocaleDateString()}</td>
                          <td className="py-4 leading-relaxed font-light text-zinc-500">
                            <span className="font-semibold text-charcoal block">{ord.shippingAddress.name}</span>
                            {ord.shippingAddress.street}, {ord.shippingAddress.city}, {ord.shippingAddress.postalCode}, {ord.shippingAddress.country}
                          </td>
                          <td className="py-4">
                            <div className="space-y-1 font-light text-[10px]">
                              {ord.items.map((it, idx) => (
                                <div key={idx} className="flex items-center space-x-2">
                                  <span className="font-semibold text-charcoal">{it.quantity}x</span>
                                  <span className="truncate max-w-[120px] block">{it.product?.title || 'Garment'}</span>
                                  <span className="text-zinc-400 font-bold">({it.size})</span>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="py-4 font-bold text-charcoal">Rs. {ord.totalAmount.toLocaleString()}</td>
                          <td className="py-4">
                            <span className={`py-0.5 px-2 text-[9px] font-bold border ${
                              ord.fulfillmentStatus === 'Delivered'
                                ? 'bg-zinc-100 text-zinc-600 border-zinc-200'
                                : ord.fulfillmentStatus === 'Shipped'
                                ? 'bg-blue-50 text-blue-700 border-blue-100'
                                : 'bg-rose-50 text-rose-700 border-rose-100'
                            }`}>
                              {ord.fulfillmentStatus}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            {ord.fulfillmentStatus !== 'Delivered' && (
                              <button
                                onClick={() => handleFulfillOrder(ord._id, ord.fulfillmentStatus)}
                                disabled={actionLoading}
                                className="border border-charcoal bg-charcoal text-white hover:bg-zinc-800 py-1.5 px-3 text-[9px] font-semibold tracking-widest uppercase transition-colors"
                              >
                                {ord.fulfillmentStatus === 'Processing' ? 'MARK AS SHIPPED' : 'MARK AS DELIVERED'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan="7" className="py-8 text-center text-slateMuted uppercase">No transactions logged yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* TAB CONTENT: Dynamic Pricing Core */}
            {activeTab === 'pricing' && (
              <section className="bg-white border border-zinc-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left list of products with quick price overrides */}
                  <div>
                    <h3 className="text-[12px] font-semibold tracking-widest text-charcoal uppercase mb-6 border-b border-zinc-100 pb-4">
                      ACTIVE PRICE LIST
                    </h3>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                      {products.map((prod) => (
                        <div key={prod._id} className="flex justify-between items-center p-3 border border-zinc-100 hover:border-zinc-300 transition-all bg-canvas-light">
                          <div className="flex items-center space-x-3 text-left">
                            <img src={prod.images[0]} className="h-12 w-9 object-cover bg-zinc-200" alt="" />
                            <div>
                              <p className="text-[11px] font-semibold text-charcoal uppercase line-clamp-1">{prod.title}</p>
                              <p className="text-[9px] tracking-widest text-slateMuted uppercase mt-0.5">CURRENT: Rs. {prod.price.toLocaleString()}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => startEditing(prod)}
                            className="border border-charcoal bg-charcoal text-white px-3 py-1.5 text-[9px] font-semibold tracking-widest uppercase hover:bg-zinc-800 transition-colors"
                          >
                            ALTER PRICE MATRIX
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right side editor widget */}
                  <div>
                    <h3 className="text-[12px] font-semibold tracking-widest text-charcoal uppercase mb-6 border-b border-zinc-100 pb-4">
                      PRICE MATRIX OVERRIDE
                    </h3>
                    {editingProduct ? (
                      <div className="border border-zinc-200 p-6 space-y-6">
                        <div className="flex items-start space-x-4 border-b border-zinc-100 pb-4">
                          <img src={editingProduct.images[0]} className="h-20 w-15 object-cover bg-zinc-200 border border-zinc-200" alt="" />
                          <div className="text-left">
                            <p className="text-[12px] font-bold text-charcoal uppercase">{editingProduct.title}</p>
                            <p className="text-[9px] tracking-widest text-slateMuted uppercase mt-1">ID: {editingProduct._id}</p>
                          </div>
                        </div>

                        {/* Price Override */}
                        <div>
                          <label className="block text-[9px] font-bold tracking-widest text-charcoal uppercase mb-2">OVERRIDE RETAIL PRICE (PKR)</label>
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            className="w-full border border-zinc-200 py-2.5 px-3 text-[11px] tracking-wider outline-none focus:border-charcoal font-semibold text-charcoal"
                          />
                        </div>

                        {/* Stock Adjustment */}
                        <div className="space-y-3">
                          <label className="block text-[9px] font-bold tracking-widest text-charcoal uppercase border-b border-zinc-100 pb-2">ADJUST WAREHOUSE INVENTORY</label>
                          <div className="grid grid-cols-2 gap-4">
                            {editingProduct.variants.map((v) => (
                              <div key={v.size} className="flex items-center justify-between border border-zinc-100 p-2">
                                <span className="text-[10px] font-semibold text-charcoal uppercase">{v.size}:</span>
                                <input
                                  type="number"
                                  value={editStock[v.size] !== undefined ? editStock[v.size] : 0}
                                  onChange={(e) => setEditStock({ ...editStock, [v.size]: e.target.value })}
                                  className="w-14 border border-zinc-200 text-center py-1 px-1.5 text-[10px] font-semibold text-charcoal"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex space-x-4 pt-2">
                          <button
                            onClick={() => saveProductEdits(editingProduct._id)}
                            disabled={actionLoading}
                            className="flex-1 bg-charcoal hover:bg-zinc-800 text-white py-3 text-[10px] font-semibold tracking-widest uppercase transition-colors flex items-center justify-center space-x-2"
                          >
                            <Save className="h-3.5 w-3.5" />
                            <span>PERSIST OVERRIDES</span>
                          </button>
                          <button
                            onClick={() => setEditingProduct(null)}
                            className="border border-zinc-200 hover:border-charcoal bg-white py-3 px-6 text-[10px] font-semibold tracking-widest uppercase transition-all"
                          >
                            CANCEL
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="border border-dashed border-zinc-200 p-12 text-center flex flex-col items-center justify-center h-[280px]">
                        <Coins className="h-10 w-10 text-zinc-300 stroke-[1] mb-4" />
                        <p className="text-[11px] font-medium tracking-widest text-slateMuted uppercase">
                          Select a garment on the left to activate override matrix panel.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

          </div>
        )}
      </main>
    </div>
  );
}
