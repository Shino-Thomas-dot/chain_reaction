def is_valid_move(data):
    required = {"player", "row", "col"}
    return required.issubset(data.keys())
