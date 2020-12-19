import logo from './logo.svg';
// import './App.css';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Splash from './components/Splash.js';
import Portfolio from './components/Portfolio.js';


function App() {
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>



    <BrowserRouter>
      <div>
        <Switch>
          <Route/>
          <Route path="/" component={Splash}/>
          {/* <Route exact path="/plans" component={Portfolio}/> */}
          {/* <Route exact path="/calculate" component={}/> */}
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
