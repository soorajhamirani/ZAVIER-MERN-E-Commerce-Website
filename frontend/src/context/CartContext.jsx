import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('finery_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isBagAnimating, setIsBagAnimating] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('finery_cart', JSON.stringify(cart));
  }, [cart]);

  // Sync cart to server when user is logged in
  useEffect(() => {
    const syncCartWithServer = async () => {
      if (user && user.token) {
        try {
          const apiCart = cart.map(item => ({
            product: item.product._id || item.product,
            size: item.size,
            color: item.color,
            quantity: item.quantity
          }));
          
          await fetch('/api/auth/cart', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({ cart: apiCart })
          });
        } catch (err) {
          console.error('Failed to sync cart with database', err);
        }
      }
    };
    
    // De-bounce sync slightly or sync on cart state change
    const delayDebounceFn = setTimeout(() => {
      syncCartWithServer();
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [cart, user]);

  const addToCart = (product, size, color, quantity = 1) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) =>
          (item.product._id || item.product) === product._id &&
          item.size === size &&
          item.color === color
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      } else {
        return [...prevCart, { product, size, color, quantity }];
      }
    });

    // Trigger bubble animation handshake
    setIsBagAnimating(true);
    setTimeout(() => {
      setIsBagAnimating(false);
    }, 400);
  };

  const removeFromCart = (productId, size, color) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !((item.product._id || item.product) === productId &&
            item.size === size &&
            item.color === color)
      )
    );
  };

  const updateQuantity = (productId, size, color, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        (item.product._id || item.product) === productId &&
        item.size === size &&
        item.color === color
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const cartSubtotal = cart.reduce((subtotal, item) => {
    const price = item.product.price || 0;
    return subtotal + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        isBagAnimating,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
