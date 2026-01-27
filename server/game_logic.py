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
    """
    Applies a move and handles chain reactions using a Loop (Queue) 
    instead of Recursion to prevent crashing.
    """
    # Create a deep copy to ensure we don't modify the previous state directly
    board = copy.deepcopy(board)

    # 1. Validation: Cannot play on a cell owned by the opponent
    cell_value = board[row][col]
    if cell_value != 0:
        is_p1_cell = cell_value > 0
        is_current_p1 = (player == 1)
        if is_p1_cell != is_current_p1:
            return None  # Invalid move

    # 2. Add the initial orb
    board[row][col] += 1 if player == 1 else -1

    # 3. Initialize the Explosion Queue
    # We add the placed cell to the queue if it's unstable
    limit = get_cell_limit(row, col)
    queue = []
    
    if abs(board[row][col]) > limit:
        queue.append((row, col))

    # 4. Process the Queue (Iterative Explosion)
    # This loop runs until the board stabilizes
    while queue:
        r, c = queue.pop(0)
        
        # Double check stability (it might have changed while in queue)
        limit = get_cell_limit(r, c)
        current_mass = abs(board[r][c])
        
        if current_mass <= limit:
            continue

        # EXPLODE: Empty the cell
        board[r][c] = 0

        # Distribute to neighbors
        directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            
            # Check boundaries
            if 0 <= nr < GRID_SIZE and 0 <= nc < GRID_SIZE:
                
                # Add orb to neighbor
                neighbor_mass = abs(board[nr][nc])
                new_mass = neighbor_mass + 1
                
                # CONQUER: Neighbor takes the color of the EXPLODING player
                # (The player variable here is the one who made the move)
                board[nr][nc] = new_mass if player == 1 else -new_mass
                
                # Check if this neighbor is now unstable
                n_limit = get_cell_limit(nr, nc)
                if new_mass > n_limit:
                    # Add to queue to process later
                    queue.append((nr, nc))

    return board


def check_winner(board, move_count):
    # Prevent early victory checks
    if move_count < 2:
        return None

    has_p1 = any(cell > 0 for row in board for cell in row)
    has_p2 = any(cell < 0 for row in board for cell in row)

    if has_p1 and not has_p2:
        return 1
    if has_p2 and not has_p1:
        return 2
        
    return None