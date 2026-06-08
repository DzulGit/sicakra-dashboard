"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children, ...props }: any) {
  // Biarkan berjalan normal tanpa penundaan mounted state
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}