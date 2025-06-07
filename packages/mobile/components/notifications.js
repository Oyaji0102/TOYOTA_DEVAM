import * as Notifications from 'expo-notifications';

export const sendLocalNotification = (title, body) => {
  Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
    },
    trigger: null, // hemen göster
  });
};