import * as React from 'react';
import './App.css';

import logo from './logo.svg';
import GameArea from './components/GameArea';
import Score from './components/Score';
import ScoreCalc from './components/ScoreCalc';
import SetBridge from './components/SetBridge';
import { GameMode } from './components/constants';

class App extends React.Component<{}, { score: number, scoreCalc: number, mode: GameMode, bridges: number }> {

    constructor(props: any) {
        super(props)
        this.state = {score: 0, scoreCalc: null, mode: GameMode.NORMAL, bridges: 1}
    }

    public render() {

        const {score, scoreCalc, mode, bridges} = this.state

        const updateScore = (score: number) => this.setState({score: score + this.state.score})
        const plusScore = (score: number) => this.setState({scoreCalc: score})
        const decrementBridges = () => this.setState({bridges: bridges - 1})

        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <div className="Main-grid">
                    <GameArea {...{updateScore, plusScore, decrementBridges, mode: bridges > 0 && mode === GameMode.BRIDGE ? GameMode.BRIDGE : GameMode.NORMAL}}/>
                    <div>
                        <SetBridge
                            onClick={() => this.setState({mode: mode === GameMode.NORMAL ? GameMode.BRIDGE : GameMode.NORMAL})}
                            active={mode === GameMode.BRIDGE}
                            enabled={bridges > 0}
                        />
                        <Score {...{score}}/>
                        {scoreCalc && <ScoreCalc {...{scoreCalc}}/>}
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
