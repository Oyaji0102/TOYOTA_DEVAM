import React, { useState, useContext, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ImageBackground,
  Alert,
} from 'react-native';
import { login } from '../src/api';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

import i18n from '../src/i18n/i18n';
import { useLanguage } from '../context/LanguageContext';

import waveLight from '../assets/wave-light.png';
import waveDark from '../assets/wave-dark.png';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const { setUser, rememberedEmail, setRememberedEmail, biometricLogin } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const { changeLanguage } = useLanguage();

  useEffect(() => {
    if (rememberedEmail) setEmail(rememberedEmail);
  }, [rememberedEmail]);

  const handleThemeSwitch = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.2, duration: 150, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
    toggleTheme();
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(i18n.t('common.warning'), i18n.t('auth.fillFields'));
      return;
    }

    try {
      const res = await login(email, password, remember);
      if (res.success) {
        setUser(res.user);
        if (remember) setRememberedEmail(email);
      } else {
        Alert.alert(i18n.t('common.error'), i18n.t('auth.failed'));
      }
    } catch (error) {
      const status = error.response?.status;
      const code = error.response?.data?.message;
      if (code === 'KULLANICI_BULUNAMADI') {
        Alert.alert(i18n.t('auth.userNotFound'), i18n.t('auth.userNotFound'));
      } else if (code === 'SIFRE_HATALI') {
        Alert.alert(i18n.t('auth.wrongPassword'), i18n.t('auth.wrongPassword'));
      } else if (status === 500) {
        Alert.alert(i18n.t('auth.serverError'), i18n.t('auth.serverError'));
      } else {
        Alert.alert(i18n.t('auth.connectionError'), i18n.t('auth.connectionError'));
      }
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ImageBackground
        source={theme.mode === 'dark' ? waveDark : waveLight}
        style={styles.waveBackground}
        resizeMode="cover"
      >
        <View style={[styles.overlay]}>
          <View style={styles.themeSwitcher}>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <Switch
                value={theme.mode === 'dark'}
                onValueChange={handleThemeSwitch}
                thumbColor={theme.mode === 'dark' ? '#fff' : '#000'}
                trackColor={{ false: '#bbb', true: '#666' }}
              />
            </Animated.View>
          </View>

          <View style={styles.inner}>
            <Text
              style={[
                styles.title,
                {
                  color: theme.text,
                  fontFamily: 'Orbitron-Bold',
                  textShadowColor: theme.mode === 'dark' ? '#000' : '#ccc',
                  textShadowOffset: { width: 1, height: 2 },
                  textShadowRadius: 3,
                },
              ]}
            >
              {i18n.t('auth.welcome')}
            </Text>

            {/* Dil Seçici */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
              <TouchableOpacity onPress={() => changeLanguage('tr')} style={{ marginHorizontal: 10 }}>
                <Text style={{ color: theme.text }}>🇹🇷 Türkçe</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => changeLanguage('en')} style={{ marginHorizontal: 10 }}>
                <Text style={{ color: theme.text }}>🇬🇧 English</Text>
              </TouchableOpacity>
            </View>

            {rememberedEmail && (
              <TouchableOpacity
                style={[styles.quickBox, { backgroundColor: theme.surface }]}
                onPress={biometricLogin}
              >
                <Text style={[styles.quickText, { color: theme.text }]}>🔓 {rememberedEmail}</Text>
                <Text style={[styles.quickDesc, { color: theme.subtext }]}>
                  {i18n.t('auth.quickLogin')}
                </Text>
              </TouchableOpacity>
            )}

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.input,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              placeholder="Email"
              placeholderTextColor={theme.placeholder}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.input,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              placeholder={i18n.t('auth.loginPassword')}
              placeholderTextColor={theme.placeholder}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <View style={styles.switchRow}>
              <Text style={[styles.switchText, { color: theme.text }]}>{i18n.t('auth.rememberMe')}</Text>
              <Switch value={remember} onValueChange={setRemember} />
            </View>

            <TouchableOpacity onPress={handleLogin} style={{ borderRadius: 8, overflow: 'hidden' }}>
              <LinearGradient
                colors={
                  theme.mode === 'dark'
                    ? ['#339af0', '#1e90ff']
                    : ['#007bff', '#339af0']
                }
                style={styles.gradientButton}
              >
                <Text
                  style={[
                    styles.buttonText,
                    {
                      fontFamily: 'Orbitron-Bold',
                      textShadowColor: theme.mode === 'dark' ? '#000' : '#333',
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 2,
                    },
                  ]}
                >
                  {i18n.t('auth.login')}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  waveBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  inner: {
    marginTop: 100,
  },
  themeSwitcher: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 15,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  switchText: {
    fontSize: 16,
  },
  gradientButton: {
    padding: 14,
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
  },
  quickBox: {
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  quickText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quickDesc: {
    fontSize: 13,
    marginTop: 4,
  },
});
