'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation'

// Create Cart Context
const CartContext = createContext();

// Custom hook to use the Cart Context
export const useCart = () => useContext(CartContext);

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const pathname = usePathname()
  const outletSlug = pathname.split('/')[1]

  const fetchCartItems = async () => {
    try {
      const response = await fetch(`/api/cart/${outletSlug}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (response.status === 200) {
        const cartItems = await response.json();
        setCartItems(cartItems);
      }
      return cartItems;
    }
    catch (error) {
      console.error('Error fetching cart items:', error);
      return cartItems;
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  // Function to add item to cart
  const addToCart = async (item, variant, addons, totalPrice, quantity) => {
    const uniqueItemKey = `${item.id}-${variant?.id || 'default'}-${addons.map(addon => addon.id).sort().join('-')}`;
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((cartItem) => cartItem.id === uniqueItemKey);

      if (existingItemIndex !== -1) {
        // Update quantity if item with same customization already exists in cart
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      }

      // Add new customized item to cart
      return [...prevItems, {
        id: uniqueItemKey,
        food_item: item,
        quantity,
        variant,
        addons,
        totalPrice,
      }];
    });

    // Try to sync with backend
    try {
      const response = await fetch(`/api/cart/${outletSlug}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: uniqueItemKey,
          food_item_id: item.id,
          variant_id: variant?.id,
          quantity,
          totalPrice: totalPrice,
          addons: addons?.map((addon) => {
            return addon.id
          }),
        })
      })
      if (response.status !== 200) {
        throw new Error('Error adding item to cart');
      }
      const cartItems = await response.json();
      setCartItems(cartItems);
    } catch (error) {
      console.error('Error adding item to cart:', error);
    };
    setIsDrawerOpen(false);
  }

  // Function to update item quantity in cart
  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity <= 0) {
      return removeFromCart(id);
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? {
          ...item,
          totalPrice: item.addons.reduce((sum, addon) => sum + parseFloat(addon.price), 0) +
            ((item.variant ? parseFloat(item.variant.price) : parseFloat(item.food_item.price)) *
              newQuantity),
          quantity: newQuantity,
        } : item
      )
    );
    // Trying to sync with backend
    try {
      const response = await fetch(`/api/cart/${outletSlug}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      })
      if (response.status !== 200) {
        throw new Error('Error updating item quantity in cart');
      }
    } catch (error) {
      console.error('Error updating item quantity in cart:', error);
    }
  };

  // Function to remove item from cart
  const removeFromCart = async (id) => {
    try {
      const response = await fetch(`/api/cart/${outletSlug}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (response.status !== 200) {
        throw new Error('Error removing item from cart');
      }
      const cartItems = await response.json();
      setCartItems(cartItems);
    } catch (error) {
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== id)
      );
    }
  };

  // Function to open customization drawer for an item
  const openDrawerForItem = (item) => {
    setCurrentItem(item);
    setIsDrawerOpen(true);
  };

  // Function to close customization drawer
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setCurrentItem(null);
  };

  return (
    <CartContext.Provider
      value={{
        fetchCartItems,
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        isDrawerOpen,
        openDrawerForItem,
        closeDrawer,
        currentItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
