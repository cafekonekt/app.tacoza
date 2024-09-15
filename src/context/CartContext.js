"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { getCart, addItemToCart } from "@/app/lib/cart/getCart";
import { updateCartItem, deleteCartItem } from "@/app/lib/cart/updateCart";

// Create Cart Context
const CartContext = createContext();

// Custom hook to use the Cart Context
export const useCart = () => useContext(CartContext);

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const pathname = usePathname();
  const outletSlug = pathname.split("/")[1];

  const fetchCartItems = async () => {
    const cartItems = await getCart(outletSlug);
    if (cartItems) {
      setCartItems(cartItems);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  // Function to add item to cart
  const addToCart = async (item, variant, addons, totalPrice, quantity) => {
    const uniqueItemKey = `${item.id}-${variant?.id || "default"}-${addons
      .map((addon) => addon.id)
      .sort()
      .join("-")}`;
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (cartItem) => cartItem.item_id === uniqueItemKey,
      );

      if (existingItemIndex !== -1) {
        // Update quantity if item with same customization already exists in cart
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      }

      // Add new customized item to cart
      return [
        ...prevItems,
        {
          item_id: uniqueItemKey,
          food_item: item,
          quantity,
          variant,
          addons,
          totalPrice,
        },
      ];
    });

    // Try to sync with backend
    const cartItems = await addItemToCart(outletSlug, {
      id: uniqueItemKey,
      food_item_id: item.id,
      variant_id: variant?.id || "",
      quantity,
      totalPrice: totalPrice,
      addons: addons?.map((addon) => {
        return addon.id;
      }),
    });
    if (cartItems) {
      setCartItems(cartItems);
    }
    setIsDrawerOpen(false);
  };

  // Function to update item quantity in cart
  const updateQuantity = async (item_id, newQuantity) => {
    if (newQuantity <= 0) {
      return removeFromCart(item_id);
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.item_id === item_id
          ? {
              ...item,
              totalPrice:
                item.addons.reduce(
                  (sum, addon) => sum + parseFloat(addon.price),
                  0,
                ) +
                (item.variant
                  ? parseFloat(item.variant.price)
                  : parseFloat(item.food_item.price)) *
                  newQuantity,
              quantity: newQuantity,
            }
          : item,
      ),
    );
    // Trying to sync with backend
    const cartItems = await updateCartItem(outletSlug, item_id, newQuantity);
    if (cartItems) {
      setCartItems(cartItems);
    }
  };

  // Function to remove item from cart
  const removeFromCart = async (item_id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.item_id !== item_id));
    const cartItems = await deleteCartItem(outletSlug, item_id);
    if (cartItems) {
      setCartItems(cartItems);
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
