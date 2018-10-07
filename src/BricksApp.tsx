import * as React from 'react';
import GameArea from './componentsBricks/GameArea';
import Score from './componentsBricks/Score';
import ScoreCalc from './componentsBricks/ScoreCalc';
import SetBridge from './componentsBricks/SetBridge';
import { FIELD_COLUMNS, FIELD_ROWS, GameField, GameMode, GameState } from './componentsBricks/constants';
import { Turns } from './componentsBricks/Turns';
import { Output } from './componentsBricks/Output';
import { Button } from './componentsBricks/Button';
import { initGameField } from './componentsBricks/GameAreaUtils';

export type AppState = {
    score: number,
    scoreCalc: number,
    multiplicator: number,
    mode: GameMode,
    bridges: number,
    turns: number,
    state: GameState,
    field: GameField
}

const initialState = {
    score: 0,
    scoreCalc: null,
    multiplicator: 0,
    mode: GameMode.NORMAL,
    bridges: 1,
    turns: 20,
    state: GameState.PLAYING,
    field: initGameField(FIELD_ROWS, FIELD_COLUMNS)
} as AppState

class BricksApp extends React.Component<{}, AppState> {

    constructor(props: any) {
        super(props)
        this.state = initialState
    }

    public render() {

        const {score, scoreCalc, multiplicator, mode, bridges, state, turns, field} = this.state

        const updateScore = (score: number) => this.setState({score: score + this.state.score})
        const plusScore = (score: number, multiplicator: number) => this.setState({scoreCalc: score, multiplicator})
        const decrementBridges = () => this.setState({bridges: bridges - 1})
        const decrementTurns = () => {
            const newTurns = turns - 1
            this.setState({turns: newTurns, state: newTurns > 0 ? this.state.state : GameState.LOST})
        }
        const updateField = (field: GameField) => {
            this.setState({field, state: field.length > 0 ? this.state.state : GameState.WON})
        }

        return (
            <div className="MainGrid">
                <div>
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                        <Output
                            text={state === GameState.PLAYING ? 'Play Bricks' : state === GameState.WON ? 'You won!' : 'Lost!'}
                            className={'GameTitle'}/>
                        {state === GameState.LOST &&
                        <Button onClick={() => this.setState(initialState)} title='Reset Game'/>}
                    </div>
                    <GameArea {...{
                        enabled: state === GameState.PLAYING,
                        field,
                        updateScore,
                        plusScore,
                        decrementBridges,
                        decrementTurns,
                        updateField,
                        mode: bridges > 0 && mode === GameMode.BRIDGE ? GameMode.BRIDGE : GameMode.NORMAL
                    }}/>
                </div>
                <div className="SideGrid">
                    <Turns {...{turns}}/>
                    <SetBridge
                        onClick={() => this.setState({mode: mode === GameMode.NORMAL ? GameMode.BRIDGE : GameMode.NORMAL})}
                        active={mode === GameMode.BRIDGE}
                        enabled={bridges > 0}
                    />
                    <div className="ScoreArea">
                        <Score {...{score}}/>
                        {scoreCalc && <ScoreCalc {...{scoreCalc, multiplicator}}/>}
                    </div>
                </div>
            </div>


        );
    }
}

export default BricksApp;
