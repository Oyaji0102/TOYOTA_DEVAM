import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import i18n from '../src/i18n/i18n';

const AchievementsScreen = () => {
  const { theme } = useTheme();
  const { language } = useLanguage();

  const achievements = [
    { icon: '🎯', key: 'firstGame' },
    { icon: '💪', key: 'score1000' },
    { icon: '🔥', key: 'play2Hours' },
    { icon: '🏆', key: 'win10Games' },
    { icon: '🌟', key: 'completeAllGames' },
    { icon: '⚡', key: 'quickWin' }
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
        {i18n.t('achievements.title')}
      </Text>

      {achievements.map((item, index) => (
        <View key={index} style={[styles.card, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}>
          <Text style={[styles.achievementText, { color: theme.text }]}>
            {item.icon} {i18n.t(`achievements.${item.key}`)}
          </Text>
          <Text style={[styles.achievementStatus, { color: theme.subtext }]}>
            {i18n.t('achievements.locked')}
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
  achievementStatus: {
    fontSize: 14,
    marginTop: 4,
  }
});

export default AchievementsScreen;
