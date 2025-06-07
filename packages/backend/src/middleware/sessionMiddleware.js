const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const crypto = require('crypto');

const sessionMiddleware = session({
  secret: 'super-secret-key',
  resave: false,
  saveUninitialized: false,
  store: new MemoryStore({ checkPeriod: 86400000 }),
  cookie: { httpOnly: true, secure: false, sameSite: 'lax' }
});

const createSession = (req, user, rememberMe) => {
  req.session.user = { id: user.id, email: user.email };
  if (rememberMe) req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 gün
};

const hashPassword = (password) => crypto.createHash("sha256").update(password).digest("hex");

module.exports = { sessionMiddleware, createSession, hashPassword };