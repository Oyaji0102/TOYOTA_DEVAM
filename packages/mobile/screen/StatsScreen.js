import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import i18n from '../src/i18n/i18n';

const StatsScreen = () => {
  const { theme } = useTheme();
  const { language } = useLanguage();

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
            textShadowRadius: 4,
          },
        ]}
      >
        {i18n.t('stats.title')}
      </Text>

      <View style={[styles.card, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}>
        <Text style={[styles.statLabel, { color: theme.subtext }]}>{i18n.t('stats.gamesPlayed')}:</Text>
        <Text style={[styles.statValue, { color: theme.text }]}>12</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}>
        <Text style={[styles.statLabel, { color: theme.subtext }]}>{i18n.t('stats.totalTime')}:</Text>
        <Text style={[styles.statValue, { color: theme.text }]}>5 {i18n.t('stats.hours')}</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}>
        <Text style={[styles.statLabel, { color: theme.subtext }]}>{i18n.t('stats.totalScore')}:</Text>
        <Text style={[styles.statValue, { color: theme.text }]}>7800</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}>
        <Text style={[styles.statLabel, { color: theme.subtext }]}>{i18n.t('stats.winRate')}:</Text>
        <Text style={[styles.statValue, { color: theme.text }]}>65%</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}>
        <Text style={[styles.statLabel, { color: theme.subtext }]}>{i18n.t('stats.bestScore')}:</Text>
        <Text style={[styles.statValue, { color: theme.text }]}>1200</Text>
      </View>
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
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  statLabel: {
    fontSize: 16,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Orbitron-Bold',
  },
});

export default StatsScreen;
