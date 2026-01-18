import socket
import threading
import json
from config import HOST, PORT
from database import init_db

clients = []
current_player = 1

board = [[0]*3 for _ in range(3)]

def handle_client(conn, addr):
    global current_player
    print("Connected:", addr)

    player_id = len(clients) + 1
    clients.append(conn)

    conn.send(json.dumps({
        "action": "assign",
        "player": player_id
    }).encode())

    while True:
        try:
            data = conn.recv(1024).decode()
            if not data:
                break
            msg = json.loads(data)
            print("Received:", msg)

        except:
            break

    conn.close()

def start_server():
    init_db()
    s = socket.socket()
    s.bind((HOST, PORT))
    s.listen(2)

    print(f"Server running on {PORT}")

    while True:
        conn, addr = s.accept()
        threading.Thread(target=handle_client, args=(conn, addr)).start()

if __name__ == "__main__":
    start_server()
