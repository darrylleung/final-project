import { combineReducers } from "redux";
import gameStateReducer from "../redux/game-state/slice";

const rootReducer = combineReducers({
    gameState: gameStateReducer,
});

export default rootReducer;
