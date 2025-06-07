import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const ProfileScreen = () => {
  const { user } = useContext(AuthContext);
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
        👤 Profilim
      </Text>

      <View style={[styles.card, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}>
        <Text style={[styles.label, { color: theme.subtext }]}>E-posta</Text>
        <Text style={[styles.value, { color: theme.text }]}>{user?.email}</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}>
        <Text style={[styles.label, { color: theme.subtext }]}>Kullanıcı ID</Text>
        <Text style={[styles.value, { color: theme.text }]}>{user?.id}</Text>
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
