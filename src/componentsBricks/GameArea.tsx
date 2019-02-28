import "./GameArea.css";

import { differenceBy, without } from "lodash";
import { map, pipe } from "lodash/fp";
import * as React from "react";

import { Color, GameField, GameMode } from "./constants";
import {
  calcMultiplier,
  calcRemove,
  calcScore,
  groupByGaps,
  recalculatePositions
} from "./GameAreaUtils";
import Block from "./Block";
import score from "./Score";

export interface GameAreaProps {
  enabled: boolean;
  addToScore: (score: number) => void;
  setTempScore: (score: number, multiplicator: number) => void;
  decrementBridges: () => void;
  decrementTurns: () => void;
  setGameField: (field: GameField) => void;
  mode: GameMode;
  field: GameField;
}

class GameArea extends React.Component<GameAreaProps, {}> {
  constructor(props: GameAreaProps) {
    super(props);
  }

  public render() {
    const {
      enabled,
      addToScore,
      setTempScore,
      decrementBridges,
      decrementTurns,
      setGameField,
      mode,
      field
    } = this.props;
    const blocks = field;

    return (
      <div
        className={`GameArea-grid${!enabled ? " GameArea-grid--disabled" : ""}`}
      >
        {blocks.map((block, i) => {
          const {
            color,
            id,
            pos: [x, y],
            selected
          } = block;
          return (
            <Block
              key={id}
              color={color}
              gridX={x}
              gridY={y}
              selected={selected}
              onMouseEnter={
                enabled &&
                (() => {
                  const adjacent = calcRemove(block, blocks);
                  switch (mode) {
                    case GameMode.NORMAL:
                      setTempScore(
                        calcScore(adjacent.length),
                        calcMultiplier(adjacent.length)
                      );
                      setGameField(
                        blocks.map(block =>
                          map("id", adjacent).includes(block.id)
                            ? {
                                ...block,
                                selected: true
                              }
                            : { ...block, selected: false }
                        )
                      );
                      break;
                    case GameMode.BRIDGE:
                      break;
                  }
                })
              }
              onMouseLeave={
                enabled &&
                (() => {
                  switch (mode) {
                    case GameMode.NORMAL:
                      const adjacent = calcRemove(block, blocks);
                      setTempScore(null, null);
                      setGameField(
                        blocks.map(block =>
                          map("id", adjacent).includes(block.id)
                            ? {
                                ...block,
                                selected: false
                              }
                            : block
                        )
                      );
                      break;
                    case GameMode.BRIDGE:
                      break;
                  }
                })
              }
              onClick={
                enabled &&
                (() => {
                  switch (mode) {
                    case GameMode.NORMAL:
                      const toRemove = calcRemove(block, blocks);
                      const newField = differenceBy(blocks, toRemove, "id");
                      const updatedGridValues = pipe(
                        groupByGaps,
                        recalculatePositions(newField)
                      )(toRemove);
                      const field = [
                        ...updatedGridValues,
                        ...differenceBy(newField, updatedGridValues, "id")
                      ];
                      setGameField(field);
                      addToScore(calcScore(toRemove.length));
                      setTempScore(null, null);
                      decrementTurns();
                      break;
                    case GameMode.BRIDGE:
                      setGameField([
                        ...without(blocks, block),
                        { ...block, color: Color.RED }
                      ]);
                      decrementBridges();
                      break;
                  }
                })
              }
            />
          );
        })}
      </div>
    );
  }
}

export default GameArea;
