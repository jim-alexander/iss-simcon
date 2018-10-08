import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'core-js/es6/map';
import 'core-js/es6/set';
import 'raf/polyfill';
import 'core-js/es6/string';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
