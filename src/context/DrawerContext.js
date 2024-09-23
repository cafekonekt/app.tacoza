"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const DrawerContext = createContext();

export const useDrawer = () => useContext(DrawerContext);

export const DrawerProvider = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const openDrawer = (item) => {
    setIsDrawerOpen(true);
    setCurrentItem(item);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setCurrentItem(null);
  };

  return (
    <DrawerContext.Provider
      value={{
        isDrawerOpen,
        setIsDrawerOpen,
        openDrawer,
        closeDrawer,
        currentItem,
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
}