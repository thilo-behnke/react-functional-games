import * as React from 'react'
import './BreakoutApp.css'
import { find, filter, map, pipe } from 'lodash/fp'
import { getGrid } from '../componentsBricks/GameAreaUtils';
import { BallTile } from './Ball';

export type Tile = { color: string, pos: [number, number] }
export type Grid = Array<Tile>
export type Ball = Tile & { vel: [number, number] }


export class BreakoutApp extends React.Component<{}, { grid: Grid, ball: Ball, time: number }> {
    interval: any

    constructor(props: {}) {
        super(props)
        this.state = {
            grid: getGrid(80, 200).map(pos => ({color: 'yellow', pos})),
            ball: {pos: [1, 1], vel: [1, 1], color: 'blue'},
            time: Date.now()
        }
    }

    componentDidMount() {
        this.interval = setInterval(() => this.setState({time: Date.now()}), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        const {grid, ball} = this.state
        // const newBall = {...ball, pos: [x + velX, y + velY]}

        return <div className='PlayField'>
            {
                map(({color, pos: [x, y]}) => <span style={{backgroundColor: color, gridRow: y, gridColumn: x}}
                                                    className='Tile'/>, grid)
            }
            <BallTile {...{ball}}/>
        </div>
    }
}