import { useEffect, useState } from "react";
import ws from "./socket";
import React from "react";

type ServerMessage = {
  board: number[][];
  current_player: number;
  winner: number | null;
  error?: string;
};

const PLAYER_ID = Math.random() < 0.5 ? 1 : 2;

export default function App() {
  const [board, setBoard] = useState<number[][]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<number>(1);
  const [winner, setWinner] = useState<number | null>(null);

  useEffect(() => {
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
  }, []);

  const sendMove = (row: number, col: number) => {
    if (winner !== null) return;

    ws.send(
      JSON.stringify({
        player: PLAYER_ID,
        row,
        col,
      })
    );
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>Chain Reaction</h2>
      <h4>You are Player {PLAYER_ID}</h4>

      {winner ? (
        <h3>Winner: Player {winner}</h3>
      ) : (
        <h3>Turn: Player {currentPlayer}</h3>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 80px)",
          gap: "5px",
          marginTop: "15px",
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
                border: "1px solid black",
                background:
                  cell > 0
                    ? "lightblue"
                    : cell < 0
                    ? "lightcoral"
                    : "white",
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
