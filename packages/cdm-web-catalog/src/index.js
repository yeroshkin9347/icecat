import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import setAsap from 'setasap';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'
import App from './App';
import * as serviceWorker from './serviceWorker';
import configureStore from './common/redux'

// https://github.com/taylorhakes/promise-polyfill
Promise._immediateFn = setAsap;

// create the store
const store = configureStore()

ReactDOM.render(<App store={ store }/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
