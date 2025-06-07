import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const StatsScreen = () => {
  const { theme } = useTheme();

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
        📊 İstatistikler
      </Text>

      <View style={[styles.card, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}>
        <Text style={[styles.statLabel, { color: theme.subtext }]}>Oynanan oyun:</Text>
        <Text style={[styles.statValue, { color: theme.text }]}>12</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}>
        <Text style={[styles.statLabel, { color: theme.subtext }]}>Toplam süre:</Text>
        <Text style={[styles.statValue, { color: theme.text }]}>5 saat</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}>
        <Text style={[styles.statLabel, { color: theme.subtext }]}>Toplam skor:</Text>
        <Text style={[styles.statValue, { color: theme.text }]}>7800</Text>
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
