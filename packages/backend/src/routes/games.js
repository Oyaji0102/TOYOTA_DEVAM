const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

// 📁 Dosya yolunu önce tanımla
const gamesPath = "C:/Users/Arslan/Desktop/TOYOTA_O/game/shared/games.json";
console.log("📁 gamesPath:", gamesPath);

router.get("/", (req, res) => {
  try {
    const data = fs.readFileSync(gamesPath, "utf-8");
    const games = JSON.parse(data);
    res.json(games);
  } catch (err) {
    console.error("games.json okunamadı:", err.message);
    res.status(500).json({ error: "Oyunlar yüklenemedi" });
  }
});

module.exports = router;
