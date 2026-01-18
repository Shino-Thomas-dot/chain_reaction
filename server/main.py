import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from database import init_db
# Import from your new file
from state_manager import GameManager, rooms, generate_room_code

app = FastAPI()

@app.on_event("startup")
def startup():
    init_db()

@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    
    room_id = None
    game: GameManager = None

    try:
        data = await ws.receive_json()
        action = data.get("action")

        if action == "CREATE":
            room_id = generate_room_code()
            game = GameManager(room_id)
            rooms[room_id] = game
        
        elif action == "JOIN":
            room_id = data.get("code")
            if room_id not in rooms:
                await ws.send_json({"error": "Room not found"})
                await ws.close()
                return
            game = rooms[room_id]
            if len(game.active_connections) >= 2:
                await ws.send_json({"error": "Room is full"})
                await ws.close()
                return

        await game.connect(ws)

        while True:
            data = json.loads(await ws.receive_text())
            if data.get("type") == "RESET":
                game.reset_game() 
                await game.broadcast_state()
                continue

            player = data.get("player")
            row = data.get("row")
            col = data.get("col")

            error = await game.process_move(player, row, col)
            
            if error:
                await ws.send_json({"error": error})
            else:
                await game.broadcast_state()

    except WebSocketDisconnect:
        if game:
            game.disconnect(ws)
            if len(game.active_connections) == 0 and room_id in rooms:
                del rooms[room_id]
    except Exception as e:
        print(f"Error: {e}")