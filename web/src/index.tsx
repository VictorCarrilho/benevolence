import 'core-js/es/map'; // <-- added this line after installed packages
import 'core-js/es/set'; // <-- added this line after installed packages


import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);