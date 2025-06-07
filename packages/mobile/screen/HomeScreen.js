import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Switch,
  Animated,
  ImageBackground,
  Modal, TouchableWithoutFeedback, Pressable,Easing
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';


import { logout, getGames } from '../src/api';
import { AuthContext } from '../context/AuthContext';
import { LobbyContext } from '../context/LobbyContext';
import { GameContext } from '../context/GameContext';
import { useTheme } from '../context/ThemeContext';

import LobbyModal from '../components/LobbyModal';
import GameDetailModal from '../components/GameDetailModal';

import waveLight from '../assets/wave-light.png';
import waveDark from '../assets/wave-dark.png';

const HomeScreen = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, setUser } = useContext(AuthContext);
  const { openLobbyModal } = useContext(LobbyContext);
  const { setSelectedGame, setGameDetailModalVisible } = useContext(GameContext);
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [games, setGames] = useState([]);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(300)).current; // başlangıç değeri 300

  useEffect(() => {
    getGames()
      .then((data) => setGames(data))
      .catch((err) => console.log("Oyunlar alınamadı:", err));
  }, []);

  useEffect(() => {
    if (menuVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      slideAnim.setValue(300); // kapandığında sıfırla
    }
  }, [menuVisible]);

  const handleLogout = () => {
    logout().then(() => setUser(null));
  };

  const animateSwitch = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.2, duration: 150, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
    toggleTheme();
  };

  
  const renderGame = ({ item }) => (
    <LinearGradient
      colors={theme.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientBorder}
    >
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => {
          setSelectedGame(item);
          setGameDetailModalVisible(true);
        }}
        style={[styles.gameCard, { backgroundColor: theme.surface }]}
      >
        <Image source={{ uri: item.icon }} style={styles.gameIcon} />
        <Text
          style={[
            styles.gameName,
            {
              color: theme.text,
              textShadowColor: theme.mode === 'dark' ? '#7f5af0' : '#339af0',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 4,
            },
          ]}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );

  return (
    <ImageBackground
      source={theme.mode === 'dark' ? waveDark : waveLight}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={[styles.container, { backgroundColor: 'transparent' }]}>
        {/* Tema Switch */}
        <View style={styles.themeSwitch}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Switch
              value={theme.mode === 'dark'}
              onValueChange={animateSwitch}
              thumbColor={theme.mode === 'dark' ? '#fff' : '#000'}
              trackColor={{ false: '#bbb', true: '#666' }}
            />
          </Animated.View>
        </View>

        <Text style={[styles.welcome, { color: theme.text }]}>
          Hoş geldin, {user?.email} 🎮
        </Text>

        <FlatList
          data={games}
          renderItem={renderGame}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ paddingVertical: 10 }}
        />

 {/* Alt Menü */}
<View style={[styles.tabBar, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}>
  
  {/* Sol: Menü Butonu */}
  <TouchableOpacity style={styles.tabItem} onPress={() => setMenuVisible(true)}>
    <Feather name="menu" size={24} color={theme.text} />
    <Text style={[styles.tabText, { color: theme.text }]}>Menü</Text>
  </TouchableOpacity>

  {/* Orta: Lobi Butonu */}
  <TouchableOpacity style={styles.lobbyButton} onPress={openLobbyModal}>
    <Feather name="plus-circle" size={28} color="#fff" />
    <Text style={styles.lobbyButtonText}>Lobi</Text>
  </TouchableOpacity>

  {/* Sağ: Çıkış */}
  <TouchableOpacity style={styles.tabItem} onPress={handleLogout}>
    <Ionicons name="exit-outline" size={24} color={theme.text} />
    <Text style={[styles.tabText, { color: theme.text }]}>Çıkış</Text>
  </TouchableOpacity>
</View>

<Modal
  visible={menuVisible}
  transparent
  animationType="none"
  onRequestClose={() => setMenuVisible(false)}
>
  <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
    <View style={styles.modalOverlay}>
      <Animated.View
        style={[
          styles.slideMenuBox,
          {
            backgroundColor: theme.surface,
            transform: [{ translateY: slideAnim }],
            shadowColor: theme.shadow,
          },
        ]}
      >
        <Text style={[styles.menuTitle, { color: theme.text }]}>Menü</Text>

        <Pressable style={styles.menuItemRow} onPress={() => { setMenuVisible(false); navigation.navigate("Profile"); }}>
          <Feather name="user" size={20} color={theme.text} style={styles.menuIcon} />
          <Text style={[styles.menuItemText, { color: theme.text }]}>Profil</Text>
        </Pressable>

        <Pressable style={styles.menuItemRow} onPress={() => { setMenuVisible(false); navigation.navigate("Stats"); }}>
          <Feather name="bar-chart-2" size={20} color={theme.text} style={styles.menuIcon} />
          <Text style={[styles.menuItemText, { color: theme.text }]}>İstatistikler</Text>
        </Pressable>

        <Pressable style={styles.menuItemRow} onPress={() => { setMenuVisible(false); navigation.navigate("Chat"); }}>
          <Feather name="message-circle" size={20} color={theme.text} style={styles.menuIcon} />
          <Text style={[styles.menuItemText, { color: theme.text }]}>Sohbet</Text>
        </Pressable>

        <Pressable style={styles.menuItemRow} onPress={() => { setMenuVisible(false); navigation.navigate("Lobbies"); }}>
          <Feather name="layers" size={20} color={theme.text} style={styles.menuIcon} />
          <Text style={[styles.menuItemText, { color: theme.text }]}>Lobiler</Text>
        </Pressable>

        <Pressable style={styles.menuItemRow} onPress={() => { setMenuVisible(false); navigation.navigate("Achievements"); }}>
          <Feather name="award" size={20} color={theme.text} style={styles.menuIcon} />
          <Text style={[styles.menuItemText, { color: theme.text }]}>Başarımlar</Text>
        </Pressable>
      </Animated.View>
    </View>
  </TouchableWithoutFeedback>
</Modal>




        <LobbyModal />
        <GameDetailModal />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  welcome: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Orbitron-Bold',
    marginBottom: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
  },
  gradientBorder: {
    borderRadius: 20,
    padding: 2,
    marginHorizontal: 10,
    marginBottom: 16,
    
  },
  gameCard: {
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    flex: 1,
  },
  gameIcon: {
    width: 72,
    height: 72,
    marginBottom: 12,
    borderRadius: 12,
  },
  gameName: {
    fontSize: 14,
    fontFamily: 'Orbitron-Bold',
    textAlign: 'center',
  },

  // 🌟 ALT MENÜ YENİ YAPI 🌟
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 12,
    fontFamily: 'Orbitron-Bold',
    marginTop: 4,
  },
  lobbyButton: {
    backgroundColor: '#4A90E2', // Temaya bağlı: theme.primary
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  lobbyButtonText: {
    color: '#fff',
    fontFamily: 'Orbitron-Bold',
    fontSize: 12,
    marginTop: 2,
  },

  // 🎛️ Tema Switch
  themeSwitch: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },

  // 📂 Açılır Menü
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuBox: {
    width: '80%',
    padding: 20,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  menuTitle: {
    fontSize: 20,
    fontFamily: 'Orbitron-Bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  menuItem: {
    fontSize: 16,
    paddingVertical: 10,
    fontFamily: 'Orbitron-Bold',
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: 'Orbitron-Bold',
  },
  slideMenuBox: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    width: '85%',
    borderRadius: 16,
    padding: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: 'Orbitron-Bold',
  },
  
  
});


export default HomeScreen;
