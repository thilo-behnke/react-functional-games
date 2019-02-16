import './GameArea.css';

import { differenceBy, without } from 'lodash';
import { map, pipe } from 'lodash/fp';
import * as React from 'react';

import { Color, GameField, GameMode } from './constants';
import {
  calcMultiplier,
  calcRemove,
  calcScore,
  groupByGaps,
  recalculatePositions
} from './GameAreaUtils';
import Block from './Block';
import score from './Score';

export interface GameAreaProps {
    enabled: boolean,
    updateScore: (score: number) => void,
    plusScore: (score: number, multiplicator: number) => void,
    decrementBridges: () => void,
    decrementTurns: () => void,
    updateField: (field: GameField) => void,
    mode: GameMode,
    field: GameField
}

class GameArea extends React.Component<GameAreaProps, {}> {
    constructor(props: GameAreaProps) {
        super(props)
    }

    public render() {

        const {enabled, updateScore, plusScore, decrementBridges, decrementTurns, updateField, mode, field} = this.props
        const blocks = field

        return <div className={`GameArea-grid${!enabled ? ' GameArea-grid--disabled' : ''}`}>
            {blocks.map((block, i) => {
                const {color, id, pos: [x, y], selected} = block
                return <Block key={id}
                              color={color}
                              gridX={x}
                              gridY={y}
                              selected={selected}
                              onMouseEnter={enabled && (() => {
                                  const adjacent = calcRemove(block, blocks)
                                  switch (mode) {
                                      case GameMode.NORMAL:
                                          plusScore(calcScore(adjacent.length), calcMultiplier(adjacent.length))
                                          updateField(blocks.map(block => map('id', adjacent).includes(block.id) ? {
                                              ...block,
                                              selected: true
                                          } : {...block, selected: false}))
                                          break
                                      case GameMode.BRIDGE:
                                          break
                                  }

                              })}
                              onMouseLeave={enabled && (() => {
                                  switch (mode) {
                                      case GameMode.NORMAL:
                                          const adjacent = calcRemove(block, blocks)
                                          plusScore(null, null)
                                          updateField(blocks.map(block => map('id', adjacent).includes(block.id) ? {
                                                  ...block,
                                                  selected: false
                                              } : block))
                                          break
                                      case GameMode.BRIDGE:
                                          break
                                  }
                              })}
                              onClick={enabled && (() => {
                                  switch (mode) {
                                      case GameMode.NORMAL:
                                          const toRemove = calcRemove(block, blocks)
                                          const newField = differenceBy(blocks, toRemove, 'id')
                                          const updatedGridValues = pipe(
                                              groupByGaps,
                                              recalculatePositions(newField),
                                          )(toRemove)
                                          const field = [
                                              ...updatedGridValues,
                                              ...differenceBy(newField, updatedGridValues, 'id'),
                                          ]
                                          updateField(field)
                                          updateScore(calcScore(toRemove.length))
                                          plusScore(null, null)
                                          decrementTurns()
                                          break
                                      case GameMode.BRIDGE:
                                          updateField([...without(blocks, block), {...block, color: Color.RED}])
                                          decrementBridges()
                                          break
                                  }
                              })}
                />
            })}
        </div>
    }
}

export default GameArea
