import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import i18n from '../src/i18n/i18n';

const ProfileScreen = () => {
  const { user } = useContext(AuthContext);
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
        {i18n.t('profile.title')}
      </Text>

      <View style={[styles.card, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}>
        <Text style={[styles.label, { color: theme.subtext }]}>{i18n.t('profile.email')}</Text>
        <Text style={[styles.value, { color: theme.text }]}>{user?.email}</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}>
        <Text style={[styles.label, { color: theme.subtext }]}>{i18n.t('profile.userId')}</Text>
        <Text style={[styles.value, { color: theme.text }]}>{user?.id}</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}>
        <Text style={[styles.label, { color: theme.subtext }]}>{i18n.t('profile.stats')}</Text>
        <Text style={[styles.value, { color: theme.text }]}>{i18n.t('profile.viewStats')}</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}>
        <Text style={[styles.label, { color: theme.subtext }]}>{i18n.t('profile.achievements')}</Text>
        <Text style={[styles.value, { color: theme.text }]}>{i18n.t('profile.viewAchievements')}</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}>
        <Text style={[styles.label, { color: theme.subtext }]}>{i18n.t('profile.history')}</Text>
        <Text style={[styles.value, { color: theme.text }]}>{i18n.t('profile.viewHistory')}</Text>
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
  label: {
    fontSize: 16,
    marginBottom: 6,
  },
  value: {
    fontSize: 20,
    fontFamily: 'Orbitron-Bold',
  },
});

export default ProfileScreen;
