# Chain Reaction – Multiplayer Game (Simplified)

A turn-based multiplayer Chain Reaction game built using:

- Python Socket Server
- SQLite Database
- React Native Mobile Client

---

## Architecture

Mobile Clients (React Native)
        |
     Socket (JSON)
        |
Python Game Server
        |
     SQLite DB

---

## Project Folder Structure

chain-reaction-game/
1. server/        # Backend (Chrislo) – game logic, socket server, database
2. client/        # Mobile App (Shino) – React Native UI & socket client
3. protocol/      # Socket message contracts (JSON)
4. docs/          # Architecture diagrams & database schema

---

## Tech Stack

- Backend: Python 3, socket, threading
- Database: SQLite
- Frontend: React Native (Expo)

---

## How to Run

### Server
```bash
cd server
pip install -r requirements.txt
python app.py
