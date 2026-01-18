import sqlite3
import json
from config import DB_NAME

def get_connection():
    return sqlite3.connect(DB_NAME)

def init_db():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS games (
            game_id INTEGER PRIMARY KEY AUTOINCREMENT,
            board TEXT,
            current_player INTEGER,
            winner INTEGER
        )
    """)
    conn.commit()
    conn.close()

def save_game(board, current_player, winner=None):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO games(board, current_player, winner) VALUES (?, ?, ?)",
        (json.dumps(board), current_player, winner)
    )
    conn.commit()
    conn.close()
