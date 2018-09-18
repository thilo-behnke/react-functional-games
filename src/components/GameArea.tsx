import * as React from 'react';
import { differenceBy } from 'lodash';
import { map, pipe, uniqBy } from 'lodash/fp';
import './GameArea.css';
import { getAdjacent, groupByGaps, initGameField, recalculatePositions } from './GameAreaUtils';
import { FIELD_ROWS, GameBlock, GameField } from './constants';
import Block from './Block';

export const calcScore = (n: number) => n * 5 * Math.floor(n / 10 + 1) ** 2
export const calcRemove = (block: GameBlock, blocks: GameField) => uniqBy('id', [block, ...getAdjacent(block, blocks)])

class GameArea extends React.Component<{ updateScore: (score: number) => void, plusScore: (score: number) => void }, { field: GameField }> {
    constructor(props: { updateScore: (score: number) => void, plusScore: (score: number) => void }) {
        super(props)
        this.state = {field: []}
    }

    componentDidMount() {
        const field = initGameField(FIELD_ROWS)
        this.setState({field})
    }

    public render() {

        const {updateScore, plusScore} = this.props
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
                                  plusScore(adjacent.length)
                                  this.setState({field: blocks.map(block => map('id', adjacent).includes(block.id) ? {...block, selected: true} : block)})
                              }}
                              onMouseLeave={() => plusScore(null)}
                              onClick={
                                  () => {
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
                                  }
                              }
                />

            })
            }
        </div>
    }
}

export default GameArea