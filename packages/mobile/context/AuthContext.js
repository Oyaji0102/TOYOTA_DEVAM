import React, { createContext, useState, useEffect } from 'react';
import { getSessionInfo, quickLogin } from '../src/api';
import * as LocalAuthentication from 'expo-local-authentication';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [rememberedEmail, setRememberedEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const sessionData = await getSessionInfo();
  
      if (sessionData?.user) {
        setUser(sessionData.user);
        setRememberedEmail(sessionData.user.email);
      } else {
        setUser(null); 
      }
  
      setLoading(false);
    })();
  }, []);
  

  const biometricLogin = async () => {
    const auth = await LocalAuthentication.authenticateAsync();
    if (auth.success && rememberedEmail) {
      const res = await quickLogin(rememberedEmail);
      if (res.success) setUser(res.user);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, rememberedEmail, setRememberedEmail, loading, biometricLogin }}>
      {children}
    </AuthContext.Provider>
  );
};