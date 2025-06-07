import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { InteractionManager } from 'react-native';

const pastelColors = [
  '#FFD3B6', '#FFAAA5', '#FF8C94', '#DCE775', '#A5D6A7',
  '#81D4FA', '#B39DDB', '#F48FB1', '#80CBC4', '#FFE082'
];

// 🔧 Kart üretimi
const generateTombalaCard = () => {
  const columnRanges = [
    [1, 9], [10, 19], [20, 29], [30, 39], [40, 49],
    [50, 59], [60, 69], [70, 79], [80, 90]
  ];

  const columns = columnRanges.map(([min, max]) =>
    Array.from({ length: max - min + 1 }, (_, i) => min + i)
  );

  const card = Array.from({ length: 3 }, () => Array(9).fill(null));
  const usedPerCol = Array(9).fill().map(() => new Set());

  for (let row = 0; row < 3; row++) {
    const cols = new Set();
    while (cols.size < 5) cols.add(Math.floor(Math.random() * 9));

    cols.forEach(col => {
      const available = columns[col].filter(n => !usedPerCol[col].has(n));
      if (!available.length) return;
      const value = available[Math.floor(Math.random() * available.length)];
      usedPerCol[col].add(value);
      card[row][col] = { value, marked: false, missed: false };
    });
  }

  return card;
};

// ✅ Ana Bileşen
export default function TombalaGameScreen() {
  const [card, setCard] = useState([]);
  const [activeNumber, setActiveNumber] = useState(null);
  const [drawnNumbers, setDrawnNumbers] = useState([]);
  const [gameOverData, setGameOverData] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [timer, setTimer] = useState(0);
  const navigation = useNavigation();
  const route = useRoute();
  const intervalRef = useRef(null);
  const socketRef = useRef(null);
  const timerRef = useRef(null);
  const cardBackground = useRef(pastelColors[Math.floor(Math.random() * pastelColors.length)]).current;

 const {
  lobbyId = 'demo_lobby',
  user = { email: 'kullanici@example.com' },
  gameStarted = false, // ✅ Varsayılan olarak false
} = route.params || {};


  // 📦 Kart Yükle
  useEffect(() => {
    const loadCard = async () => {
      const key = `card_${lobbyId}_${user.email}`;
      const saved = await AsyncStorage.getItem(key);
      if (saved) {
        setCard(JSON.parse(saved));
      } else {
        const newCard = generateTombalaCard();
        setCard(newCard);
        await AsyncStorage.setItem(key, JSON.stringify(newCard));
      }
    };
    loadCard();
  }, []);

  // 🔌 WebSocket Bağlantısı
  useEffect(() => {
    const ws = new WebSocket(`ws://10.0.2.2:4000/lobby/${lobbyId}`);
    socketRef.current = ws;

   ws.onopen = () => {
  console.log('✅ WebSocket bağlı');

  if (gameStarted) {
    console.log('🟢 Oyun başlatıldı, otomatik sayı çekiliyor...');
    sendDrawNumber();

    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        sendDrawNumber();
      }, 15000);
    }
  }
};


    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('📩 Mesaj:', data);

  

      if (data.type === 'newNumber') {
        const number = data.number;
        setDrawnNumbers(prev => [...prev, number]);
        setActiveNumber(number);
        setTimer(10);
        updateCardMarkStatus(number, false);
        resetMissTimer(number);
      }

