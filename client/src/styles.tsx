import type { CSSProperties } from "react";

export const COLORS = {
  P1: "#ef4444", // Red
  P2: "#3b82f6", // Blue
  EMPTY: "#f3f4f6", // Light Gray
  BORDER: "#374151", // Dark Gray
};

export const styles: { [key: string]: CSSProperties } = {
  container: {
    padding: "20px 15px", // Less side padding on mobile
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    maxWidth: "500px",
    width: "100%", // Ensure full width on phones
    margin: "0 auto",
    textAlign: "center",
    boxSizing: "border-box", // Prevents horizontal scrollbar issues
  },
  title: {
    color: "#333",
    fontSize: "clamp(2rem, 5vw, 2.5rem)", // Scales between 2rem and 2.5rem based on screen width
    marginBottom: 30,
  },
  lobbyBox: {
    display: "flex",
    flexDirection: "column",
    gap: 15, // Slightly more gap for touch targets
    alignItems: "center",
    width: "100%",
  },
  input: {
    padding: "12px", // Larger touch area
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    width: "100%",       // Full width on mobile
    maxWidth: "250px",   // Cap it on desktop
    textAlign: "center",
    textTransform: "uppercase",
    boxSizing: "border-box",
  },
  buttonPrimary: {
    padding: "15px 30px", // Generous touch target
    fontSize: "18px",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    width: "100%",      // Full width buttons on mobile feel better
    maxWidth: "300px",
  },
  buttonSecondary: {
    padding: "12px 24px",
    fontSize: "16px",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    width: "100%",
    maxWidth: "250px",
  },
  buttonReset: {
    marginTop: 20,
    padding: "15px 30px",
    fontSize: "20px",
    backgroundColor: "#8b5cf6",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    width: "100%",
  },
  buttonResetSmall: {
    padding: "8px 12px", // Slightly bigger for fingers
    fontSize: "14px",
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  divider: {
    margin: "20px 0",
    color: "#888",
    fontWeight: "bold",
  },
  header: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
  },
  winnerBox: {
    padding: 20,
    backgroundColor: "#fffbeb",
    border: "2px dashed #f59e0b",
    borderRadius: 10,
    marginBottom: 20,
    animation: "popIn 0.5s ease-out",
  },
  turnIndicator: {
    fontSize: "clamp(1.2rem, 4vw, 1.5rem)", // Responsive font
    fontWeight: "bold",
    marginBottom: 20,
    padding: "10px",
    borderBottom: "3px solid",
    display: "inline-block",
  },
  
  // --- RESPONSIVE GRID STYLES ---
  grid: {
    display: "grid",
    // Instead of fixed 80px, divide space into 3 equal columns
    gridTemplateColumns: "repeat(3, 1fr)", 
    gap: "8px",
    justifyContent: "center",
    backgroundColor: "#1f2937",
    padding: "10px",
    borderRadius: "10px",
    width: "100%", // Fill the container
    maxWidth: "350px", // Don't get too big on desktop
    margin: "0 auto", // Center the board itself
    boxSizing: "border-box",
  },
  cell: {
    width: "100%", // Fill the column
    aspectRatio: "1 / 1", // FORCE SQUARE SHAPE
    fontSize: "clamp(1.2rem, 5vw, 1.5rem)", // Font shrinks if cell shrinks
    fontWeight: "bold",
    borderRadius: "8px",
    transition: "transform 0.1s",
    display: "flex",         // Use flex to center the number
    alignItems: "center",
    justifyContent: "center",
    padding: 0,              // Remove padding so it doesn't mess up size
    cursor: "pointer",
  },
};