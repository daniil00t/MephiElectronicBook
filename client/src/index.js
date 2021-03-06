import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
// import $ from 'jquery';
import { Button } from 'react-bootstrap';

// import '../public/media/libs/bootstrap/css/bootstrap.min.css';
// import '../public/media/styles/auth.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
