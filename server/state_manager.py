import json
import random
import string
from typing import List, Optional, Dict
from fastapi import WebSocket
from game_logic import create_empty_board, apply_move, check_winner
from database import save_game

# --- Global Dictionary to store active rooms ---
rooms: Dict[str, 'GameManager'] = {}

def generate_room_code():
    return ''.join(random.choices(string.ascii_uppercase, k=4))

class GameManager:
    def __init__(self, room_id: str):
        self.room_id = room_id
        self.active_connections: List[WebSocket] = []
        self.board = create_empty_board()
        self.current_player = 1
        self.winner = None
        self.move_count = 0 

    def reset_game(self):
        """Resets the game state to the beginning."""
        self.board = create_empty_board()
        self.current_player = 1
        self.winner = None
        self.move_count = 0
        save_game(self.board, self.current_player, self.winner) 
        
    async def connect(self, websocket: WebSocket):
        self.active_connections.append(websocket)
        assigned_player_id = len(self.active_connections)
        
        await websocket.send_text(json.dumps({
            "type": "INIT",
            "player_id": assigned_player_id,
            "room_id": self.room_id,
            "board": self.board,
            "current_player": self.current_player,
            "winner": self.winner
        }))

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast_state(self):
        if not self.active_connections:
            return
        
        message = json.dumps({
            "type": "UPDATE",
            "board": self.board,
            "current_player": self.current_player,
            "winner": self.winner
        })
        
        for connection in list(self.active_connections):
            try:
                await connection.send_text(message)
            except RuntimeError:
                self.disconnect(connection)

    async def process_move(self, player: int, row: int, col: int) -> Optional[str]:
        if self.winner: return "Game is over"
        if player != self.current_player: return "Not your turn"

        new_board = apply_move(self.board, player, row, col)
        if new_board is None: return "Invalid move"

        self.board = new_board
        self.current_player = 2 if self.current_player == 1 else 1
        self.move_count += 1
        self.winner = check_winner(self.board, self.move_count) 
        
        save_game(self.board, self.current_player, self.winner)
        return None