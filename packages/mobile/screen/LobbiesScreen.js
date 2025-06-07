import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { LobbyContext } from '../context/LobbyContext';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import createLobbyStyles from '../components/LobbyStyles'; // Güncellenmiş harici style dosyası

const LobbiesScreen = () => {
  const {
     socket,
  joinedLobby,
  connectToLobby,
  disconnectFromLobby,
  deleteLobby,
   lobbies,
  } = useContext(LobbyContext);
  const { user } = useContext(AuthContext);
  const { theme } = useTheme();
  const styles = createLobbyStyles(theme); // theme'le uyumlu stil

  const [isReady, setIsReady] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [selectedLobbyId, setSelectedLobbyId] = useState(null);

  const renderItem = ({ item }) => {
    const isJoined = joinedLobby && joinedLobby.id === item.id;
    const isOwner = isJoined && joinedLobby.owner.id === user.id;

    const toggleReady = () => {
  if (!socket || !joinedLobby || !user) return;

  const message = {
    type: isReady ? 'playerUnready' : 'playerReady',
    lobbyId: joinedLobby.id,
    user: { id: user.id, email: user.email },
  };

  socket.send(JSON.stringify(message));
  setIsReady(prev => !prev);
};

    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.gameId} ({item.type})</Text>
        <Text style={{ color: theme.subtext }}>👤 {item.owner.email}</Text>
        <Text style={{ color: theme.subtext }}>🔒 {item.isPrivate ? 'Şifreli' : 'Herkese Açık'}</Text>

       {isJoined ? (
  <>
    <TouchableOpacity
      style={styles.leaveButton}
      onPress={() => disconnectFromLobby()}
    >
      <Text style={styles.buttonText}>Çık</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[
        styles.joinButton,
        {
          backgroundColor: isReady ? '#f44336' : '#4caf50',
          marginTop: 8,
        },
      ]}
      onPress={toggleReady}
    >
      <Text style={styles.buttonText}>
        {isReady ? 'Hazır Değilim' : 'Hazırım'}
      </Text>
    </TouchableOpacity>
  </>
) : (
  <TouchableOpacity
    style={styles.joinButton}
    onPress={() => {
      if (item.isPrivate) {
        setSelectedLobbyId(item.id);
        setPasswordModalVisible(true);
      } else {
        connectToLobby(item.id);
      }
    }}
  >
    <Text style={styles.buttonText}>Katıl</Text>
  </TouchableOpacity>
)}

{isOwner && (
  <TouchableOpacity
    style={styles.deleteButton}
    onPress={() => deleteLobby(item.id)}
  >
    <Text style={styles.buttonText}>Sil</Text>
  </TouchableOpacity>
)}

      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🧩 Aktif Lobiler</Text>

      <FlatList
        data={lobbies}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={{ color: theme.subtext }}>Henüz hiç lobi yok...</Text>}
        extraData={joinedLobby}
      />

      {/* 🔐 Şifreli Lobi Girişi */}
      <Modal
        visible={passwordModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>🔐 Şifreli Lobi</Text>
            <TextInput
              placeholder="Lobi şifresi"
              placeholderTextColor={theme.placeholder}
              secureTextEntry
              value={enteredPassword}
              onChangeText={setEnteredPassword}
              style={styles.input}
            />
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => {
                connectToLobby(selectedLobbyId, enteredPassword);
                setPasswordModalVisible(false);
                setEnteredPassword('');
              }}
            >
              <Text style={styles.buttonText}>Katıl</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LobbiesScreen;
