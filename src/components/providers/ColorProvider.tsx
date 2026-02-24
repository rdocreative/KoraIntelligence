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

// Converte Hex para string de canais HSL (ex: "0 100% 50%")
const hexToHSLChannels = (hex: string): string => {
  let r = 0, g = 0, b = 0;
  // Trata hex curto (#000) e longo (#000000)
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }

  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

// Utilitário para escurecer hex (para sombras 3D)
const darkenColor = (hex: string, percent: number) => {
  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5, 7), 16);

  r = Math.floor(r * (100 - percent) / 100);
  g = Math.floor(g * (100 - percent) / 100);
  b = Math.floor(b * (100 - percent) / 100);

  const RR = (r.toString(16).length === 1) ? "0" + r.toString(16) : r.toString(16);
  const GG = (g.toString(16).length === 1) ? "0" + g.toString(16) : g.toString(16);
  const BB = (b.toString(16).length === 1) ? "0" + b.toString(16) : b.toString(16);

  return "#" + RR + GG + BB;
};

export const ColorProvider = ({ children }: { children: React.ReactNode }) => {
  const [color, setColorState] = useState("#CB0104");
  const [savedColorState, setSavedColorState] = useState("#CB0104");

  const applyColorToCSS = (hex: string) => {
    const root = document.documentElement;
    const hslChannels = hexToHSLChannels(hex);
    
    // Injeta canais HSL na variável que o Tailwind usa: hsl(var(--primary))
    root.style.setProperty('--primary', hslChannels);
    root.style.setProperty('--ring', hslChannels);
    
    // Mantém o Hex para variáveis legadas/costumizadas
    root.style.setProperty('--accent-color', hex);
    const darkHex = hex.toLowerCase() === '#ffffff' ? '#CCCCCC' : darkenColor(hex, 30);
    root.style.setProperty('--accent-dark', darkHex);
    root.style.setProperty('--primary-dark', darkHex);

    // Ajusta contraste do texto (foreground)
    const lightness = parseInt(hslChannels.split(' ')[2]);
    root.style.setProperty('--primary-foreground', lightness > 60 ? '0 0% 0%' : '0 0% 100%');
  };

  useEffect(() => {
    const storedColor = localStorage.getItem("kora-accent-color");
    if (storedColor) {
      setColorState(storedColor);
      setSavedColorState(storedColor);
      applyColorToCSS(storedColor);
    } else {
      applyColorToCSS("#CB0104");
    }
  }, []);

  const setColor = (newColor: string) => {
    setColorState(newColor);
    applyColorToCSS(newColor);
  };

  const saveColor = () => {
    localStorage.setItem("kora-accent-color", color);
    setSavedColorState(color);
  };

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