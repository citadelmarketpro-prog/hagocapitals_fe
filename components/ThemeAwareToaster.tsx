"use client";

import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { THEME_EVENT } from "@/context/DashboardThemeContext";

const STORAGE_KEY = "hago-dashboard-theme";

// The dashboard's dark mode is scoped to a wrapper div, not <html>, so it
// never reaches sonner's <Toaster/> (rendered once at the root layout,
// outside that subtree). This listens for the dashboard's own theme
// changes so toasts match whichever mode the dashboard is currently in.
export default function ThemeAwareToaster() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") setTheme(stored);

    function handleChange(e: Event) {
      const detail = (e as CustomEvent<"light" | "dark">).detail;
      if (detail === "dark" || detail === "light") setTheme(detail);
    }
    window.addEventListener(THEME_EVENT, handleChange);
    return () => window.removeEventListener(THEME_EVENT, handleChange);
  }, []);

  return <Toaster richColors position="top-center" theme={theme} />;
}
