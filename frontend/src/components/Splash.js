import React from 'react';
import { Link } from 'react-router-dom';

import '../stylesheets/splash.css';

function Splash() {

  return (
    <div className="splash-main-div">
      <h1>Plan a Brighter Financial Future</h1>
      <div id="splash-img"><Link to="/plans">Get Started Today</Link></div>
      {/* PUT A FOOTER */}
    </div>
  )
}

export default Splash;