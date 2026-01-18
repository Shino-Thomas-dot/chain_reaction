import type { CSSProperties } from "react";

export const COLORS = {
  P1: "#ef4444", // Red
  P2: "#3b82f6", // Blue
  EMPTY: "#f3f4f6", // Light Gray
  BORDER: "#374151", // Dark Gray
};

export const styles: { [key: string]: CSSProperties } = {
  container: {
    padding: 20,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    maxWidth: 500,
    margin: "0 auto",
    textAlign: "center",
  },
  title: {
    color: "#333",
    fontSize: "2.5rem",
    marginBottom: 30,
  },
  lobbyBox: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    alignItems: "center",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    width: "200px",
    textAlign: "center",
    textTransform: "uppercase",
  },
  buttonPrimary: {
    padding: "12px 24px",
    fontSize: "18px",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  buttonSecondary: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
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
  },
  buttonResetSmall: {
    padding: "5px 10px",
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
    padding: 10,
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
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: 20,
    padding: "10px",
    borderBottom: "3px solid",
    display: "inline-block",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 80px)",
    gap: "8px",
    justifyContent: "center",
    backgroundColor: "#1f2937",
    padding: "10px",
    borderRadius: "10px",
  },
  cell: {
    width: 80,
    height: 80,
    fontSize: 24,
    fontWeight: "bold",
    borderRadius: "8px",
    transition: "transform 0.1s",
  },
};