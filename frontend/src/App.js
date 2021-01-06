import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Nav from './components/Navbar';
import Splash from './components/Splash.js';
import PlansMain from './components/PlansMain';
import UserCurrent from './components/UserCurrent';

import './stylesheets/mobile.css';

function App() {
  return (
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
