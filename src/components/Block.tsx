import * as React from 'react';
import './Block.css';
import { Color } from './constants';

const Block = ({color, gridX, gridY, onClick, onMouseEnter, onMouseLeave, selected}: {
    color: Color, gridX: number, gridY: number,
    onClick: (event: any) => void,
    onMouseEnter: (event: any) => void,
    onMouseLeave: (event: any) => void,
    selected?: boolean
}) =>
    <span
        {...{onClick, onMouseEnter, onMouseLeave}}
        className='Block'
        style={{backgroundColor: color, gridRowStart: gridY, gridColumnStart: gridX,
            ...(selected && {animation: 'pulsate 1.2s linear 400ms infinite', boxShadow: '0 0 0.6em lightgrey'} || {})}}
    />
export default Block