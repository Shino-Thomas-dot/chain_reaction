export type GameState = {
    type: string;
    board: number[][];
    current_player: number;
    winner: number | null;
    room_id?: string;
    player_id?: number;
    error?: string;
};
  
export type PlayerColor = {
    P1: string;
    P2: string;
    EMPTY: string;
    BORDER: string;
};