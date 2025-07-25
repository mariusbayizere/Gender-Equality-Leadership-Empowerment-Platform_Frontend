
import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

const initialState = {
    theme: "system",
    setTheme: () => null,
    isDarkMode: false,
    toggleDarkMode: () => null,
};

export const ThemeProviderContext = createContext(initialState);

export function ThemeProvider({ children, defaultTheme = "system", storageKey = "vite-ui-theme", ...props }) {
    const [theme, setTheme] = useState(() => localStorage.getItem(storageKey) || defaultTheme);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");

        let actualTheme;
        if (theme === "system") {
            actualTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        } else {
            actualTheme = theme;
        }

        root.classList.add(actualTheme);
        setIsDarkMode(actualTheme === "dark");
    }, [theme]);

    // Toggle function that switches between light and dark (no system)
    const toggleDarkMode = () => {
        const newTheme = isDarkMode ? "light" : "dark";
        localStorage.setItem(storageKey, newTheme);
        setTheme(newTheme);
    };

    const value = {
        theme,
        setTheme: (newTheme) => {
            localStorage.setItem(storageKey, newTheme);
            setTheme(newTheme);
        },
        isDarkMode,
        toggleDarkMode,
    };

    return (
        <ThemeProviderContext.Provider
            {...props}
            value={value}
        >
            {children}
        </ThemeProviderContext.Provider>
    );
}

// Custom hook to use the theme
export const useTheme = () => {
    const context = useContext(ThemeProviderContext);
    
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    
    return context;
};

ThemeProvider.propTypes = {
    children: PropTypes.node,
    defaultTheme: PropTypes.string,
    storageKey: PropTypes.string,
};
