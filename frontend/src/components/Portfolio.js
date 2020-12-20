import React from 'react';
import { useDispatch } from 'react-redux';

import { grabPortfolios } from '../actions/portfolio_actions';

function Portfolio(props) {
  const dispatch = useDispatch();

  dispatch(grabPortfolios())

  return (
    <h1>HOWDY FROM PORTFOLIO</h1>
  )
}

export default Portfolio;