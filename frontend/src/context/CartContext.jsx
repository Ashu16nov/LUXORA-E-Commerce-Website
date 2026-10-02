import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem('cartItems')) || []
  );

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const MAX_ITEM_LIMIT = 3;

  const addToCart = (product, qty, size) => {
    const pId = product._id || product.id;
    const existItem = cartItems.find((x) => x.product === pId && x.size === size);
    const currentQty = existItem ? existItem.qty : 0;
    const newQty = currentQty + qty;

    if (newQty > MAX_ITEM_LIMIT) {
      const allowedAdd = Math.max(0, MAX_ITEM_LIMIT - currentQty);
      if (allowedAdd <= 0) {
        return {
          success: false,
          limitReached: true,
          message: `Maximum order limit of ${MAX_ITEM_LIMIT} pieces reached for "${product.name}".`
        };
      }
      
      setCartItems(
        cartItems.map((x) =>
          x.product === pId && x.size === size ? { ...x, qty: MAX_ITEM_LIMIT } : x
        )
      );

      return {
        success: true,
        capped: true,
        addedQty: allowedAdd,
        message: `Added ${allowedAdd} piece(s). (Maximum ${MAX_ITEM_LIMIT} pieces allowed per item)`
      };
    }

    if (existItem) {
      setCartItems(
        cartItems.map((x) =>
          x.product === pId && x.size === size ? { ...existItem, qty: newQty } : x
        )
      );
    } else {
      const imgUrl = Array.isArray(product.images) && product.images.length > 0 
        ? product.images[0] 
        : (product.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500');

      setCartItems([...cartItems, { 
        product: pId, 
        name: product.name, 
        image: imgUrl, 
        price: product.price, 
        brand: product.brand,
        stock: product.stock !== undefined ? product.stock : 15,
        qty: Math.min(qty, MAX_ITEM_LIMIT), 
        size 
      }]);
    }

    return {
      success: true,
      capped: false,
      addedQty: qty
    };
  };

  const removeFromCart = (id, size) => {
    setCartItems(cartItems.filter((x) => !(x.product === id && x.size === size)));
  };

  const updateQty = (id, size, qty) => {
    const finalQty = Math.min(Math.max(1, qty), MAX_ITEM_LIMIT);
    setCartItems(
      cartItems.map((x) =>
        x.product === id && x.size === size ? { ...x, qty: finalQty } : x
      )
    );
    return finalQty;
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQty, clearCart, MAX_ITEM_LIMIT }}>
      {children}
    </CartContext.Provider>
  );
};
