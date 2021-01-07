import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import Portfolio from './Portfolio';
import DonutChart from './DonutChart';

import { grabPortfolios } from '../actions/portfolio_actions';
import { receivePlan } from '../actions/plan_actions';

import '../stylesheets/plansMain.css';

function PlansMain(props) {
  const dispatch = useDispatch();
  const portfolios = useSelector(state => state.entities.portfolios.data)
  const data = useSelector(state => state.entities.plans);

  const donutPresent = data.length === 1 ? "plans-split" : "";

  useEffect(() => {
    dispatch(grabPortfolios())
    // const donut = document.getElementsByClassName('donut-chart-div')[0].highcharts();
    // donut.reflow();
  }, []) //dispatch on initial mount

  return (
    <div className="plans-main-div">
      <div className="label-header">
        <span>Select A Risk Plan</span>
        { data.length ? <Link to="/personalize">Calculate</Link> : null }
      </div>
      <div className={`plans-main-base ${donutPresent}`}>
        <Portfolio 
          plans={portfolios} 
          chosenPlans={data}
          selectPlan={(plan) => { dispatch(receivePlan(plan)) }}
          // eventually add dispatch multiple plans
        />

        {/* eventually some button for compare options */}
      </div>
      <div className="plans-main-charts">
        { data.length === 1 ? <DonutChart data={data[0]}/> : null }
      </div>
    </div>
  )
}

export default PlansMain; 
