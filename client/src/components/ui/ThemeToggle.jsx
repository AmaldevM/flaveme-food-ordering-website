import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2.5 rounded-full bg-white/10 dark:bg-black/20 hover:bg-white/20 dark:hover:bg-black/35 active:scale-95 border border-white/15 dark:border-gray-800 text-amber-500 transition-all flex items-center justify-center shadow-md cursor-pointer"
      title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-yellow-400 animate-pulse" />
      ) : (
        <Moon className="w-5 h-5 text-white hover:text-amber-400 transition-colors" />
      )}
    </button>
  );
}
