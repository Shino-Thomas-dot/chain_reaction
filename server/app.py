import json
from typing import List, Optional
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from game_logic import create_empty_board, apply_move, check_winner
from database import init_db, save_game, load_latest_game

app = FastAPI()

class GameManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.board = []
        self.current_player = 1
        self.winner = None
        self.move_count = 0  # <--- Added Move Counter
        
        # Don't load state here to avoid DB errors before startup

    def load_state(self):
        """Loads state from DB or creates a fresh one."""
        try:
            board, current_player, winner = load_latest_game()
            if board is None:
                self.reset_state()
            else:
                self.board = board
                self.current_player = current_player
                self.winner = winner
                # Estimate move count based on orbs on board (approximate)
                # This ensures we don't accidentally declare a winner immediately on load
                self.move_count = sum(abs(cell) for row in self.board for cell in row)
        except Exception as e:
            print(f"Error loading state: {e}")
            self.reset_state()

    def reset_state(self):
        """Resets the game to a clean slate."""
        self.board = create_empty_board()
        self.current_player = 1
        self.winner = None
        self.move_count = 0  # <--- Reset Counter
        save_game(self.board, self.current_player, self.winner)

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        await self.send_state(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def send_state(self, websocket: WebSocket):
        await websocket.send_text(json.dumps({
            "board": self.board,
            "current_player": self.current_player,
            "winner": self.winner
        }))

    async def broadcast_state(self):
        if not self.active_connections:
            return
            
        message = json.dumps({
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
        if self.winner:
            return "Game is over"

        if player != self.current_player:
            return "Not your turn"

        new_board = apply_move(self.board, player, row, col)
        if new_board is None:
            return "Invalid move"

        self.board = new_board
        self.current_player = 2 if self.current_player == 1 else 1
        self.move_count += 1  # <--- Increment Counter
        
        # Pass the REAL move_count. 
        # On move 1, this is 1. Since 1 < 2, check_winner returns None.
        self.winner = check_winner(self.board, self.move_count) 
        
        save_game(self.board, self.current_player, self.winner)
        return None

game_manager = GameManager()

@app.on_event("startup")
def startup():
    init_db()
    game_manager.load_state()

@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await game_manager.connect(ws)
    
    try:
        while True:
            data = json.loads(await ws.receive_text())
            
            if data.get("type") == "RESET":
                game_manager.reset_state()
                await game_manager.broadcast_state()
                continue

            player = data.get("player")
            row = data.get("row")
            col = data.get("col")

            error = await game_manager.process_move(player, row, col)
            
            if error:
                await ws.send_text(json.dumps({"error": error}))
            else:
                await game_manager.broadcast_state()

    except WebSocketDisconnect:
        game_manager.disconnect(ws)
    except Exception as e:
        print(f"Error: {e}")
        game_manager.disconnect(ws)