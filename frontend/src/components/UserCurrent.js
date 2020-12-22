import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

function UserInfo() {
  const currPlan = useSelector(state => state.entities.plans)[0];
  const headers = currPlan ? Object.keys(currPlan).filter(hdrs => hdrs !== "Risk"): [];

  const [ userPortfolio, setUserPortfolio ] = useState({});
  const [ inputErrors, setInputErrors ] = useState({}); //modifying a set repeatedly will likely be costly

  // componentDidMount
  useEffect(() => {
    const stateVars = {};
    headers.forEach(ctg => {
      stateVars[ctg]= null;
    })
    setUserPortfolio(stateVars)
  }, [])

  function updateAmount(category) {
    return e => {
      //figure out regex solution if you have time
      // const entered = e.currentTarget.value.replace(/,/g, ""); 
      let entered = e.currentTarget.value.split(".");

      //when potentially fixing error, clear the error
      if ( inputErrors[category] ) {
        const tempErrors = Object.assign({}, inputErrors);
        delete tempErrors[category];
        setInputErrors(tempErrors);
      }

      //checks for valid number entered: max two decimal places, adjust for $ sign
      if (entered.length > 2 || (entered.length === 2 && isNaN(entered[1]))) return setInputErrors(Object.assign({}, inputErrors, { [category]: true })) //consider using a set
      if (entered[0][0] === "$") entered[0] = entered[0].slice(1);

      // check validity: appropriate commas
      for (let i = entered[0].length-4; i > 0; i-=4) { 
        if (entered[0][i] === ",") entered[0] = entered[0].slice(0, i) + entered[0].slice(i+1); 
        else break;
      }

      if (!isNaN(entered.join("."))) {
        const newState = Object.assign({}, userPortfolio);
        newState[category] = entered.join(".");
        setUserPortfolio(newState);
      } 
      else {
        setInputErrors(Object.assign({}, inputErrors, { category: true }))
      }
    }
  }

  function confirmValid() {
    console.log(inputErrors)
    console.log(userPortfolio)
    console.log("errors, then portfolio")
    // if (Object.values(userPortfolio).some(ele => )   )
    return true;
  }

  function calculate(e) {
    e.preventDefault();
    if (confirmValid()) {
      console.log("calculating")
    }
  }

  return (
    <div className="personalize-main-div">
      <h1>Personalize Your Portfolio</h1>


      <section>
        { currPlan ? (
          <div>
            <h4>Risk Level {currPlan['Risk']}</h4>
            { headers.map(ctg => (
              <div key={ctg}>
                <span>{ctg}</span>
                <span>{currPlan[ctg]}%</span>
              </div>
            )) }
          </div>
        ) : <Link to="/plans">Choose a plan that's right for you!</Link> }
      </section>

      <h3>Tell us about your current portfolio: </h3>

      <form onSubmit={calculate}>
        { headers.map(ctg => {
          return (
            <div key={ctg}>
              <label htmlFor={ctg}>{ctg}</label>
              <input type="text"
                onChange={updateAmount(ctg)}
                id={ctg} 
              />
            </div>
          )
        }) }

        <button>Plan Bright!</button>
      </form>

    </div>
  )
}

export default UserInfo;