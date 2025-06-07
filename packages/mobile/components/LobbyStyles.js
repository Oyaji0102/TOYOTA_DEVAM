import { StyleSheet } from 'react-native';

const createLobbyStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme.background,
    },
    heading: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      fontFamily: 'Orbitron-Bold',
      color: theme.text,
      textShadowColor: theme.mode === 'dark' ? '#000' : '#aaa',
      textShadowOffset: { width: 1, height: 2 },
      textShadowRadius: 3,
    },
    card: {
      backgroundColor: theme.surface,
      padding: 18,
      marginBottom: 16,
      borderRadius: 14,
      elevation: 3,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 6,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 6,
      color: theme.text,
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 15,
    },
    joinButton: {
      marginTop: 10,
      backgroundColor: theme.primary,
      padding: 12,
      borderRadius: 10,
      alignItems: 'center',
    },
    leaveButton: {
      marginTop: 10,
      backgroundColor: '#FF3B30',
      padding: 12,
      borderRadius: 10,
      alignItems: 'center',
    },
    deleteButton: {
      marginTop: 10,
      backgroundColor: '#E53935',
      padding: 12,
      borderRadius: 10,
      alignItems: 'center',
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalBox: {
      backgroundColor: theme.surface,
      padding: 24,
      borderRadius: 12,
      width: '85%',
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 14,
      color: theme.text,
    },
    input: {
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      marginBottom: 20,
      padding: 8,
      fontSize: 16,
      color: theme.text,
    },
    confirmButton: {
      backgroundColor: theme.primary,
      padding: 12,
      borderRadius: 10,
      alignItems: 'center',
    },
  });

export default createLobbyStyles;
