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

def load_latest_game():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT board, current_player, winner
        FROM games
        ORDER BY game_id DESC
        LIMIT 1
    """)
    row = cur.fetchone()
    conn.close()

    if row:
        return json.loads(row[0]), row[1], row[2]
    return None, None, None
