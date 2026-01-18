import copy

GRID_SIZE = 3

def get_cell_limit(row, col):
    """
    Returns the critical mass for a cell:
    - Corner: 1
    - Edge: 2
    - Center: 3
    """
    if (row == 0 or row == GRID_SIZE - 1) and (col == 0 or col == GRID_SIZE - 1):
        return 1  # Corner
    elif row == 0 or row == GRID_SIZE - 1 or col == 0 or col == GRID_SIZE - 1:
        return 2  # Edge
    return 3  # Center


def create_empty_board():
    return [[0 for _ in range(GRID_SIZE)] for _ in range(GRID_SIZE)]


def apply_move(board, player, row, col):
    # Create a copy so we don't mutate the state unless the move is valid
    board = copy.deepcopy(board)

    # Validation: Cannot play on a cell owned by the opponent
    # (Checking if cell is not empty AND signs don't match)
    cell_value = board[row][col]
    if cell_value != 0:
        is_p1_cell = cell_value > 0
        is_current_p1 = (player == 1)
        if is_p1_cell != is_current_p1:
            return None  # Invalid move

    # Add orb to the cell
    board[row][col] += 1 if player == 1 else -1

    # Start the chain reaction
    explode(board, row, col, player)
    
    return board


def explode(board, row, col, player):
    """
    Recursive function to handle chain reactions.
    """
    limit = get_cell_limit(row, col)

    # Base Case: If cell is stable, stop.
    if abs(board[row][col]) <= limit:
        return

    # 1. Cell Explodes: It empties out completely
    board[row][col] = 0

    # 2. Distribute orbs to neighbors
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    
    for dr, dc in directions:
        r, c = row + dr, col + dc
        
        # Check boundaries
        if 0 <= r < GRID_SIZE and 0 <= c < GRID_SIZE:
            
            # --- THE FIX IS HERE ---
            # Instead of just adding +1/-1, we take the MAGNITUDE (abs)
            # and force the sign to match the EXPLODING player.
            
            current_orbs = abs(board[r][c])
            new_orbs = current_orbs + 1
            
            # Set the cell to the exploding player's color (occupy it)
            board[r][c] = new_orbs if player == 1 else -new_orbs
            
            # Recursive call: The neighbor might now be unstable too
            explode(board, r, c, player)


def check_winner(board, move_count):
    # Prevent early victory checks (at least 2 moves required)
    if move_count < 2:
        return None

    # Check if any player has been wiped out
    has_p1 = any(cell > 0 for row in board for cell in row)
    has_p2 = any(cell < 0 for row in board for cell in row)

    if has_p1 and not has_p2:
        return 1
    if has_p2 and not has_p1:
        return 2
        
    return None