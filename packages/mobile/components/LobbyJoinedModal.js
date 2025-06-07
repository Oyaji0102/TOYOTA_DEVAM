import React, { useContext } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Linking,
  FlatList,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Feather } from '@expo/vector-icons';
import { LobbyContext } from '../context/LobbyContext';
import { useTheme } from '../context/ThemeContext';
import { sendLocalNotification } from './notifications';

const LobbyJoinedModal = () => {
  const {
    lobbyJoinedModalVisible,
    setLobbyJoinedModalVisible,
    joinedLobby,
  } = useContext(LobbyContext);

  const { theme } = useTheme();

  if (!lobbyJoinedModalVisible || !joinedLobby) return null;

  const lobbyURL = `http://10.0.2.2:4000/lobby/${joinedLobby.id}`;

  const handleCopy = async () => {
    await Clipboard.setStringAsync(lobbyURL);
    sendLocalNotification('🔗 Kopyalandı', 'Lobi bağlantısı panoya eklendi.');
  };

  const handleOpenURL = () => {
    try {
      Linking.openURL(lobbyURL);
    } catch (e) {
      console.warn("❗ URL açılamadı:", lobbyURL);
    }
  };

  return (
    <Modal
      visible={lobbyJoinedModalVisible}
      animationType="slide"
      transparent
      onRequestClose={() => setLobbyJoinedModalVisible(false)}
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}>
          <Text style={[styles.title, { color: theme.text }]}>✅ Lobiye Katıldınız!</Text>

          <Text style={[styles.label, { color: theme.text }]}>Lobi ID:</Text>
          <Text style={[styles.value, { color: theme.text }]}>{joinedLobby.id}</Text>

          <Text style={[styles.label, { color: theme.text }]}>Bağlantı:</Text>
          <View style={[styles.panoContainer, { backgroundColor: theme.input, borderColor: theme.border }]}>
            <TouchableOpacity onPress={handleOpenURL}>
              <Text style={[styles.urlText, { color: theme.primary }]}>{lobbyURL}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.copyButton, { backgroundColor: theme.primary }]} onPress={handleCopy}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Feather name="copy" size={16} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.copyButtonText}>Kopyala</Text>
              </View>
            </TouchableOpacity>
          </View>

          <Text style={[styles.label, { color: theme.text }]}>Katılımcılar:</Text>
          <FlatList
            data={joinedLobby.members}
            keyExtractor={(item, index) => `${item.id}_${index}`}
            renderItem={({ item }) => (
              <View style={styles.memberRow}>
                <Feather name="user" size={16} color={theme.text} style={{ marginRight: 6 }} />
                <Text style={[styles.member, { color: theme.text }]}>{item.email}</Text>
              </View>
            )}
            style={{ maxHeight: 100, marginBottom: 10 }}
          />

          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: theme.border }]}
            onPress={() => setLobbyJoinedModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modal: {
    width: '85%',
    padding: 20,
    borderRadius: 16,
    elevation: 10,
    maxHeight: '80%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: 'Orbitron-Bold',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
    fontSize: 14,
  },
  value: {
    marginBottom: 8,
    fontSize: 14,
  },
  panoContainer: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
  urlText: {
    fontSize: 14,
    marginBottom: 6,
    textDecorationLine: 'underline',
  },
  copyButton: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  copyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  member: {
    fontSize: 14,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
});

export default LobbyJoinedModal;
