import './App.css';

import * as React from 'react';

import { BreakoutApp } from './componentsBreakout/BreakoutApp';
import BricksApp from './BricksApp';
import logo from './logo.svg';

export enum Game {
    BRICKS = 'BRICKS',
    BREAKOUT = 'BREAKOUT'
}

export class SelectGame extends React.Component<{}, {selected: Game}> {
    constructor(props: any){
        super(props)
        this.state = {selected: Game.BRICKS}
    }

    render(){
        console.log(this.state)
        return <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <h1 className="App-title">Welcome to React</h1>
            </header>
            {
                this.state.selected === Game.BRICKS && <BricksApp/>
                || this.state.selected === Game.BREAKOUT && <BreakoutApp/>
            }
        </div>
    }
}
