import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { SelectGame } from './SelectGame';

ReactDOM.render(
    <SelectGame/>,
    document.getElementById('root') as HTMLElement
);
registerServiceWorker();
