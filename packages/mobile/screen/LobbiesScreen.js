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
import { useLanguage } from '../context/LanguageContext';
import i18n from '../src/i18n/i18n';
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
        <Text style={{ color: theme.subtext }}>🔒 {item.isPrivate ? i18n.t('lobby.private') : i18n.t('lobby.public')}</Text>

       {isJoined ? (
  <>

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
        {isReady ? i18n.t('lobby.notReady') : i18n.t('lobby.ready')}
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.leaveButton}
      onPress={() => disconnectFromLobby()}
    >
      <Text style={styles.buttonText}>{i18n.t('lobby.leave')}</Text>
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
    <Text style={styles.buttonText}>{i18n.t('lobby.join')}</Text>
  </TouchableOpacity>
)}

{isOwner && (
  <TouchableOpacity
    style={styles.deleteButton}
    onPress={() => deleteLobby(item.id)}
  >
    <Text style={styles.buttonText}>{i18n.t('common.delete')}</Text>
  </TouchableOpacity>
)}

      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{i18n.t('lobby.activeLobbies')}</Text>

      <FlatList
        data={lobbies}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={{ color: theme.subtext }}>{i18n.t('lobby.noLobbies')}</Text>}
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
            <Text style={styles.modalTitle}>🔐 {i18n.t('lobby.privateLobby')}</Text>
            <TextInput
              placeholder={i18n.t('lobby.passwordPlaceholder')}
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
              <Text style={styles.buttonText}>{i18n.t('lobby.join')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LobbiesScreen;
