"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Passamos as props do App.tsx diretamente para o NextThemesProvider
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}