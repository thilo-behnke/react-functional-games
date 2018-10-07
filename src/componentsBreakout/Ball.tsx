import * as React from 'react'
import { Ball } from './BreakoutApp';



export const BallTile = ({ball}: {ball: Ball}) => {
    const {color, pos: [x, y], vel: [velX, velY]} = ball
    return <span style={{backgroundColor: color, gridRow: y, gridColumn: x}} className='Tile'/>
}