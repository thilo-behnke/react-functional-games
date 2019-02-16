import { Dispatch } from "redux";
import { connect } from "react-redux";
import * as React from "react";

import { Button } from "./componentsBricks/Button";
import { GameAppState } from "./reducers";
import { GameField, GameMode, GameState } from "./componentsBricks/constants";
import { Output } from "./componentsBricks/Output";
import { Turns } from "./componentsBricks/Turns";
import {
  addToScore,
  decrementBridges,
  decrementTurns,
  incrementBridges,
  incrementTurns,
  resetGame,
  setGameField,
  setGameMode,
  setTempScore
} from "./actions";
import GameArea from "./componentsBricks/GameArea";
import Score from "./componentsBricks/Score";
import ScoreCalc from "./componentsBricks/ScoreCalc";
import SetBridge from "./componentsBricks/SetBridge";

type BricksAppProps = GameAppState & {
  addToScore: (score: number) => void;
  decrementBridges: () => void;
  incrementBridges: () => void;
  incrementTurns: () => void;
  decrementTurns: () => void;
  resetGame: () => void;
  setGameField: (field: GameField) => void;
  setGameMode: (mode: GameMode) => void;
  setTempScore: () => void;
};

// TODO: Solve typing issue
class BricksApp extends React.Component<any> {
  public render() {
    const {
      score,
      tempScore,
      mode,
      bridges,
      state,
      turns,
      field,
      addToScore,
      decrementBridges,
      decrementTurns,
      resetGame,
      setGameField,
      setGameMode,
      setTempScore
    } = this.props;

    return (
      <div className="MainGrid">
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center"
            }}
          >
            <Output
              text={
                state === GameState.PLAYING
                  ? "Play Bricks"
                  : state === GameState.WON
                  ? "You won!"
                  : "Lost!"
              }
              className={"GameTitle"}
            />
            {state === GameState.LOST && (
              <Button onClick={() => resetGame()} title="Reset Game" />
            )}
          </div>
          <GameArea
            {...{
              enabled: state === GameState.PLAYING,
              field,
              addToScore,
              setTempScore,
              decrementBridges,
              decrementTurns,
              setGameField,
              mode
            }}
          />
        </div>
        <div className="SideGrid">
          <Turns {...{ turns }} />
          <SetBridge
            onClick={() =>
              setGameMode(
                mode === GameMode.NORMAL ? GameMode.BRIDGE : GameMode.NORMAL
              )
            }
            active={mode === GameMode.BRIDGE}
            enabled={bridges > 0}
          />
          <div className="ScoreArea">
            <Score {...{ score }} />
            {tempScore && <ScoreCalc tempScore={tempScore} />}
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state: GameAppState) => state;
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  resetGame: () => dispatch(resetGame()),
  incrementTurns: () => dispatch(incrementTurns()),
  decrementTurns: () => dispatch(decrementTurns()),
  incrementBridges: () => dispatch(incrementBridges()),
  decrementBridges: () => dispatch(decrementBridges()),
  setGameMode: (mode: GameMode) => dispatch(setGameMode(mode)),
  setTempScore: (score: number, multiplier: number) =>
    dispatch(setTempScore(score, multiplier)),
  addToScore: (score: number) => dispatch(addToScore(score)),
  setGameField: (field: GameField) => dispatch(setGameField(field))
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
  /* {resetGame, incrementTurns, decrementTurns, incrementBridges, decrementBridges, setGameMode, setTempScore, addToScore, setGameField} */
)(BricksApp);
