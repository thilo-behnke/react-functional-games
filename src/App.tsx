import * as React from 'react';
import './App.css';

import logo from './logo.svg';
import GameArea from './components/GameArea';
import Score from './components/Score';
import ScoreCalc from './components/ScoreCalc';

class App extends React.Component<{}, { score: number, scoreCalc: number }> {

    constructor(props: any) {
        super(props)
        this.state = {score: 0, scoreCalc: null}
    }

    public render() {

        const {score, scoreCalc} = this.state

        const updateScore = (score: number) => this.setState({score: score + this.state.score})
        const plusScore = (score: number) => this.setState({scoreCalc: score})

        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <div className="Main-grid">
                    <GameArea {...{updateScore, plusScore}}/>
                    <div>
                        <Score {...{score}}/>
                        {scoreCalc && <ScoreCalc {...{scoreCalc}}/>}
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
