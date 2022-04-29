export default function gameStateReducer(puzzle = [], action) {
    if (action.type === "/game-state/load") {
        puzzle = action.payload.puzzle;
    }

    return puzzle;
}

//actions

export function loadGameState(puzzle) {
    return {
        type: "/game-state/load",
        payload: { puzzle },
    };
}
