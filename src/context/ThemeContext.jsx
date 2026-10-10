import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const THEME_KEY = "workflow_theme";

const ThemeContext =
  createContext(undefined);

const validThemes = [
  "light",
  "dark",
  "system",
];

const getInitialTheme = () => {
  const storedTheme =
    localStorage.getItem(
      THEME_KEY
    );

  if (
    validThemes.includes(
      storedTheme
    )
  ) {
    return storedTheme;
  }

  return "light";
};

function getSystemTheme() {
  return window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches
    ? "dark"
    : "light";
}

function ThemeProvider({
  children,
}) {
  const [theme, setTheme] =
    useState(getInitialTheme);

  const applyTheme =
    useCallback((selectedTheme) => {
      const root =
        document.documentElement;

      const resolvedTheme =
        selectedTheme === "system"
          ? getSystemTheme()
          : selectedTheme;

      root.setAttribute(
        "data-theme",
        resolvedTheme
      );

      root.setAttribute(
        "data-theme-mode",
        selectedTheme
      );
    }, []);

  useEffect(() => {
    localStorage.setItem(
      THEME_KEY,
      theme
    );

    applyTheme(theme);
  }, [
    theme,
    applyTheme,
  ]);

  useEffect(() => {
    if (theme !== "system") {
      return;
    }

    const mediaQuery =
      window.matchMedia(
        "(prefers-color-scheme: dark)"
      );

    const handleChange = () => {
      applyTheme("system");
    };

    mediaQuery.addEventListener(
      "change",
      handleChange
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        handleChange
      );
    };
  }, [
    theme,
    applyTheme,
  ]);

  const changeTheme = useCallback(
    (nextTheme) => {
      if (
        !validThemes.includes(
          nextTheme
        )
      ) {
        return;
      }

      setTheme(nextTheme);
    },
    []
  );

  const value = useMemo(
    () => ({
      theme,
      changeTheme,
    }),
    [
      theme,
      changeTheme,
    ]
  );

  return (
    <ThemeContext.Provider
      value={value}
    >
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const context =
    useContext(
      ThemeContext
    );

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider."
    );
  }

  return context;
}

export {
  ThemeContext,
  ThemeProvider,
  useTheme,
};