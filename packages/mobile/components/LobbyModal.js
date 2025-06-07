import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { LobbyContext } from '../context/LobbyContext';
import { GameContext } from '../context/GameContext';
import { useTheme } from '../context/ThemeContext';
import { getGames } from '../src/api';
import { Feather } from '@expo/vector-icons';
import { sendLocalNotification } from '../components/notifications';

const LobbyModal = () => {
  const {
    lobbyModalVisible,
    closeLobbyModal,
    lobbyType,
    setLobbyType,
    eventStartDate,
    setEventStartDate,
    eventEndDate,
    setEventEndDate,
    handleLobbyNext,
    isPrivate,
    setIsPrivate,
    lobbyPassword,
    setLobbyPassword,
    skipGameSelection,
    setSkipGameSelection,
  } = useContext(LobbyContext);

  const { selectedGame, setSelectedGame } = useContext(GameContext);
  const { theme } = useTheme();

  const [games, setGames] = useState([]);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  useEffect(() => {
    getGames().then(setGames).catch(console.error);
  }, []);

  const onChangeStart = (event, selectedDate) => {
    setShowStartPicker(Platform.OS === 'ios');
    if (selectedDate) setEventStartDate(selectedDate);
  };

  const onChangeEnd = (event, selectedDate) => {
    setShowEndPicker(Platform.OS === 'ios');
    if (selectedDate) setEventEndDate(selectedDate);
  };

  const selectedGameObj = typeof selectedGame === 'object'
    ? selectedGame
    : games.find(g => g.id === selectedGame);

  return (
    <Modal
      visible={lobbyModalVisible}
      transparent
      animationType="slide"
      onRequestClose={() => {
        closeLobbyModal();
        setSkipGameSelection(false);
      }}
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}>
          <Text style={[styles.title, { color: theme.text }]}>Lobi Türü Seç</Text>

          {['normal', 'event'].map(type => (
            <TouchableOpacity
              key={type}
              onPress={() => setLobbyType(type)}
              style={styles.radioOption}
            >
              <Feather
                name={lobbyType === type ? 'check-circle' : 'circle'}
                size={20}
                color={theme.primary}
                style={{ marginRight: 8 }}
              />
              <Text style={{ color: theme.text }}>{type === 'normal' ? 'Normal Lobi' : 'Etkinlik Lobisi'}</Text>
            </TouchableOpacity>
          ))}

          {lobbyType === 'event' && (
            <View style={styles.dateSection}>
              <TouchableOpacity
                style={[styles.dateButton, { backgroundColor: theme.input }]}
                onPress={() => setShowStartPicker(true)}
              >
                <View style={styles.rowCenter}>
                  <Feather name="calendar" size={18} color={theme.text} style={{ marginRight: 6 }} />
                  <Text style={{ color: theme.text }}>Başlangıç: {eventStartDate.toLocaleDateString()}</Text>
                </View>
              </TouchableOpacity>
              {showStartPicker && (
                <DateTimePicker value={eventStartDate} mode="date" display="default" onChange={onChangeStart} />
              )}

              <TouchableOpacity
                style={[styles.dateButton, { backgroundColor: theme.input }]}
                onPress={() => setShowEndPicker(true)}
              >
                <View style={styles.rowCenter}>
                  <Feather name="calendar" size={18} color={theme.text} style={{ marginRight: 6 }} />
                  <Text style={{ color: theme.text }}>Bitiş: {eventEndDate.toLocaleDateString()}</Text>
                </View>
              </TouchableOpacity>
              {showEndPicker && (
                <DateTimePicker value={eventEndDate} mode="date" display="default" onChange={onChangeEnd} />
              )}
            </View>
          )}

          {!skipGameSelection && (
            <>
              <Text style={[styles.subTitle, { color: theme.text }]}>🎮 Oyun Seç</Text>
              <Picker
                selectedValue={selectedGameObj?.id || null}
                onValueChange={(value) => setSelectedGame(games.find(g => g.id === value) || null)}
                style={{ backgroundColor: theme.input, marginVertical: 10, color: theme.text }}
              >
                <Picker.Item label="Bir oyun seçin..." value={null} />
                {games.map(game => (
                  <Picker.Item key={game.id} label={game.name} value={game.id} />
                ))}
              </Picker>
            </>
          )}

          {skipGameSelection && selectedGameObj && (
            <View style={[styles.selectedGameBox, { backgroundColor: theme.input }]}>
              <Text style={[styles.boldText, { color: theme.text }]}>🎮 Seçilen Oyun: {selectedGameObj.name}</Text>
            </View>
          )}

          <TouchableOpacity style={styles.radioOption} onPress={() => setIsPrivate(!isPrivate)}>
            <Feather
              name={isPrivate ? 'check-square' : 'square'}
              size={20}
              color={theme.primary}
              style={{ marginRight: 8 }}
            />
            <Text style={{ fontSize: 16, color: theme.text }}>Şifreli Lobi</Text>
          </TouchableOpacity>
          {isPrivate && (
            <View style={{ backgroundColor: theme.input, padding: 10, borderRadius: 8 }}>
              <Text style={{ color: theme.text }}>Şifre:</Text>
              <TextInput
                secureTextEntry
                style={[styles.passwordInput, {
                  backgroundColor: theme.surface,
                  color: theme.text,
                  borderColor: theme.border
                }]}
                value={lobbyPassword}
                onChangeText={setLobbyPassword}
                placeholder="Lobi şifresi girin"
                placeholderTextColor={theme.placeholder}
              />
            </View>
          )}

<TouchableOpacity
  onPress={() => {
    handleLobbyNext(selectedGame, skipGameSelection);
    sendLocalNotification(
      '🎯 Lobi Ayarlandı',
      selectedGame ? `${selectedGame.name} için lobi kuruluyor...` : 'Lobi kuruluyor...'
    );
  }}
  style={[
    styles.dateButton,
    { backgroundColor: theme.primary, alignItems: 'center', marginTop: 20 }
  ]}
>
  <Text style={{ color: '#fff', fontWeight: 'bold' }}>İleri</Text>
</TouchableOpacity>

          
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    padding: 25,
    borderRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    fontFamily: 'Orbitron-Bold',
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 6,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateSection: {
    marginVertical: 20,
  },
  dateButton: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    marginTop: 6,
  },
  selectedGameBox: {
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default LobbyModal;