import React, { createContext, useState, useContext } from 'react';
import { Appearance } from 'react-native';
import { useFonts } from 'expo-font';

import { lightTheme, darkTheme } from '../theme/themes';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const colorScheme = Appearance.getColorScheme(); // 'dark' or 'light'
  const [theme, setTheme] = useState(colorScheme === 'dark' ? darkTheme : lightTheme);

  const toggleTheme = () => {
    setTheme(prev => (prev.mode === 'light' ? darkTheme : lightTheme));
  };

  // ✅ Orbitron fontunu yükle
  const [fontsLoaded] = useFonts({
    'Orbitron-Bold': require('../assets/fonts/Orbitron-Bold.ttf'),
  });

  // Font henüz yüklenmediyse, uygulama hiçbir şey göstermesin
  if (!fontsLoaded) return null;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
