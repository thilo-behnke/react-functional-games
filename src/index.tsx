import "./index.css";

import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import * as React from "react";
import * as ReactDOM from "react-dom";
import createSagaMiddleware from "redux-saga";

import { SelectGame } from "./SelectGame";
import gameApp from "./reducers";
import registerServiceWorker from "./registerServiceWorker";

const sagaMiddleware = createSagaMiddleware();

const store = createStore(gameApp, applyMiddleware(sagaMiddleware));

ReactDOM.render(
  <Provider store={store}>
    <SelectGame />
  </Provider>,
  document.getElementById("root") as HTMLElement
);
registerServiceWorker();
