import React, { createContext, useState } from 'react';

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [gameDetailModalVisible, setGameDetailModalVisible] = useState(false);

  return (
    <GameContext.Provider
      value={{
        selectedGame,
        setSelectedGame,
        gameDetailModalVisible,
        setGameDetailModalVisible
      }}
    >
      {children}
    </GameContext.Provider>
  );
};