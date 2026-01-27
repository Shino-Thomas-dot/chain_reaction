import { useState } from "react";
import { styles } from "../styles";
import React from "react";

type Props = {
  onJoin: (action: "CREATE" | "JOIN", code?: string) => void;
};

export default function Lobby({ onJoin }: Props) {
  const [roomCodeInput, setRoomCodeInput] = useState("");

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Chain Reaction</h1>
      
      <div style={styles.lobbyBox}>
        <button onClick={() => onJoin("CREATE")} style={styles.buttonPrimary}>
          Create New Game
        </button>
      </div>

      <div style={styles.divider}>OR</div>

      <div style={styles.lobbyBox}>
        <input 
          type="text" 
          placeholder="Room Code (e.g. ABCD)" 
          value={roomCodeInput}
          onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
          style={styles.input}
        />
        <button 
          onClick={() => onJoin("JOIN", roomCodeInput)}
          style={styles.buttonSecondary}
        >
          Join Game
        </button>
      </div>
    </div>
  );
}