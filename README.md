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

## Folder Structure

chain-reaction-game/
│
├── server/        # Backend (Chrislo)
├── client/        # Mobile App (Shino)
├── protocol/      # Socket message contracts
├── docs/          # Diagrams & schema
└── README.md

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
