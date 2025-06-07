import axios from "axios";

const api = axios.create({
  baseURL: "http://10.0.2.2:3000/api",
  withCredentials: true,
  validateStatus: (status) => status < 500 // 🔥 500 altı tüm statüler try{}'da işlenir!
});

export const getGames = () =>
  api.get("/games").then(res => res.data);

export const login = (email, password, rememberMe) =>
  api.post("/login", { email, password, rememberMe }).then(res => res.data);

export const logout = () =>
  api.post("/logout").then(res => res.data);

export const getSessionInfo = () =>
  api.get("/session-check").then(res => res.data).catch(() => null);

export const quickLogin = (email) =>
  api.post("/quick-login", { email }).then(res => res.data);
