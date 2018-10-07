import * as React from 'react';
import './Score.css'
import { formatNumberD } from './GameAreaUtils';

const ScoreCalc = ({scoreCalc, multiplicator}: { scoreCalc: number, multiplicator: number }) =>
    <div className="PlusScore">{`+ ${formatNumberD(scoreCalc)} points! x${formatNumberD(multiplicator)}`}</div>
export default ScoreCalc