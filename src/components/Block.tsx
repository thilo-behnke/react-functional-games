import * as React from 'react';
import './Block.css';
import { Color } from './constants';

const Block = ({color, gridX, gridY, onClick}: {color: Color, gridX: number, gridY: number, onClick: (event: any) => void}) =>
    <span
        onClick={onClick}
        className='Block'
        style={{backgroundColor: color, gridRowStart: gridY, gridColumnStart: gridX}}
    />
export default Block