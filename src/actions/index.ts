import { GameField, GameMode } from "../componentsBricks/constants";

export enum GameActions {
  RESET_GAME = "RESET_GAME",
  INCREMENT_TURNS = "INCREMENT_TURNS",
  DECREMENT_TURNS = "DECREMENT_TURNS",
  INCREMENT_BRIDGES = "INCREMENT_BRIDGES",
  DECREMENT_BRIDGES = "DECREMENT_BRIDGES",
  SET_GAME_MODE = "SET_GAME_MODE",
  SET_TEMP_SCORE = "SET_TEMP_SCORE",
  ADD_TO_SCORE = "ADD_TO_SCORE",
  SET_GAME_FIELD = "SET_GAME_FIELD"
}
export const resetGame = () => ({
  type: GameActions.RESET_GAME
});
export const incrementTurns = () => ({
  type: GameActions.INCREMENT_TURNS
});
export const decrementTurns = () => ({
  type: GameActions.DECREMENT_TURNS
});
export const incrementBridges = () => ({
  type: GameActions.INCREMENT_BRIDGES
});
export const decrementBridges = () => ({
  type: GameActions.DECREMENT_BRIDGES
});
export const setGameMode = (mode: GameMode) => ({
  type: GameActions.SET_GAME_MODE,
  payload: { mode }
});
export const setTempScore = (score: number, multiplier: number) => ({
  type: GameActions.SET_TEMP_SCORE,
  payload: { score, multiplier }
});
export const addToScore = (score: number) => ({
  type: GameActions.ADD_TO_SCORE,
  payload: { score }
});
export const setGameField = (field: GameField) => ({
  type: GameActions.SET_GAME_FIELD,
  payload: { field }
});
