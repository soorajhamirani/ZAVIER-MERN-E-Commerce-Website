import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartSubtotal, cartCount } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckoutRedirect = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-55 overflow-hidden">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md transform bg-white shadow-2xl transition-all duration-500 ease-in-out flex flex-col h-full">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-100 p-6">
            <h2 className="text-[12px] font-semibold tracking-widest text-charcoal uppercase flex items-center space-x-2">
              <ShoppingBag className="h-4 w-4" />
              <span>SHOPPING BAG ({cartCount})</span>
            </h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-zinc-400 hover:text-charcoal transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart List */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="h-12 w-12 text-zinc-300 stroke-[1] mb-4" />
                <p className="text-[11px] font-medium tracking-widest text-slateMuted uppercase">Your bag is empty.</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 border border-charcoal bg-charcoal px-6 py-2.5 text-[10px] font-semibold tracking-widest text-white hover:bg-zinc-800 uppercase"
                >
                  Shop New Arrivals
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map((item) => {
                  const product = item.product;
                  const itemKey = `${product._id || product}-${item.size}-${item.color}`;
                  
                  return (
                    <div key={itemKey} className="flex py-4 border-b border-zinc-100 last:border-0">
                      {/* Image */}
                      <div className="h-24 w-18 flex-shrink-0 overflow-hidden bg-zinc-100 border border-zinc-100">
                        <img
                          src={product.images && product.images[0] ? product.images[0] : ''}
                          alt={product.title}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>

                      {/* Info */}
                      <div className="ml-4 flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex justify-between text-[11px] font-medium text-charcoal uppercase">
                            <h3 className="line-clamp-1">{product.title}</h3>
                            <p className="ml-4 font-semibold">Rs. {(product.price * item.quantity).toLocaleString()}</p>
                          </div>
                          <p className="mt-1 text-[9px] tracking-widest text-slateMuted uppercase">
                            SIZE: {item.size} | COL: {item.color}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          {/* Quantity control */}
                          <div className="flex items-center border border-zinc-200 bg-canvas-light">
                            <button
                              onClick={() => updateQuantity(product._id || product, item.size, item.color, item.quantity - 1)}
                              className="px-2 py-1 text-[11px] font-semibold text-charcoal hover:bg-zinc-200"
                            >
                              -
                            </button>
                            <span className="px-3 text-[10px] font-medium text-charcoal">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(product._id || product, item.size, item.color, item.quantity + 1)}
                              className="px-2 py-1 text-[11px] font-semibold text-charcoal hover:bg-zinc-200"
                            >
                              +
                            </button>
                          </div>

                          {/* Delete trigger */}
                          <button
                            onClick={() => removeFromCart(product._id || product, item.size, item.color)}
                            className="text-zinc-400 hover:text-red-600 transition-colors flex items-center space-x-1"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Summary */}
          {cart.length > 0 && (
            <div className="border-t border-zinc-100 p-6 bg-canvas-light">
              <div className="flex justify-between text-[11px] font-semibold tracking-widest text-charcoal uppercase mb-2">
                <span>SUBTOTAL</span>
                <span>Rs. {cartSubtotal.toLocaleString()}</span>
              </div>
              <p className="text-[9px] tracking-widest text-slateMuted uppercase mb-6">
                {cartSubtotal >= 3500 
                  ? 'Complimentary Delivery Applied' 
                  : `Add Rs. ${(3500 - cartSubtotal).toLocaleString()} more for free premium delivery.`
                }
              </p>
              <button
                onClick={handleCheckoutRedirect}
                className="w-full py-4 text-center text-[10px] font-semibold tracking-widest text-white bg-charcoal hover:bg-zinc-800 transition-colors uppercase"
              >
                PROCEED TO SECURE CHECKOUT
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
