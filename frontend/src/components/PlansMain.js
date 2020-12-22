import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import Portfolio from './Portfolio';
import DonutChart from './DonutChart';

import { grabPortfolios } from '../actions/portfolio_actions';
import { receivePlan } from '../actions/plan_actions';

function PlansMain(props) {
  const dispatch = useDispatch();
  const portfolios = useSelector(state => state.entities.portfolios.data)
  const data = useSelector(state => state.entities.plans)[0];


  useEffect(() => {
    dispatch(grabPortfolios())
  }, []) //dispatch on initial mount

  console.log("BEEP BOOP PLANS MAIN")
  console.log("--------")
  return (
    <div>
      <Portfolio plans={portfolios}/>
      <DonutChart data={data}/>

      { portfolios ? 
      <div>
        <button type="button" onClick={() => {dispatch(receivePlan(portfolios[0]))}}>  update 1  </button>
        <button type="button" onClick={() => {dispatch(receivePlan(portfolios[1]))}}>  update 2  </button>
        <button type="button" onClick={() => {dispatch(receivePlan(portfolios[2]))}}>  update 3  </button>
      </div>
      : null }

      <Link to="/personalize">Calculate</Link>
    </div>
  )
}

export default PlansMain; 
