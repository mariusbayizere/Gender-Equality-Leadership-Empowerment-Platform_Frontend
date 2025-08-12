
// import { createContext, useContext, useEffect, useState } from "react";
// import PropTypes from "prop-types";

// const initialState = {
//     theme: "system",
//     setTheme: () => null,
//     isDarkMode: false,
//     toggleDarkMode: () => null,
// };

// export const ThemeProviderContext = createContext(initialState);

// export function ThemeProvider({ children, defaultTheme = "system", storageKey = "vite-ui-theme", ...props }) {
//     const [theme, setTheme] = useState(() => localStorage.getItem(storageKey) || defaultTheme);
//     const [isDarkMode, setIsDarkMode] = useState(false);

//     useEffect(() => {
//         const root = window.document.documentElement;
//         root.classList.remove("light", "dark");

//         let actualTheme;
//         if (theme === "system") {
//             actualTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
//         } else {
//             actualTheme = theme;
//         }

//         root.classList.add(actualTheme);
//         setIsDarkMode(actualTheme === "dark");
//     }, [theme]);

//     // Toggle function that switches between light and dark (no system)
//     const toggleDarkMode = () => {
//         const newTheme = isDarkMode ? "light" : "dark";
//         localStorage.setItem(storageKey, newTheme);
//         setTheme(newTheme);
//     };

//     const value = {
//         theme,
//         setTheme: (newTheme) => {
//             localStorage.setItem(storageKey, newTheme);
//             setTheme(newTheme);
//         },
//         isDarkMode,
//         toggleDarkMode,
//     };

//     return (
//         <ThemeProviderContext.Provider
//             {...props}
//             value={value}
//         >
//             {children}
//         </ThemeProviderContext.Provider>
//     );
// }

// // Custom hook to use the theme
// export const useTheme = () => {
//     const context = useContext(ThemeProviderContext);
    
//     if (context === undefined) {
//         throw new Error("useTheme must be used within a ThemeProvider");
//     }
    
//     return context;
// };

// ThemeProvider.propTypes = {
//     children: PropTypes.node,
//     defaultTheme: PropTypes.string,
//     storageKey: PropTypes.string,
// };
import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

const initialState = {
    theme: "system",
    setTheme: () => null,
    isDarkMode: false,
    toggleDarkMode: () => null,
};

export const ThemeProviderContext = createContext(initialState);

export function ThemeProvider({ 
    children, 
    defaultTheme = "system", 
    storageKey = "vite-ui-theme", 
    ...props 
}) {
    const [theme, setTheme] = useState(() => {
        try {
            return localStorage.getItem(storageKey) || defaultTheme;
        } catch {
            return defaultTheme;
        }
    });
    
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Handle theme application
    useEffect(() => {
        const root = window.document.documentElement;
        
        // Remove all theme classes first
        root.classList.remove("light", "dark");

        let actualTheme;
        if (theme === "system") {
            const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            actualTheme = systemPrefersDark ? "dark" : "light";
        } else {
            actualTheme = theme;
        }

        // Apply the theme class
        root.classList.add(actualTheme);
        setIsDarkMode(actualTheme === "dark");
        
        // Mark as mounted to prevent hydration issues
        if (!mounted) {
            setMounted(true);
        }
    }, [theme, mounted]);

    // Listen for system theme changes
    useEffect(() => {
        if (theme !== "system") return;

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        
        const handleChange = () => {
            const root = window.document.documentElement;
            root.classList.remove("light", "dark");
            
            const newTheme = mediaQuery.matches ? "dark" : "light";
            root.classList.add(newTheme);
            setIsDarkMode(newTheme === "dark");
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, [theme]);

    // Toggle function that switches between light and dark (no system)
    const toggleDarkMode = () => {
        try {
            const newTheme = isDarkMode ? "light" : "dark";
            localStorage.setItem(storageKey, newTheme);
            setTheme(newTheme);
            
            console.log('Theme toggled to:', newTheme);
        } catch (error) {
            console.error('Failed to save theme to localStorage:', error);
            // Still update the theme even if localStorage fails
            const newTheme = isDarkMode ? "light" : "dark";
            setTheme(newTheme);
        }
    };

    const value = {
        theme,
        setTheme: (newTheme) => {
            try {
                localStorage.setItem(storageKey, newTheme);
                setTheme(newTheme);
            } catch (error) {
                console.error('Failed to save theme to localStorage:', error);
                setTheme(newTheme);
            }
        },
        isDarkMode,
        toggleDarkMode,
    };

    // Prevent flash of wrong theme by not rendering until mounted
    if (!mounted) {
        return null;
    }

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