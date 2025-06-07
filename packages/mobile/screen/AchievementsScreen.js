import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const AchievementsScreen = () => {
  const { theme } = useTheme();

  const achievements = [
    { icon: '🎯', text: 'İlk oyun oynandı' },
    { icon: '💪', text: '1000 skor elde edildi' },
    { icon: '🔥', text: '2 saat kesintisiz oynama' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text
        style={[
          styles.title,
          {
            color: theme.text,
            fontFamily: 'Orbitron-Bold',
            textShadowColor: theme.mode === 'dark' ? '#000' : '#aaa',
            textShadowOffset: { width: 1, height: 2 },
            textShadowRadius: 3,
          },
        ]}
      >
        🏆 Başarımlar
      </Text>

      {achievements.map((item, index) => (
        <View key={index} style={[styles.card, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}>
          <Text style={[styles.achievementText, { color: theme.text }]}>
            {item.icon} {item.text}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 26,
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,
    elevation: 3,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  achievementText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AchievementsScreen;
