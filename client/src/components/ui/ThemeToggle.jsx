import React, { useEffect } from "react";

export default function ThemeToggle() {
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }, []);

  return null;
}
