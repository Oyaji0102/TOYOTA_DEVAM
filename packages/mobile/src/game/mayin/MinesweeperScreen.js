// Tümleşik Minesweeper ekranı: Zorluk seviyeli, skor, süre, bildirim destekli

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import * as Notifications from 'expo-notifications';

const getSettingsByDifficulty = (difficulty) => {
  switch (difficulty) {
    case 'medium':
      return { rows: 12, cols: 12, mines: 25 };
    case 'hard':
      return { rows: 14, cols: 14, mines: 40 };
    default:
      return { rows: 10, cols: 10, mines: 15 };
  }
};

const MinesweeperScreen = () => {
  const [difficulty, setDifficulty] = useState('easy');
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(10);
  const [mines, setMines] = useState(15);
  const [grid, setGrid] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    const settings = getSettingsByDifficulty(difficulty);
    setRows(settings.rows);
    setCols(settings.cols);
    setMines(settings.mines);
  }, [difficulty]);

  useEffect(() => {
    resetGame();
  }, [rows, cols, mines]);

  useEffect(() => {
    let interval = null;
    if (timerRunning) {
      interval = setInterval(() => setTime(t => t + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const CELL_SIZE = Dimensions.get('window').width / cols;

  const createEmptyGrid = () =>
    Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        adjacentMines: 0,
      }))
    );

  const resetGame = () => {
    const newGrid = createEmptyGrid();
    placeMines(newGrid);
    calculateAdjacents(newGrid);
    setGrid(newGrid);
    setGameOver(false);
    setWin(false);
    setScore(0);
    setTime(0);
    setTimerRunning(true);
  };

  const placeMines = (grid) => {
    let placed = 0;
    while (placed < mines) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      if (!grid[r][c].isMine) {
        grid[r][c].isMine = true;
        placed++;
      }
    }
  };

  const calculateAdjacents = (grid) => {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],          [0, 1],
      [1, -1], [1, 0],  [1, 1],
    ];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c].isMine) continue;
        let count = 0;
        directions.forEach(([dr, dc]) => {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc].isMine) {
            count++;
          }
        });
        grid[r][c].adjacentMines = count;
      }
    }
  };

  const revealCell = (r, c, newGrid) => {
    const cell = newGrid[r][c];
    if (cell.isRevealed || cell.isFlagged) return;
    cell.isRevealed = true;

    if (cell.isMine) {
      setGameOver(true);
      setTimerRunning(false);
      revealAllMines(newGrid);
      sendNotification('💥 Oyun Bitti!', `Bir mayına bastınız! Skor: ${score} | Süre: ${time} sn`);
      Alert.alert('💥 Oyun Bitti', `Bir mayına bastınız!\nSkor: ${score}\nSüre: ${time} sn`);
      return;
    }

    setScore(prev => prev + 10);

    if (cell.adjacentMines === 0) {
      revealSurrounding(r, c, newGrid);
    }

    checkWin(newGrid);
  };

  const revealSurrounding = (r, c, newGrid) => {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],          [0, 1],
      [1, -1], [1, 0],  [1, 1],
    ];
    directions.forEach(([dr, dc]) => {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !newGrid[nr][nc].isRevealed && !newGrid[nr][nc].isMine) {
        newGrid[nr][nc].isRevealed = true;
        setScore(prev => prev + 10);
        if (newGrid[nr][nc].adjacentMines === 0) {
          revealSurrounding(nr, nc, newGrid);
        }
      }
    });
  };

  const revealAllMines = (newGrid) => {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (newGrid[r][c].isMine) newGrid[r][c].isRevealed = true;
      }
    }
    setGrid([...newGrid]);
  };

  const checkWin = (newGrid) => {
    let hasWon = true;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = newGrid[r][c];
        if (!cell.isMine && !cell.isRevealed) {
          hasWon = false;
        }
      }
    }
    if (hasWon) {
      setWin(true);
      setTimerRunning(false);
      sendNotification('🎉 Kazandınız!', `Skor: ${score} | Süre: ${time} sn`);
      Alert.alert('🎉 Kazandınız!', `Tüm mayınları buldunuz!\nSkor: ${score}\nSüre: ${time} sn`);
    }
    setGrid([...newGrid]);
  };

  const handlePress = (r, c) => {
    if (gameOver || win) return;
    const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
    revealCell(r, c, newGrid);
    setGrid(newGrid);
  };

  const handleLongPress = (r, c) => {
    if (gameOver || win) return;
    const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
    const cell = newGrid[r][c];
    if (!cell.isRevealed) {
      cell.isFlagged = !cell.isFlagged;
    }
    setGrid(newGrid);
  };

  const sendNotification = async (title, body) => {
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: null,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💣 Minesweeper</Text>

      <View style={styles.difficultyRow}>
        {['easy', 'medium', 'hard'].map((level) => (
          <TouchableOpacity
            key={level}
            onPress={() => setDifficulty(level)}
            style={[styles.difficultyButton, difficulty === level && styles.selectedDifficulty]}
          >
            <Text style={styles.resetText}>{level.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
        <Text style={{ marginRight: 15 }}>⏱ Süre: {time}s</Text>
        <Text>🏆 Skor: {score}</Text>
      </View>

      {grid.map((row, rIdx) => (
        <View key={rIdx} style={styles.row}>
          {row.map((cell, cIdx) => (
            <TouchableOpacity
              key={cIdx}
              style={[
                { width: CELL_SIZE, height: CELL_SIZE },
                styles.cell,
                cell.isRevealed && styles.revealed,
                cell.isFlagged && styles.flagged,
              ]}
              onPress={() => handlePress(rIdx, cIdx)}
              onLongPress={() => handleLongPress(rIdx, cIdx)}
            >
              {cell.isFlagged ? (
                <Text style={styles.cellText}>🚩</Text>
              ) : cell.isRevealed ? (
                cell.isMine ? (
                  <Text style={styles.cellText}>💣</Text>
                ) : (
                  <Text style={styles.cellText}>{cell.adjacentMines || ''}</Text>
                )
              ) : null}
            </TouchableOpacity>
          ))}
        </View>
      ))}

      <TouchableOpacity onPress={resetGame} style={styles.resetButton}>
        <Text style={styles.resetText}>🔁 Yeni Oyun</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MinesweeperScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'center',
    backgroundColor: '#fdf6e3',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    borderWidth: 1,
    borderColor: '#555',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#999',
  },
  revealed: {
    backgroundColor: '#ddd',
  },
  flagged: {
    backgroundColor: '#f7dc6f',
  },
  cellText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  resetButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#48c9b0',
    borderRadius: 5,
  },
  resetText: {
    color: 'white',
    fontWeight: 'bold',
  },
  difficultyRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  difficultyButton: {
    marginHorizontal: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#aaa',
    borderRadius: 5,
  },
  selectedDifficulty: {
    backgroundColor: '#34495e',
  },
});
