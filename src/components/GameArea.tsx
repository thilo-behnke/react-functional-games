import * as React from 'react';
import { differenceBy, without } from 'lodash';
import { map, pipe, uniqBy } from 'lodash/fp';
import './GameArea.css';
import { getAdjacent, groupByGaps, initGameField, recalculatePositions } from './GameAreaUtils';
import { Color, FIELD_ROWS, GameBlock, GameField, GameMode } from './constants';
import Block from './Block';

export const calcScore = (n: number) => n * 5 * Math.floor(n / 10 + 1) ** 2
export const calcRemove = (block: GameBlock, blocks: GameField) => uniqBy('id', [block, ...getAdjacent(block, blocks)])

export interface GameAreaProps {
    updateScore: (score: number) => void,
    plusScore: (score: number) => void,
    decrementBridges: () => void,
    mode: GameMode
}

class GameArea extends React.Component<GameAreaProps, { field: GameField }> {
    constructor(props: GameAreaProps) {
        super(props)
        this.state = {field: []}
    }

    componentDidMount() {
        const field = initGameField(FIELD_ROWS)
        this.setState({field})
    }

    public render() {

        const {updateScore, plusScore, decrementBridges, mode} = this.props
        const blocks = this.state && this.state.field

        return <div className="GameArea-grid">
            {blocks.map((block, i) => {
                const {color, id, pos: [x, y], selected} = block
                return <Block key={id}
                              color={color}
                              gridX={x}
                              gridY={y}
                              selected={selected}
                              onMouseOver={() => {
                                  const adjacent = calcRemove(block, blocks)
                                  switch (mode) {
                                      case GameMode.NORMAL:
                                          plusScore(adjacent.length)
                                          this.setState({
                                              field: blocks.map(block => map('id', adjacent).includes(block.id) ? {
                                                  ...block,
                                                  selected: true
                                              } : {...block, selected: false})
                                          })
                                          break
                                      case GameMode.BRIDGE:
                                          break
                                  }

                              }}
                              onMouseLeave={() => {
                                  switch (mode) {
                                      case GameMode.NORMAL:
                                          const adjacent = calcRemove(block, blocks)
                                          plusScore(null)
                                          this.setState({
                                              field: blocks.map(block => map('id', adjacent).includes(block.id) ? {
                                                  ...block,
                                                  selected: false
                                              } : block)
                                          })
                                          break
                                      case GameMode.BRIDGE:
                                          break
                                  }
                              }}
                              onClick={
                                  () => {
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
                                              this.setState({field})
                                              updateScore(calcScore(toRemove.length))
                                              plusScore(null)
                                              break
                                          case GameMode.BRIDGE:
                                              this.setState({
                                                  field: [...without(blocks, block), {...block, color: Color.RED}]
                                              })
                                              decrementBridges()
                                              break
                                      }
                                  }
                              }
                />

            })
            }
        </div>
    }
}

export default GameArea