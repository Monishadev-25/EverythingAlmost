import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);
const CART_STORAGE_KEY = 'everythingalmost_cart';
const PROMO_STORAGE_KEY = 'everythingalmost_promo';
const FREE_SHIPPING_THRESHOLD = 50.0;
const STANDARD_SHIPPING_COST = 4.99;

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = window.localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [promoCode, setPromoCode] = useState(() => {
    try {
      return window.localStorage.getItem(PROMO_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });

  const [notification, setNotification] = useState(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage quota or disabled
    }
  }, [items]);

  useEffect(() => {
    try {
      window.localStorage.setItem(PROMO_STORAGE_KEY, promoCode);
    } catch {
      // storage quota
    }
  }, [promoCode]);

  // Clear notification timer
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 3000);
    return () => clearTimeout(timer);
  }, [notification]);

  const addToCart = (product, quantity = 1, customization = null) => {
    const customKey = customization && Object.keys(customization).length > 0
      ? JSON.stringify(customization)
      : 'standard';
    const itemKey = `${product.id}__${customKey}`;

    setItems((prev) => {
      const index = prev.findIndex((item) => (item.key || item.product.id) === itemKey);
      if (index > -1) {
        const next = [...prev];
        next[index] = {
          ...next[index],
          quantity: next[index].quantity + quantity,
        };
        return next;
      }
      return [...prev, { key: itemKey, product, quantity, customization }];
    });

    setNotification({
      type: 'add',
      message: `Added "${product.name}" to cart.`,
      product,
    });
  };

  const updateQuantity = (itemKeyOrId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemKeyOrId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        const matches = item.key ? item.key === itemKeyOrId : item.product.id === itemKeyOrId;
        return matches ? { ...item, quantity } : item;
      })
    );
  };

  const removeFromCart = (itemKeyOrId) => {
    setItems((prev) =>
      prev.filter((item) => {
        const matches = item.key ? item.key === itemKeyOrId : item.product.id === itemKeyOrId;
        return !matches;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setPromoCode('');
  };

  const applyPromoCode = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'WELCOME' || clean === 'XMAS10' || clean === 'GIFT10') {
      setPromoCode(clean);
      return { success: true, message: `Code "${clean}" applied! 10% discount added.` };
    }
    return { success: false, message: 'Invalid promo code. Try using WELCOME for 10% off.' };
  };

  const removePromoCode = () => {
    setPromoCode('');
  };

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  const discountRate = promoCode ? 0.1 : 0.0;
  const discount = subtotal * discountRate;
  const discountedSubtotal = subtotal - discount;

  const isFreeShipping = items.length > 0 && discountedSubtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = items.length === 0 ? 0 : isFreeShipping ? 0 : STANDARD_SHIPPING_COST;
  const total = items.length === 0 ? 0 : discountedSubtotal + shippingCost;
  const freeShippingRemainder = Math.max(0, FREE_SHIPPING_THRESHOLD - discountedSubtotal);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        promoCode,
        applyPromoCode,
        removePromoCode,
        subtotal,
        discount,
        shippingCost,
        total,
        isFreeShipping,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        freeShippingRemainder,
        cartCount,
        notification,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}

