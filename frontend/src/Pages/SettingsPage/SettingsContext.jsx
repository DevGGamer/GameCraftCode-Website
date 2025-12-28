import React, { createContext, useState, useEffect } from "react";

export const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Пробуем загрузить сохранённую тему из localStorage
    return localStorage.getItem("theme") || "system";
  });


  // Применяем тему (и на старте, и при изменении)
  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (mode) => {
      if (mode === "dark") {
        root.classList.add("dark");
        root.classList.remove("light");
      } else if (mode === "light") {
        root.classList.add("light");
        root.classList.remove("dark");
      } else {
        // "system" → определяем текущую системную тему
        const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        root.classList.toggle("dark", isSystemDark);
        root.classList.toggle("light", !isSystemDark);
      }
    };

    applyTheme(theme);
    localStorage.setItem("theme", theme);

    // Для системной темы слушаем изменения системных настроек
    if (theme === "system") {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyTheme("system");
      media.addEventListener("change", handler);
      return () => media.removeEventListener("change", handler);
    }
  }, [theme]);

  return (
    <SettingsContext.Provider
      value={{
        theme,
        setTheme,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
