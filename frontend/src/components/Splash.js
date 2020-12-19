import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

function splashPage(props) {

  return (
    <div>
      <h1>HELLO FROM THE SPLASH PAGE</h1>
      <Link to="/plans">Get Started</Link>
    </div>
  )
}

export default splashPage