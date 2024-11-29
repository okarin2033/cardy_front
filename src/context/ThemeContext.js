import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const theme = Cookies.get('theme');
    return theme === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
      Cookies.set('theme', 'dark', { expires: 365 });
    } else {
      document.body.classList.remove('dark-theme');
      Cookies.set('theme', 'light', { expires: 365 });
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
