GRID_SIZE = 3

def get_limit(row, col):
    if (row in [0, 2]) and (col in [0, 2]):
        return 1
    elif row in [0, 2] or col in [0, 2]:
        return 2
    return 3

def check_winner(board):
    p1, p2 = False, False
    for row in board:
        for cell in row:
            if cell > 0:
                p1 = True
            if cell < 0:
                p2 = True
    if p1 and not p2:
        return 1
    if p2 and not p1:
        return 2
    return None
