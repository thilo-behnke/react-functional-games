import * as React from 'react';
import './Block.css';
import { Color } from './constants';

const Block = ({color, gridX, gridY, onClick, onMouseEnter, onMouseLeave}
                   : { color: Color, gridX: number, gridY: number, onClick: (event: any) => void, onMouseEnter: (event: any) => void , onMouseLeave: (event: any) => void }) =>
    <span
        {...{onClick, onMouseEnter, onMouseLeave}}
        className='Block'
        style={{backgroundColor: color, gridRowStart: gridY, gridColumnStart: gridX}}
    />
export default Block