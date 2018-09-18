import * as React from 'react';
import './Block.css';
import { Color } from './constants';

const Block = ({color, gridX, gridY, onClick, onMouseOver, onMouseLeave, selected}: {
    color: Color, gridX: number, gridY: number,
    onClick: (event: any) => void,
    onMouseOver: (event: any) => void,
    onMouseLeave: (event: any) => void,
    selected?: boolean
}) =>
    <span
        {...{onClick, onMouseOver, onMouseLeave}}
        className='Block'
        style={{backgroundColor: color, gridRowStart: gridY, gridColumnStart: gridX, ...(selected && {transform: 'scale(1.2em)'} || {})}}
    />
export default Block