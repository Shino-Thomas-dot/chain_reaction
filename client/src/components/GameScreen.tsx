import React from "react";
import { styles, COLORS } from "../styles";

type Props = {
  roomId: string;
  myPlayerID: number | null;
  currentPlayer: number;
  winner: number | null;
  board: number[][];
  onMove: (r: number, c: number) => void;
  onReset: () => void;
};

export default function GameScreen({ 
  roomId, myPlayerID, currentPlayer, winner, board, onMove, onReset 
}: Props) {
    
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{margin: 0}}>Room: <span style={{color: COLORS.P2}}>{roomId}</span></h3>
            <button onClick={onReset} style={styles.buttonResetSmall}>⟳ Reset</button>
        </div>
        <p style={{margin: "5px 0", textAlign: "left"}}>
          You are <strong style={{ color: myPlayerID === 1 ? COLORS.P1 : COLORS.P2 }}>
            Player {myPlayerID} ({myPlayerID === 1 ? "Red" : "Blue"})
          </strong>
        </p>
      </div>

      {/* Status / Winner */}
      {winner ? (
        <div style={styles.winnerBox}>
          <h2 style={{ color: winner === 1 ? COLORS.P1 : COLORS.P2 }}>
            🎉 Player {winner} Wins! 🎉
          </h2>
          <button onClick={onReset} style={styles.buttonReset}>Play Again</button>
        </div>
      ) : (
        <div style={{
            ...styles.turnIndicator,
            borderColor: currentPlayer === 1 ? COLORS.P1 : COLORS.P2,
            color: currentPlayer === 1 ? COLORS.P1 : COLORS.P2,
        }}>
          Current Turn: Player {currentPlayer}
        </div>
      )}

      {/* Board Grid */}
      <div style={styles.grid}>
        {board.map((row, r) =>
          row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              onClick={() => onMove(r, c)}
              disabled={winner !== null}
              style={{
                ...styles.cell,
                backgroundColor: cell > 0 ? COLORS.P1 : cell < 0 ? COLORS.P2 : COLORS.EMPTY,
                color: "white",
                cursor: winner ? "default" : "pointer",
                border: `2px solid ${COLORS.BORDER}`
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