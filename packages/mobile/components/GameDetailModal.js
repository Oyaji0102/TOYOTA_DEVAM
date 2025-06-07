// components/GameDetailModal.js
import React, { useContext } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LobbyContext } from '../context/LobbyContext';
import { GameContext } from '../context/GameContext';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const GameDetailModal = () => {
  const { selectedGame, setSelectedGame } = useContext(GameContext);
  const { openLobbyModal, lobbies, setSkipGameSelection } = useContext(LobbyContext);
  const { theme } = useTheme();

  if (!selectedGame) return null;

  const relatedLobbies = lobbies.filter(l => l.gameId === selectedGame.id);

  return (
    <Modal
      visible={!!selectedGame}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setSelectedGame(null)}
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: theme.surface }]}>
          <ScrollView>
            <Text style={[styles.title, { color: theme.text }]}>{selectedGame.name}</Text>

            <View style={styles.sectionHeader}>
              <Feather name="info" size={18} color={theme.text} style={styles.icon} />
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Oyun Hakkında</Text>
            </View>
            <Text style={[styles.text, { color: theme.text }]}>{selectedGame.description}</Text>

            <View style={styles.sectionHeader}>
              <Feather name="users" size={18} color={theme.text} style={styles.icon} />
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Aktif Lobiler</Text>
            </View>
            {relatedLobbies.length > 0 ? relatedLobbies.map(l => (
              <Text key={l.id} style={[styles.text, { color: theme.text }]}>- {l.id}</Text>
            )) : <Text style={[styles.text, { color: theme.subtext }]}>Aktif lobi bulunamadı.</Text>}

            <View style={styles.sectionHeader}>
              <Feather name="clock" size={18} color={theme.text} style={styles.icon} />
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Oyun Geçmişi</Text>
            </View>
            <Text style={[styles.text, { color: theme.text }]}>{selectedGame.history}</Text>

            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="gamepad-variant-outline" size={18} color={theme.text} style={styles.icon} />
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Nasıl Oynanır</Text>
            </View>
            <Text style={[styles.text, { color: theme.text }]}>{selectedGame.howToPlay}</Text>

            <View style={styles.sectionHeader}>
              <Feather name="settings" size={18} color={theme.text} style={styles.icon} />
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Ayarlar</Text>
            </View>
            <Text style={[styles.text, { color: theme.text }]}>{selectedGame.settings}</Text>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.primary }]}
              onPress={() => {
                setSkipGameSelection(true);
                openLobbyModal();
              }}
            >
              <Text style={styles.buttonText}>Lobi Oluştur</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setSelectedGame(null)} style={styles.closeButton}>
              <Text style={styles.closeText}>Kapat</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modal: { borderRadius: 20, padding: 20, width: '90%', maxHeight: '85%' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', fontFamily: 'Orbitron-Bold' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginTop: 15, marginBottom: 5 },
  icon: { marginRight: 8 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  text: { fontSize: 16, marginBottom: 5 },
  button: { padding: 12, borderRadius: 10, marginTop: 20, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  closeButton: { marginTop: 10, alignItems: 'center' },
  closeText: { color: '#e74c3c', fontWeight: 'bold' },
});

export default GameDetailModal;