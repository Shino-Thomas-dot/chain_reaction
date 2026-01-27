import { useState, useRef } from "react";
import type { GameState } from "../types";

export function useGameState() {
  const [inGame, setInGame] = useState(false);
  const [board, setBoard] = useState<number[][]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<number>(1);
  const [winner, setWinner] = useState<number | null>(null);
  const [myPlayerID, setMyPlayerID] = useState<number | null>(null);
  const [activeRoomId, setActiveRoomId] = useState("");
  
  const socketRef = useRef<WebSocket | null>(null);

  // Connect to the room
  const connectToRoom = (action: "CREATE" | "JOIN", code?: string) => {
    const ws = new WebSocket("ws://127.0.0.1:8000/ws");
    socketRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ action, code }));
    };

    ws.onmessage = (event: MessageEvent) => {
      const data: GameState = JSON.parse(event.data);

      if (data.error) {
        alert(data.error);
        if (data.error === "Room not found" || data.error === "Room is full") {
            ws.close();
            setInGame(false);
        }
        return;
      }

      if (data.type === "INIT") {
        if (data.player_id) setMyPlayerID(data.player_id);
        if (data.room_id) setActiveRoomId(data.room_id);
        setInGame(true);
      }

      if (data.type === "UPDATE" || data.type === "INIT") {
        setBoard(data.board);
        setCurrentPlayer(data.current_player);
        setWinner(data.winner);
      }
    };
    
    ws.onclose = () => console.log("Disconnected");
  };

  // Actions
  const sendMove = (row: number, col: number) => {
    if (!socketRef.current || winner) return;
    socketRef.current.send(JSON.stringify({
      player: myPlayerID,
      row, col
    }));
  };

  const resetGame = () => {
    if (!socketRef.current) return;
    const confirmReset = window.confirm("Are you sure? This will restart the game for both players.");
    if (confirmReset) {
      socketRef.current.send(JSON.stringify({ type: "RESET" }));
    }
  };

  return {
    inGame,
    board,
    currentPlayer,
    winner,
    myPlayerID,
    activeRoomId,
    connectToRoom,
    sendMove,
    resetGame
  };
}