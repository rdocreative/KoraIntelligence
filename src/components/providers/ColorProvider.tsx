"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type ColorContextType = {
  color: string;
  setColor: (color: string) => void;
  saveColor: () => void;
  cancelColor: () => void;
  presets: string[];
};

const ColorContext = createContext<ColorContextType | undefined>(undefined);

const PRESETS = [
  "#CB0104", // Default Red
  "#FF784F", // Orange
  "#8549BA", // Purple
  "#1CB0F6", // Blue
  "#58CC02", // Green
  "#FF9600", // Amber
  "#3A4E48", // Dark Teal
  "#7F95D1", // Soft Blue
  "#E040FB", // Magenta
  "#FFFFFF", // White
];

// Utility to darken a hex color for the 3D effect/shadows
const darkenColor = (hex: string, percent: number) => {
  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5, 7), 16);

  r = Math.floor(r * (100 - percent) / 100);
  g = Math.floor(g * (100 - percent) / 100);
  b = Math.floor(b * (100 - percent) / 100);

  r = (r < 255) ? r : 255;
  g = (g < 255) ? g : 255;
  b = (b < 255) ? b : 255;

  const RR = ((r.toString(16).length === 1) ? "0" + r.toString(16) : r.toString(16));
  const GG = ((g.toString(16).length === 1) ? "0" + g.toString(16) : g.toString(16));
  const BB = ((b.toString(16).length === 1) ? "0" + b.toString(16) : b.toString(16));

  return "#" + RR + GG + BB;
};

export const ColorProvider = ({ children }: { children: React.ReactNode }) => {
  const [color, setColorState] = useState("#CB0104");
  // Keep track of the saved color to revert if needed
  const [savedColorState, setSavedColorState] = useState("#CB0104");

  const applyColorToCSS = (hex: string) => {
    const root = document.documentElement;
    root.style.setProperty('--accent-color', hex);
    
    // Calculate dark variant for shadows/borders (approx 30% darker)
    const darkColor = hex.toLowerCase() === '#ffffff' ? '#CCCCCC' : darkenColor(hex, 30);
    root.style.setProperty('--accent-dark', darkColor);
  };

  useEffect(() => {
    // Load from local storage on mount
    const storedColor = localStorage.getItem("kora-accent-color");
    if (storedColor) {
      setColorState(storedColor);
      setSavedColorState(storedColor);
      applyColorToCSS(storedColor);
    } else {
      // Default
      applyColorToCSS("#CB0104");
    }
  }, []);

  // Update visual state and CSS but DO NOT save to localStorage yet
  const setColor = (newColor: string) => {
    setColorState(newColor);
    applyColorToCSS(newColor);
  };

  // Persist the current color state to localStorage
  const saveColor = () => {
    localStorage.setItem("kora-accent-color", color);
    setSavedColorState(color);
  };

  // Revert to the last saved color (from localStorage/state)
  const cancelColor = () => {
    setColorState(savedColorState);
    applyColorToCSS(savedColorState);
  };

  return (
    <ColorContext.Provider value={{ color, setColor, saveColor, cancelColor, presets: PRESETS }}>
      {children}
    </ColorContext.Provider>
  );
};

export const useAppColor = () => {
  const context = useContext(ColorContext);
  if (context === undefined) {
    throw new Error('useAppColor must be used within a ColorProvider');
  }
  return context;
};