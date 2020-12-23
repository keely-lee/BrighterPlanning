import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

function UserInfo() {
  const currPlan = useSelector(state => state.entities.plans)[0];
  const headers = currPlan ? Object.keys(currPlan).filter(hdrs => hdrs !== "Risk"): [];

  // consider storing user's (valid entries) portfolio to store
  const [ userPortfolio, setUserPortfolio ] = useState({});
  const [ inputErrors, setInputErrors ] = useState({}); //modifying a set repeatedly will likely be costly

  const [ recPortfolio, setRecPortfolio ] = useState({});
  const [ recTransfers, setRecTransfers ] = useState([]);  


  // componentDidMount - set base for user's info & recommended info
  useEffect(() => {
    const stateVars = {};
    headers.forEach(ctg => {
      stateVars[ctg] = 0.0;
    })
    setUserPortfolio(stateVars);
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

      //checks for valid number entered: max two decimal places, adjust for $ sign. Use better validity checks!!
      if (entered.length > 2 || (entered.length === 2 && isNaN(entered[1])) || (entered.length === 2 && entered[1].toString().length > 2)) return setInputErrors(Object.assign({}, inputErrors, { [category]: true })) //consider using a set
      if (entered[0][0] === "$") entered[0] = entered[0].slice(1);

      // check validity: appropriate commas
      for (let i = entered[0].length-4; i > 0; i-=4) { 
        if (entered[0][i] === ",") entered[0] = entered[0].slice(0, i) + entered[0].slice(i+1); 
        else break;
      }

      if (!isNaN(entered.join("."))) {
        const newState = Object.assign({}, userPortfolio);
        newState[category] = parseFloat(entered.join("."));
        setUserPortfolio(newState);
      } 
      else {
        setInputErrors(Object.assign({}, inputErrors, { [category]: true }))
      }
    }
  }

  function confirmValid() {
    console.log(inputErrors)
    console.log(userPortfolio)
    console.log("errors, then portfolio")
    // confirm no errors, confirm at least one entry entered
    if (Object.keys(inputErrors).length || !Object.values(userPortfolio).some(ele => ele)) return false;
    else return true;
  }

  function calculate(e) {
    e.preventDefault();
    if (confirmValid()) {
      console.log("calculating")

      // PROPERLY ROUND FLOATS = Math.round((num + Number.EPSILON) * 100) / 100 

      const total = Object.values(userPortfolio).reduce((subTotal, float) => {
        if (float) return subTotal + parseFloat(float);
        else return subTotal;
      }, 0.0)

      const recPortfolio = {};
      const lessThanRec = {}; //key/value => amount needed: category      ---> none of these categories should transfer out
      const moreThanRec = {}; //key/value => amount extra: category
      const recTrans = {};
      headers.forEach(ctg => {
        recPortfolio[ctg] = Math.round(((parseInt(currPlan[ctg])/100 * total) + Number.EPSILON) * 100) / 100; //review this calculation for simplification

        console.log(parseFloat(recPortfolio[ctg]))
        console.log(parseFloat(userPortfolio[ctg]))

        console.log(`category is ${ctg}`)
        console.log(recPortfolio[ctg])
        console.log(userPortfolio[ctg])



        if (recPortfolio[ctg] === userPortfolio[ctg]) return; //no transfers needed

        if (recPortfolio[ctg] > userPortfolio[ctg]) {
          console.log("recommended is more than current"); 
          const setNumber = Math.round((recPortfolio[ctg] - userPortfolio[ctg] + Number.EPSILON) * 100) / 100;
          lessThanRec[setNumber] = ctg
          console.log(setNumber)
        } //lessThanRec[recPortfolio[ctg] - userPortfolio[ctg]] = ctg;

        else {
          console.log("recommended is less than current"); 
          const setNumber = Math.round((userPortfolio[ctg] - recPortfolio[ctg] + Number.EPSILON) * 100) / 100;
          moreThanRec[setNumber] = ctg
          console.log(setNumber);
        } //moreThanRec[userPortfolio[ctg] - recPortfolio[ctg]] = ctg;

        console.log(lessThanRec)
        console.log(moreThanRec)

        console.log(`-----`)
      })


      setRecPortfolio(recPortfolio);
      console.log(recPortfolio)
      console.log("recPortfolio")







    }
    else console.log("FULL OF ERRORS")
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
                className={`input-${ctg}`} 
              />
            </div>
          )
        }) }

        <button>Plan Bright!</button>
      </form>
      
      { Object.keys(recPortfolio).length ? (

        null 

      ) : null }


    </div>
  )
}

export default UserInfo;