// File: src/core/theme/ThemeProvider.js
import React, { createContext, useContext, useState, useMemo } from 'react';
import ENV from '../config/env';
import tomatoTheme from './themes/tomato';
import majorelleTheme from './themes/majorelle';
import { Spacing, Radius, Typography, Shadows } from './tokens';

const themes = {
  tomato: tomatoTheme,
  majorelle: majorelleTheme,
};

const ThemeContext = createContext({
  theme: tomatoTheme,
  themeId: 'tomato',
  setThemeId: () => {},
  tokens: { Spacing, Radius, Typography, Shadows },
});

export const ThemeProvider = ({ children, initialTheme = ENV.THEME }) => {
  const [themeId, setThemeId] = useState(themes[initialTheme] ? initialTheme : 'tomato');

  const value = useMemo(() => {
    const activeColors = themes[themeId] || tomatoTheme;
    return {
      theme: activeColors,
      themeId,
      setThemeId,
      tokens: { Spacing, Radius, Typography, Shadows },
    };
  }, [themeId]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;
