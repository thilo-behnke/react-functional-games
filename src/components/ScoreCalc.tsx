import * as React from 'react';
import './Score.css'

const ScoreCalc = (props: { scoreCalc: number }) =>
    <div className="PlusScore">{`+ ${props.scoreCalc} points!`}</div>
export default ScoreCalc