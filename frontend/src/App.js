import logo from './logo.svg';
// import './App.css';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Nav from './components/Navbar';
import Splash from './components/Splash.js';
import PlansMain from './components/PlansMain';
import UserCurrent from './components/UserCurrent';

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

    // <Splash />

    <div>
      <Nav/>
      <Switch>
        <Route exact path="/plans" component={PlansMain}/>
        <Route exact path="/personalize" component={UserCurrent}/>
        <Route path="/" component={Splash}/>
      </Switch>
    </div>
  );
}

export default App;
