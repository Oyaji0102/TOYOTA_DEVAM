import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const ChatScreen = () => {
  const { user } = useContext(AuthContext);
  const { theme } = useTheme();

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = () => {
    if (message.trim() === '') return;

    const newMessage = {
      id: Date.now().toString(),
      text: message,
      user: user?.email || 'Anonim',
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.message,
              { backgroundColor: theme.surface, shadowColor: theme.shadow },
            ]}
          >
            <Text style={[styles.user, { color: theme.primary }]}>
              {item.user}:
            </Text>
            <Text style={[styles.messageText, { color: theme.text }]}>
              {' '}{item.text}
            </Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 90 }}
      />

      <View style={styles.inputRow}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Mesaj yaz..."
          placeholderTextColor={theme.placeholder}
          style={[
            styles.input,
            {
              backgroundColor: theme.input,
              color: theme.text,
              borderColor: theme.border,
            },
          ]}
        />
        <TouchableOpacity onPress={sendMessage} style={[styles.sendButton, { backgroundColor: theme.primary }]}>
          <Text style={styles.sendButtonText}>Gönder</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  message: {
    padding: 10,
    marginBottom: 8,
    borderRadius: 12,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  user: {
    fontWeight: 'bold',
    fontFamily: 'Orbitron-Bold',
    fontSize: 14,
  },
  messageText: {
    fontSize: 15,
  },
  inputRow: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
  },
  sendButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default ChatScreen;
