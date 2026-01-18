import React from "react";
import { useEffect, useState, useRef } from "react";

type ServerMessage = {
  board: number[][];
  current_player: number;
  winner: number | null;
  error?: string;
};

const getPlayerID = () => {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get("player") || "1");
};

export default function App() {
  const [board, setBoard] = useState<number[][]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<number>(1);
  const [winner, setWinner] = useState<number | null>(null);
  
  const socketRef = useRef<WebSocket | null>(null);
  const playerID = useRef(getPlayerID()).current;

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8000/ws");
    socketRef.current = ws;

    ws.onmessage = (event: MessageEvent) => {
      const data: ServerMessage = JSON.parse(event.data);

      if (data.error) {
        alert(data.error);
        return;
      }

      setBoard(data.board);
      setCurrentPlayer(data.current_player);
      setWinner(data.winner);
    };

    return () => {
      ws.close();
    };
  }, []);

  const sendMove = (row: number, col: number) => {
    if (winner !== null || !socketRef.current) return;

    socketRef.current.send(
      JSON.stringify({
        player: playerID,
        row,
        col,
      })
    );
  };

  const resetGame = () => {
    if (!socketRef.current) return;
    const confirmReset = window.confirm("Are you sure you want to reset the game?");
    if (confirmReset) {
      socketRef.current.send(JSON.stringify({ type: "RESET" }));
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial", maxWidth: "400px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Chain Reaction</h2>
        <button 
          onClick={resetGame}
          style={{ padding: "5px 10px", background: "#ff4444", color: "white", border: "none", cursor: "pointer", borderRadius: "5px"}}
        >
          Reset Game
        </button>
      </div>

      <h4>You are Player {playerID}</h4>

      <div style={{ 
        padding: "10px", 
        background: currentPlayer === playerID ? "#e6fffa" : "#fff",
        border: "1px solid #ccc",
        marginBottom: "10px",
        borderRadius: "5px"
      }}>
        {winner ? (
          <h3 style={{ margin: 0, color: "green" }}>🏆 Winner: Player {winner}</h3>
        ) : (
          <h3 style={{ margin: 0 }}>Turn: Player {currentPlayer} {currentPlayer === playerID ? "(You)" : ""}</h3>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 80px)",
          gap: "5px",
          marginTop: "15px",
          justifyContent: "center"
        }}
      >
        {board.map((row, r) =>
          row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              onClick={() => sendMove(r, c)}
              disabled={winner !== null}
              style={{
                width: 80,
                height: 80,
                fontSize: 20,
                cursor: winner ? "not-allowed" : "pointer",
                border: "1px solid #333",
                borderRadius: "8px",
                background:
                  cell > 0
                    ? "#4dabf7" // Blue
                    : cell < 0
                    ? "#ff8787" // Red
                    : "#f1f3f5", // Grey/White
                color: "white",
                fontWeight: "bold"
              }}
            >
              {Math.abs(cell) || ""}
            </button>
          ))
        )}
      </div>
    </div>
  );
}