import copy

GRID_SIZE = 3

def get_cell_limit(row, col):
    if (row == 0 or row == GRID_SIZE - 1) and (col == 0 or col == GRID_SIZE - 1):
        return 1  # corner
    elif row == 0 or row == GRID_SIZE - 1 or col == 0 or col == GRID_SIZE - 1:
        return 2  # edge
    return 3  # center


def create_empty_board():
    return [[0 for _ in range(GRID_SIZE)] for _ in range(GRID_SIZE)]


def apply_move(board, player, row, col):
    board = copy.deepcopy(board)

    # Cannot play on opponent cell
    if board[row][col] != 0 and (board[row][col] > 0) != (player == 1):
        return None

    board[row][col] += 1 if player == 1 else -1
    explode(board, row, col, player)
    return board


def explode(board, row, col, player):
    limit = get_cell_limit(row, col)

    if abs(board[row][col]) <= limit:
        return

    board[row][col] = 0

    directions = [(-1,0),(1,0),(0,-1),(0,1)]
    for dr, dc in directions:
        r, c = row + dr, col + dc
        if 0 <= r < GRID_SIZE and 0 <= c < GRID_SIZE:
            board[r][c] += 1 if player == 1 else -1
            explode(board, r, c, player)


def check_winner(board, move_count):
    # Prevent early victory
    if move_count < 2:
        return None

    has_p1 = any(cell > 0 for row in board for cell in row)
    has_p2 = any(cell < 0 for row in board for cell in row)

    if has_p1 and not has_p2:
        return 1
    if has_p2 and not has_p1:
        return 2
    return None
