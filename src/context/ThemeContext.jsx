// src/context/ThemeContext.jsx

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const ThemeContext = createContext();

const DEFAULT_THEME = "autumn";

export const ThemeProvider = ({
  children,
}) => {
  const [theme, setTheme] =
    useState(() => {
      if (
        typeof window ===
        "undefined"
      ) {
        return DEFAULT_THEME;
      }

      try {
        return (
          localStorage.getItem(
            "theme"
          ) || DEFAULT_THEME
        );
      } catch {
        return DEFAULT_THEME;
      }
    });

  /* ============================
      APPLY THEME
  ============================ */

  useEffect(() => {
    if (
      typeof document ===
      "undefined"
    ) {
      return;
    }

    document.documentElement.setAttribute(
      "data-theme",
      theme
    );

    localStorage.setItem(
      "theme",
      theme
    );
  }, [theme]);

  /* ============================
      SYNC BETWEEN TABS
  ============================ */

  useEffect(() => {
    if (
      typeof window ===
      "undefined"
    ) {
      return;
    }

    const handleStorage = (
      event
    ) => {
      if (
        event.key === "theme"
      ) {
        setTheme(
          event.newValue ||
            DEFAULT_THEME
        );
      }
    };

    const handleThemeChange =
      () => {
        const saved =
          localStorage.getItem(
            "theme"
          );

        setTheme(
          saved ||
            DEFAULT_THEME
        );
      };

    window.addEventListener(
      "storage",
      handleStorage
    );

    window.addEventListener(
      "theme-change",
      handleThemeChange
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage
      );

      window.removeEventListener(
        "theme-change",
        handleThemeChange
      );
    };
  }, []);

  /* ============================
      SET THEME
  ============================ */

  const changeTheme =
    useCallback(
      (newTheme) => {
        setTheme(newTheme);

        localStorage.setItem(
          "theme",
          newTheme
        );

        window.dispatchEvent(
          new Event(
            "theme-change"
          )
        );
      },
      []
    );

  /* ============================
      TOGGLE THEME
  ============================ */

  const toggleTheme =
    useCallback(() => {
      changeTheme(
        theme === "autumn"
          ? "sunset"
          : "autumn"
      );
    }, [
      theme,
      changeTheme,
    ]);

  /* ============================
      CONTEXT VALUE
  ============================ */

  const value = useMemo(
    () => ({
      theme,
      changeTheme,
      toggleTheme,
    }),
    [
      theme,
      changeTheme,
      toggleTheme,
    ]
  );

  return (
    <ThemeContext.Provider
      value={value}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context =
    useContext(
      ThemeContext
    );

  if (!context) {
    throw new Error(
      "useTheme must be used within ThemeProvider."
    );
  }

  return context;
};