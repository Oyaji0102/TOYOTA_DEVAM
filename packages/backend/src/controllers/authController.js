const { createSession, hashPassword } = require("../middleware/sessionMiddleware");

const users = [
  { id: 1, email: 'bambam', password: hashPassword('123456') },
  { id: 2, email: 'byza', password: hashPassword('789') }
];

// controllers/authController.js
exports.login = (req, res) => {
    const { email, password, rememberMe } = req.body;
  
    const user = users.find(u => u.email === email);
  
    if (!user) {
      return res.status(404).json({ success: false, message: "KULLANICI_BULUNAMADI" });
    }
  
    const hashedPassword = hashPassword(password);
    if (user.password !== hashedPassword) {
      return res.status(401).json({ success: false, message: "SIFRE_HATALI" });
    }
  
    createSession(req, user, rememberMe);
    return res.json({ success: true, user: { id: user.id, email: user.email } });
  };
  

exports.quickLogin = (req, res) => {
    const { email } = req.body;
    const user = users.find(u => u.email === email);
    if (!user) return res.status(401).json({ success: false, message: "Kullanıcı bulunamadı!" });
  
    createSession(req, user, true);
    return res.json({ success: true, user: { id: user.id, email: user.email } });
  };
  

exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ success: false });
    res.clearCookie('connect.sid');
    res.json({ success: true });
  });
};
