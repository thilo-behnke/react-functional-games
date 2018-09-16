import * as React from 'react';
import { differenceBy, uniqBy } from 'lodash';
import { pipe } from 'lodash/fp';
import './GameArea.css';
import { getAdjacent, groupByGaps, initGameField, recalculatePositions } from './GameAreaUtils';
import { FIELD_ROWS, GameField } from './constants';
import Block from './Block';

class GameArea extends React.Component<{}, { field: GameField }> {
    constructor(props: any) {
        super(props)
        this.state = {field: []}
    }

    componentDidMount() {
        const field = initGameField(FIELD_ROWS)
        this.setState({field})
    }

    public render() {

        const blocks = this.state && this.state.field

        return <div className="GameArea-grid">
            {blocks.map(block => {
                const {color, id, pos: [x, y]} = block
                return <Block key={id}
                              color={color}
                              gridX={x}
                              gridY={y}
                              onClick={
                                  () => {
                                      const toRemove = uniqBy([block, ...getAdjacent(block, blocks)], 'id')
                                      const newField = differenceBy(blocks, toRemove, 'id')
                                      const updatedGridValues = pipe(
                                          groupByGaps,
                                          recalculatePositions(newField)
                                      )(toRemove)
                                      // TODO: Why is this creating duplicates?
                                      const field = [
                                          ...updatedGridValues,
                                          ...differenceBy(newField, updatedGridValues, 'id')
                                      ]
                                      console.log(field, updatedGridValues)
                                      this.setState({field})
                                  }
                              }
                />
            })
            }
        </div>
    }
}

export default GameArea