import { useGameState } from "./hooks/useGameState";
import Lobby from "./components/Lobby";
import GameScreen from "./components/GameScreen";
import React from "react";

export default function App() {
  const { 
    inGame, 
    board, 
    currentPlayer, 
    winner, 
    myPlayerID, 
    activeRoomId, 
    connectToRoom, 
    sendMove, 
    resetGame 
  } = useGameState();

  if (!inGame) {
    return <Lobby onJoin={connectToRoom} />;
  }

  return (
    <GameScreen 
      roomId={activeRoomId}
      myPlayerID={myPlayerID}
      currentPlayer={currentPlayer}
      winner={winner}
      board={board}
      onMove={sendMove}
      onReset={resetGame}
    />
  );
}