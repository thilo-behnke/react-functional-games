import {
  FIELD_COLUMNS,
  FIELD_ROWS,
  GameField,
  GameMode,
  GameState
} from "../componentsBricks/constants";
import { GameActions } from "../actions";
import { initGameField } from "../componentsBricks/GameAreaUtils";

export type GameAppState = {
  score: number;
  tempScore: { score: number; multiplier: number } | null;
  mode: GameMode;
  bridges: number;
  turns: number;
  state: GameState;
  field: GameField;
};

const initialState = {
  score: 0,
  tempScore: null,
  mode: GameMode.NORMAL,
  bridges: 1,
  turns: 20,
  state: GameState.PLAYING,
  field: initGameField(FIELD_ROWS, FIELD_COLUMNS)
} as GameAppState;

const reducer = (state: GameAppState = initialState, action: any) => {
  console.log(action);
  switch (action.type) {
    case GameActions.RESET_GAME:
      return initialState;
    case GameActions.INCREMENT_TURNS:
      return {
        ...state,
        turns: state.turns + 1
      };
    case GameActions.DECREMENT_TURNS:
      const turns = Math.max(0, state.turns - 1);
      return {
        ...state,
        turns,
        state: turns ? state.state : GameState.LOST
      };
    case GameActions.INCREMENT_BRIDGES:
      return {
        ...state,
        bridges: state.bridges + 1
      };
    case GameActions.DECREMENT_BRIDGES:
      const bridges = Math.max(state.bridges - 1);
      return {
        ...state,
        bridges,
        mode: bridges ? state.mode : GameMode.NORMAL
      };
    case GameActions.SET_GAME_MODE:
      return {
        ...state,
        mode: action.payload.mode
      };
    case GameActions.SET_TEMP_SCORE:
      return {
        ...state,
        tempScore: {
          score: action.payload.score,
          multiplier: action.payload.multiplier
        }
      };
    case GameActions.ADD_TO_SCORE:
      return {
        ...state,
        score: state.score + action.payload.score
      };
    case GameActions.SET_GAME_FIELD:
      console.log(state.field);
      return {
        ...state,
        field: action.payload.field,
        state: state.field.length ? state.state : GameState.WON
      };
  }
  return state;
};
export default reducer;