if (data.type === 'player_announcement') {
  const message =
    data.step === 'cinko1'
      ? `🥇 ${data.user.email} → 1. Çinko yaptı!`
      : `🥈 ${data.user.email} → 2. Çinko yaptı!`;

  InteractionManager.runAfterInteractions(() => {
    Alert.alert('📣 Çinko!', message);
  });

  setAnnouncements(prev => [...prev, { step: data.step, email: data.user.email }]);
}


    if (data.type === 'game_over') {
  setGameOverData({
    winner: data.winner,
  });
}

    };

    ws.onerror = (e) => console.log('❌ WebSocket hata:', e.message);

    ws.onclose = () => {
      console.log('🔌 WebSocket kapandı');
      clearInterval(intervalRef.current);
    };

    return () => {
      ws.close();
      clearInterval(intervalRef.current);
    };
  }, []);

  const sendDrawNumber = () => {
  if (socketRef.current?.readyState === WebSocket.OPEN) {
    socketRef.current.send(JSON.stringify({
      type: 'drawNumber',
      lobbyId,
    }));
    console.log('📤 drawNumber gönderildi (otomatik)');
  }
};


  const startInterval = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(sendDrawNumber, 15000);
  };

  const resetMissTimer = (number) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      updateCardMarkStatus(number, true);
      setActiveNumber(null);
    }, 10000);
  };

  const updateCardMarkStatus = (number, markAsMissed) => {
    setCard(prev =>
      prev.map(row =>
        row.map(cell =>
          cell?.value === number && !cell.marked
            ? { ...cell, missed: markAsMissed }
            : cell
        )
      )
    );
  };

  const markCell = (rowIdx, colIdx) => {
    const cell = card[rowIdx][colIdx];
    if (!cell || cell.marked || cell.value !== activeNumber) return;

    const updated = card.map((row, ri) =>
      row.map((c, ci) =>
        ri === rowIdx && ci === colIdx ? { ...c, marked: true } : c
      )
    );
    setCard(updated);

    const step = checkWinStatus(updated);
    if (step) {
      socketRef.current?.readyState === WebSocket.OPEN &&
        socketRef.current.send(JSON.stringify({
          type: 'announceWin',
          step,
          user,
          lobbyId,
        }));
    }
  };

  const checkWinStatus = (card) => {
    const completed = card.map(row =>
      row.filter(cell => cell && cell.marked).length === 5
    );
    const count = completed.filter(Boolean).length;
    if (count === 1) return 'cinko1';
    if (count === 2) return 'cinko2';
    if (count === 3) return 'tombala';
    return null;
  };

  const renderRow = (row, ri) => (
    <View key={ri} style={styles.row}>
      {row.map((cell, ci) => {
        const bg = cell ? (cell.marked ? '#A5D6A7' : '#fff') : cardBackground;
        const border = cell?.missed ? '#f00' : '#000';
        return (
          <TouchableOpacity
            key={`${ri}-${ci}`}
            style={[styles.cell, { backgroundColor: bg, borderColor: border }]}
            disabled={!cell}
            onPress={() => markCell(ri, ci)}
          >
            <Text style={styles.cellText}>{cell?.value || ''}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  

  useEffect(() => {
    if (!activeNumber) return;
    const countdown = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, [activeNumber]);

  return (
    <View style={[styles.container, { backgroundColor: cardBackground }]}>
      {activeNumber && (
        <View style={styles.activeBox}>
          <Text style={styles.activeText}> {activeNumber} ({timer}s)</Text>
        </View>
      )}

 {announcements.length > 0 && (
  <View style={styles.announcementBox}>
    {announcements.map((a, index) => (
      <Text key={index} style={styles.announcementText}>
        {a.step === 'cinko1' ? '🥇' : '🥈'} {a.email} {a.step.toUpperCase()} yaptı!
      </Text>
    ))}
  </View>
)}

<View style={styles.middleIconBox}>
  <Image
    source={{ uri: 'https://img.icons8.com/?size=100&id=Ckq67kItoLQa&format=png&color=000000' }}
    style={styles.middleIcon}
    resizeMode="contain"
  />
</View>


    <View style={styles.cardWrapper}>
  <Text style={styles.title}> Tombala Kartı</Text>
  <View style={styles.cardBox}>
    {card.map((row, i) => renderRow(row, i))}
  </View>
</View>


{gameOverData && (
  <View style={styles.overlay}>
    <Text style={styles.winTitle}>🏆 Tombala!</Text>
    <Text style={styles.winText}>Kazanan: {gameOverData.winner.email}</Text>
    <TouchableOpacity
      style={styles.winButton}
      onPress={() => navigation.navigate('Home')}
    >
      <Text style={styles.winButtonText}>Ana Sayfa</Text>
    </TouchableOpacity>
  </View>
)}


    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
  cardBox: { borderWidth: 2, padding: 10, borderRadius: 10 },
  row: { flexDirection: 'row' },
  cell: {
    width: 36,
    height: 48,
    margin: 2,
    borderRadius: 5,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardWrapper: {
  position: 'absolute',
  bottom: 20,
  alignItems: 'center',
  width: '100%',
},
middleIconBox: {
  position: 'absolute',
  top: '45%',
  left: '45%',
  transform: [{ translateX: -40 }, { translateY: -40 }], // ikonu merkezlemek için
  zIndex: 0,
},
middleIcon: {
  width: 150,
  height: 150,
  opacity: 0.8, // hafif şeffaflık
},


  cellText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  activeBox: {
    position: 'absolute', top: 40,
    backgroundColor: '#fff', padding: 10,
    borderRadius: 10, borderColor: '#333', borderWidth: 1.5,
  },
  activeText: { fontSize: 20, fontWeight: 'bold' },
  drawButton: {
    backgroundColor: '#2196F3',
    padding: 10, borderRadius: 8, marginTop: 20
  },
  drawButtonText: { color: '#fff', fontWeight: 'bold' },
  overlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.75)',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
  zIndex: 999,
},
winTitle: {
  fontSize: 32,
  fontWeight: 'bold',
  color: '#fff',
  marginBottom: 20,
},
winText: {
  fontSize: 20,
  color: '#fff',
  marginBottom: 30,
},
winButton: {
  backgroundColor: '#4CAF50',
  paddingVertical: 12,
  paddingHorizontal: 30,
  borderRadius: 8,
},
winButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},

});
