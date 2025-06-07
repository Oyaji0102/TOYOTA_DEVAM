// server.js
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { sessionMiddleware } = require('./middleware/sessionMiddleware');
const authRoutes = require('./routes/authRoutes');
const gamesRouter = require('./routes/games');   

const app = express();

app.use(cors({
  origin: ["http://10.0.2.2:8081", "http://localhost:8081"],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(sessionMiddleware);

app.use('/api/games', gamesRouter); 
app.use('/api', authRoutes);

app.get('/api/session-check', (req, res) => {
  if (req.session?.user) {
    res.json({ success: true, user: req.session.user });
  } else {
    res.status(401).json({ success: false, message: "Oturum bulunamadı!" });
  }
});

app.listen(3000, () => console.log('Backend 3000 portunda çalışıyor.'));
