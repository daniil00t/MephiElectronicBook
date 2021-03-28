import React from 'react';
import ReactDOM from 'react-dom';
import { Provider} from 'react-redux'
import { createStore } from 'redux'
import reducers from './redux/reducers'

import './styles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const store = createStore(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
