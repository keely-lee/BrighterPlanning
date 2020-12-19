import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import Root from './components/Root';
import configureStore from './store/store.js';

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

const store = configureStore({});

ReactDOM.render(<Root store={store}/>, document.getElementById('root'));
