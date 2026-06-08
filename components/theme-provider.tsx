"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children, ...props }: any) {
  const [mounted, setMounted] = React.useState(false);

  // Efek ini hanya berjalan di browser setelah hydration selesai
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Jika belum mounted (masih di server), render children biasa tanpa membungkus NextThemesProvider
  if (!mounted) {
    return <>{children}</>;
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}