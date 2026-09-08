import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem('cartItems')) || []
  );

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty, size) => {
    const existItem = cartItems.find((x) => x.product === product._id && x.size === size);

    if (existItem) {
      setCartItems(
        cartItems.map((x) =>
          x.product === existItem.product && x.size === size ? { ...existItem, qty: existItem.qty + qty } : x
        )
      );
    } else {
      setCartItems([...cartItems, { 
        product: product._id, 
        name: product.name, 
        image: product.images[0], 
        price: product.price, 
        brand: product.brand,
        qty, 
        size 
      }]);
    }
  };

  const removeFromCart = (id, size) => {
    setCartItems(cartItems.filter((x) => !(x.product === id && x.size === size)));
  };

  const updateQty = (id, size, qty) => {
    setCartItems(
      cartItems.map((x) =>
        x.product === id && x.size === size ? { ...x, qty } : x
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
