import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

function UserInfo() {
  const currPlan = useSelector(state => state.entities.plans)[0];
  const headers = currPlan ? Object.keys(currPlan).filter(hdrs => hdrs !== "Risk"): [];

  // Must know num of variables in header, for hardcoding state
  const [ userPortfolio, setUserPortfolio ] = useState({});

  // componentDidMount
  useEffect(() => {
    const setStateVars = {};
    headers.forEach(ctg => {
      setStateVars[ctg] = null;
    })
  }, [])

  function updateAmount(category) {
    return e => {
      // this.set
    }
  }

  return (
    <div className="personalize-main-div">
      <h1>Personalize Your Portfolio</h1>


      <section>
        { currPlan ? (
          <div>
            <h4>Risk Level {currPlan['Risk']}</h4>
            { headers.map(ctg => {
              return (
                <div>
                  <span>{ctg}</span>
                  <span>{currPlan[ctg]}%</span>
                </div>
              )
            }) }
          </div>
        ) : <Link to="/plans">Choose a plan that's right for you!</Link> }
      </section>

      <h3>Tell us about your current portfolio: </h3>

      <form>
        { headers.map(ctg => {
          return (
            <div>
              <label htmlFor={ctg}>{ctg}</label>
              <input type="text"
                onChange={updateAmount(ctg)}
                id={ctg} 
              />
            </div>
          )
        }) }
      </form>

    </div>
  )
}

export default UserInfo;