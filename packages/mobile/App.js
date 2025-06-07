import React, { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { AuthProvider } from './context/AuthContext';
import { LobbyProvider } from './context/LobbyContext';
import { GameProvider } from './context/GameContext';
import { ThemeProvider } from './context/ThemeContext';

import Navigation from './Navigation';
import LobbyJoinedModal from './components/LobbyJoinedModal';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('📛 Bildirim izni verilmedi.');
      }
    };

    if (Platform.OS !== 'web') {
      requestPermissions();
    }
  }, []);

  return (
    <AuthProvider>
      <LobbyProvider>
        <GameProvider>
          <ThemeProvider>
            <LobbyJoinedModal />
            <Navigation />
          </ThemeProvider>
        </GameProvider>
      </LobbyProvider>
    </AuthProvider>
  );
}
