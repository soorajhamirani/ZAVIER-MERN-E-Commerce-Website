import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, CreditCard, ShoppingBag, Loader2, CheckCircle } from 'lucide-react';

export default function Checkout() {
  const { cart, cartSubtotal, cartCount, clearCart } = useCart();
  const { user, login, register, loading: authLoading, error: authError } = useAuth();
  const navigate = useNavigate();

  // Auth modes: 'login' or 'register'
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [addressForm, setAddressForm] = useState({
    name: user ? user.name : '',
    street: '',
    city: '',
    postalCode: '',
    country: 'Pakistan'
  });
  
  // Card Inputs
  const [cardForm, setCardForm] = useState({ number: '', expiry: '', cvv: '' });
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [checkoutError, setCheckoutError] = useState('');

  // Calculations
  const shippingFee = cartSubtotal >= 3500 ? 0 : 250;
  const estimatedTax = cartSubtotal * 0.08;
  const grandTotal = cartSubtotal + shippingFee + estimatedTax;

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    try {
      if (authMode === 'login') {
        await login(authForm.email, authForm.password);
      } else {
        await register(authForm.name, authForm.email, authForm.password);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    // Validations
    if (!addressForm.street || !addressForm.city || !addressForm.postalCode) {
      setCheckoutError('Please fill in all shipping details.');
      return;
    }
    if (!cardForm.number || !cardForm.expiry || !cardForm.cvv) {
      setCheckoutError('Please fill in card payment details.');
      return;
    }

    setCheckoutLoading(true);
    setCheckoutError('');

    try {
      const orderItems = cart.map(item => ({
        product: item.product._id || item.product,
        size: item.size,
        color: item.color,
        quantity: item.quantity
      }));

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          items: orderItems,
          shippingAddress: addressForm,
          totalAmount: grandTotal
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Checkout failed');
      }

      setOrderSuccess(data);
      clearCart();
    } catch (err) {
      console.error(err);
      setCheckoutError(err.message);
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Success view
  if (orderSuccess) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <CheckCircle className="h-16 w-16 text-emerald-600 mx-auto stroke-[1.5] mb-6" />
        <h1 className="text-3xl font-bold tracking-tight text-charcoal uppercase mb-3">Order Authorized</h1>
        <p className="text-[11px] tracking-widest text-slateMuted uppercase mb-6">
          Thank you for shopping with Zavier. Reference ID: <span className="font-semibold text-charcoal">{orderSuccess._id}</span>
        </p>
        <div className="border border-zinc-200 bg-white p-6 text-left mb-8 space-y-3">
          <p className="text-[11px] font-semibold text-charcoal uppercase border-b border-zinc-100 pb-2">DELIVERY DETAILS</p>
          <p className="text-[10px] tracking-wide text-zinc-600 uppercase font-light">Recipient: {orderSuccess.shippingAddress.name}</p>
          <p className="text-[10px] tracking-wide text-zinc-600 uppercase font-light">
            Address: {orderSuccess.shippingAddress.street}, {orderSuccess.shippingAddress.city}, {orderSuccess.shippingAddress.postalCode}, {orderSuccess.shippingAddress.country}
          </p>
          <p className="text-[10px] tracking-wide text-zinc-600 uppercase font-light">Status: <span className="text-emerald-700 font-semibold">{orderSuccess.fulfillmentStatus}</span></p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="border border-charcoal bg-charcoal text-white hover:bg-zinc-800 px-8 py-3.5 text-[10px] font-semibold tracking-widest uppercase transition-all"
        >
          RETURN TO HOME
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
        
        {/* Left Section: Inputs (7 Columns) */}
        <div className="lg:col-span-7 space-y-10">
          
          {/* Phase 1: Authentication */}
          {!user ? (
            <div className="border border-zinc-200 bg-white p-8">
              <h2 className="text-[12px] font-semibold tracking-widest text-charcoal uppercase mb-6 border-b border-zinc-100 pb-4">
                1. ACCOUNT SECURE IDENTIFICATION
              </h2>
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authMode === 'register' && (
                  <div>
                    <label className="block text-[9px] font-bold tracking-widest text-charcoal uppercase mb-1.5">FULL NAME</label>
                    <input
                      type="text"
                      required
                      value={authForm.name}
                      onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                      className="w-full border border-zinc-200 py-2.5 px-3 text-[11px] tracking-wider outline-none focus:border-charcoal uppercase"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-[9px] font-bold tracking-widest text-charcoal uppercase mb-1.5">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    required
                    value={authForm.email}
                    onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                    className="w-full border border-zinc-200 py-2.5 px-3 text-[11px] tracking-wider outline-none focus:border-charcoal"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold tracking-widest text-charcoal uppercase mb-1.5">PASSWORD</label>
                  <input
                    type="password"
                    required
                    value={authForm.password}
                    onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                    className="w-full border border-zinc-200 py-2.5 px-3 text-[11px] tracking-wider outline-none focus:border-charcoal"
                  />
                </div>

                {authError && (
                  <p className="text-[10px] text-red-600 font-semibold tracking-wider uppercase">{authError}</p>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-charcoal text-white hover:bg-zinc-800 py-3 text-[10px] font-semibold tracking-widest uppercase transition-colors flex items-center justify-center"
                >
                  {authLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (authMode === 'login' ? 'SIGN IN & CONTINUE' : 'CREATE ACCOUNT')}
                </button>
              </form>

              <div className="mt-4 text-center">
                <button
                  onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  className="text-[10px] font-medium tracking-widest text-slateMuted hover:text-charcoal underline uppercase"
                >
                  {authMode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Logged in notification */}
              <div className="border border-zinc-200 bg-white p-6 flex justify-between items-center">
                <div>
                  <p className="text-[10px] tracking-widest text-slateMuted uppercase">SECURELY LOGGED IN AS</p>
                  <p className="text-[11px] font-semibold text-charcoal uppercase mt-1">{user.name} ({user.email})</p>
                </div>
                <div className="bg-emerald-50 text-emerald-800 text-[9px] tracking-widest font-bold py-1 px-3 border border-emerald-200 uppercase">
                  Verified
                </div>
              </div>

              {/* Delivery Address */}
              <div className="border border-zinc-200 bg-white p-8">
                <h2 className="text-[12px] font-semibold tracking-widest text-charcoal uppercase mb-6 border-b border-zinc-100 pb-4">
                  2. DELIVERY DETAILS
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[9px] font-bold tracking-widest text-charcoal uppercase mb-1.5">RECIPIENT NAME</label>
                    <input
                      type="text"
                      required
                      value={addressForm.name}
                      onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                      className="w-full border border-zinc-200 py-2.5 px-3 text-[11px] tracking-wider outline-none focus:border-charcoal uppercase"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[9px] font-bold tracking-widest text-charcoal uppercase mb-1.5">STREET ADDRESS</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 54 Bond Street"
                      value={addressForm.street}
                      onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                      className="w-full border border-zinc-200 py-2.5 px-3 text-[11px] tracking-wider outline-none focus:border-charcoal uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold tracking-widest text-charcoal uppercase mb-1.5">CITY</label>
                    <input
                      type="text"
                      required
                      placeholder="London"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      className="w-full border border-zinc-200 py-2.5 px-3 text-[11px] tracking-wider outline-none focus:border-charcoal uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold tracking-widest text-charcoal uppercase mb-1.5">POSTAL CODE</label>
                    <input
                      type="text"
                      required
                      placeholder="W1S 1AN"
                      value={addressForm.postalCode}
                      onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                      className="w-full border border-zinc-200 py-2.5 px-3 text-[11px] tracking-wider outline-none focus:border-charcoal uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Payment details */}
              <div className="border border-zinc-200 bg-white p-8">
                <h2 className="text-[12px] font-semibold tracking-widest text-charcoal uppercase mb-6 border-b border-zinc-100 pb-4 flex items-center justify-between">
                  <span>3. STRIPE SECURE PAYMENT</span>
                  <ShieldCheck className="h-4.5 w-4.5 text-emerald-600" />
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-[9px] font-bold tracking-widest text-charcoal uppercase mb-1.5">CREDIT CARD NUMBER</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="4242 •••• •••• 4242 (Stripe Mock)"
                        maxLength="19"
                        value={cardForm.number}
                        onChange={(e) => setCardForm({ ...cardForm, number: e.target.value })}
                        className="w-full border border-zinc-200 py-2.5 pl-10 pr-3 text-[11px] tracking-wider outline-none focus:border-charcoal"
                      />
                      <CreditCard className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-bold tracking-widest text-charcoal uppercase mb-1.5">EXPIRATION DATE</label>
                      <input
                        type="text"
                        required
                        placeholder="MM / YY"
                        maxLength="5"
                        value={cardForm.expiry}
                        onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })}
                        className="w-full border border-zinc-200 py-2.5 px-3 text-[11px] tracking-wider outline-none focus:border-charcoal"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold tracking-widest text-charcoal uppercase mb-1.5">CVV SECURITY CODE</label>
                      <input
                        type="password"
                        required
                        placeholder="•••"
                        maxLength="3"
                        value={cardForm.cvv}
                        onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value })}
                        className="w-full border border-zinc-200 py-2.5 px-3 text-[11px] tracking-wider outline-none focus:border-charcoal"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>

        {/* Right Section: Summary Card (5 Columns) */}
        <div className="lg:col-span-5">
          <div className="border border-zinc-200 bg-white p-6 sticky top-28 space-y-6">
            <h2 className="text-[12px] font-semibold tracking-widest text-charcoal uppercase border-b border-zinc-100 pb-4 flex items-center justify-between">
              <span>ORDER SUMMATION</span>
              <ShoppingBag className="h-4.5 w-4.5" />
            </h2>

            {cart.length === 0 ? (
              <p className="text-[11px] tracking-widest text-slateMuted uppercase py-6 text-center">Your shopping bag is empty.</p>
            ) : (
              <>
                {/* Cart Items List */}
                <div className="space-y-4 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
                  {cart.map((item) => {
                    const product = item.product;
                    return (
                      <div key={`${product._id || product}-${item.size}-${item.color}`} className="flex items-center justify-between border-b border-zinc-100 pb-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={product.images && product.images[0] ? product.images[0] : ''}
                            alt={product.title}
                            className="h-14 w-10 object-cover object-center bg-zinc-50 border border-zinc-100"
                          />
                          <div>
                            <p className="text-[10px] font-semibold text-charcoal uppercase line-clamp-1">{product.title}</p>
                            <p className="text-[8px] tracking-widest text-slateMuted uppercase mt-0.5">
                              SIZE: {item.size} | QTY: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="text-[11px] font-semibold text-charcoal">Rs. {(product.price * item.quantity).toLocaleString()}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Subtotals Breakdowns */}
                <div className="space-y-2.5 pt-4 text-[11px] tracking-widest uppercase border-t border-zinc-100">
                  <div className="flex justify-between text-zinc-500">
                    <span>BAG SUBTOTAL</span>
                    <span>Rs. {cartSubtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>PREMIUM COURIER DELIVERY</span>
                    <span>{shippingFee === 0 ? 'COMPLIMENTARY' : `Rs. ${shippingFee.toLocaleString()}`}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>LOCAL VALUE TAX (8%)</span>
                    <span>Rs. {estimatedTax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-charcoal font-bold pt-4 border-t border-zinc-100 text-sm">
                    <span>ESTIMATED TOTAL</span>
                    <span>Rs. {grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                {checkoutError && (
                  <p className="text-[10px] text-red-600 font-semibold tracking-wider uppercase">{checkoutError}</p>
                )}

                {/* Secure Checkout button */}
                <button
                  type="submit"
                  disabled={!user || checkoutLoading || cart.length === 0}
                  onClick={handleCheckoutSubmit}
                  className={`w-full py-4 text-center text-[10px] font-semibold tracking-widest text-white uppercase transition-colors flex items-center justify-center space-x-2 ${
                    !user || cart.length === 0
                      ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                      : 'bg-charcoal hover:bg-zinc-800'
                  }`}
                >
                  {checkoutLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <span>🔒 AUTHORIZE SECURE CHECKOUT</span>
                    </>
                  )}
                </button>

                {!user && (
                  <p className="text-[9px] tracking-widest text-center text-slateMuted uppercase">
                    Please log in or register on the left to proceed.
                  </p>
                )}
              </>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
