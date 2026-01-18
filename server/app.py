import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from game_logic import create_empty_board, apply_move, check_winner
from database import init_db, save_game, load_latest_game

app = FastAPI()

# Global move counter (server authoritative)
move_count = 0

@app.on_event("startup")
def startup():
    init_db()

@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    global move_count
    await ws.accept()

    board, current_player, winner = load_latest_game()

    # If no saved game, start fresh
    if board is None:
        board = create_empty_board()
        current_player = 1
        winner = None
        move_count = 0

    # Send initial state
    await ws.send_text(json.dumps({
        "board": board,
        "current_player": current_player,
        "winner": winner
    }))

    try:
        while True:
            data = json.loads(await ws.receive_text())

            # Game already finished
            if winner:
                continue

            player = data["player"]
            row = data["row"]
            col = data["col"]

            # Enforce turn order
            if player != current_player:
                await ws.send_text(json.dumps({"error": "Not your turn"}))
                continue

            new_board = apply_move(board, player, row, col)
            if new_board is None:
                await ws.send_text(json.dumps({"error": "Invalid move"}))
                continue

            board = new_board
            move_count += 1

            winner = check_winner(board, move_count)
            current_player = 2 if current_player == 1 else 1

            save_game(board, current_player, winner)

            await ws.send_text(json.dumps({
                "board": board,
                "current_player": current_player,
                "winner": winner
            }))

    except WebSocketDisconnect:
        print("Client disconnected")
