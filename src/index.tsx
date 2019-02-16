import "./index.css";

import { Provider } from "react-redux";
import { createStore } from 'redux';
import * as React from "react";
import * as ReactDOM from "react-dom";

import { SelectGame } from "./SelectGame";
import gameApp from "./reducers";
import registerServiceWorker from "./registerServiceWorker";

/* const sagaMiddleware = createSagaMiddleware();
 *  */
const store = createStore(gameApp);

ReactDOM.render(
  <Provider store={store}>
    <SelectGame />
  </Provider>,
  document.getElementById("root") as HTMLElement
);
registerServiceWorker();
