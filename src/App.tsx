import * as React from 'react';
import './App.css';

import logo from './logo.svg';
import GameArea from './components/GameArea';

class App extends React.Component {
    public render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <div className="Main-grid">
                    <GameArea/>
                    <div>
                        // TODO: Score area
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
