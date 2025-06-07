import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './screen/LoginScreen';
import HomeScreen from './screen/HomeScreen';
import ProfileScreen from './screen/ProfileScreen';
import StatsScreen from './screen/StatsScreen';
import ChatScreen from './screen/ChatScreen';
import AchievementsScreen from './screen/AchievementsScreen';
import LobbiesScreen from './screen/LobbiesScreen';
import TombalaGameScreen from './src/game/tombala/TombalaGameScreen';
import MinesweeperScreen from './src/game/mayin/MinesweeperScreen';

import { AuthContext } from './context/AuthContext';
import { navigationRef } from './navigation/NavigationRef'; // ✅ bunu ekle


const Stack = createStackNavigator();

export default function Navigation() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  return (
    <NavigationContainer ref={navigationRef}> 
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={user === null ? 'Login' : 'Home'}
      >
        {user === null ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Stats" component={StatsScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="Achievements" component={AchievementsScreen} />
            <Stack.Screen name="Lobbies" component={LobbiesScreen} />
            <Stack.Screen name="TombalaGameScreen" component={TombalaGameScreen} />
            <Stack.Screen name="MinesweeperScreen" component={MinesweeperScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
