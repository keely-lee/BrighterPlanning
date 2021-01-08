import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import '../stylesheets/userCurrent.css';

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

      //checks for valid number entered: max two decimal places, adjust for $ sign. Use better validity checks!!  //if length of decimal is more than 2, must be === 0 or parseFloat will make length less than 2 (meaning 0s only after 2nd decimal)
      if (entered.length > 2 || (entered.length === 2 && isNaN(entered[1])) || (entered.length === 2 && entered[1].length > 2)) return setInputErrors(Object.assign({}, inputErrors, { [category]: true })) //consider using a set
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
    // confirm no errors, confirm at least one entry entered
    // debugger
    if (Object.keys(inputErrors).length || !Object.values(userPortfolio).some(ele => ele)) return false;
    else return true;
  }

  // insertionSort (quicker sort for small sized array)
  function _insertionSort (inputArr) {
    let length = inputArr.length;
    for (let i = 1; i < length; i++) {
      let key = inputArr[i];
      let j = i-1;
      while (j >= 0 && inputArr[j] > key) {
        inputArr[j+1] = inputArr[j];
        j = j-1;
      }
      inputArr[j+1] = key;
    }
    return inputArr;
  }

  //find subset of sums
  let sums = {}; //key:val => {length of smallest combo: array of subarray sums} 
  function _subsetSum(arr, target, partial = [], sum = 0, fixIdx = 0) { 
    if (sum < target) {
      arr.forEach((num, i) => {
        _subsetSum(arr.slice(i + 1), target, partial.concat([i + fixIdx]), sum + num, i+1)
      })
    }
    else if (sum === target) {
      fixIdx = 0;
      if (sums[partial.length]) sums[partial.length].push(partial);
      else sums[partial.length] = [partial];
    }
    else fixIdx = 0;
  }

  //returns matching index or index of last element less than target
  function _modBSearch(arr, target) {
    if (target < arr[0]) return -1; //used to avoid split transfers until necessary
    if (target > arr[arr.length-1]) return arr.length-1;

    let mid;
    let left = 0;
    let right = arr.length;
    
    while (left < right) {
      mid = Math.floor((left + right)/2);
      if (arr[mid] === target) return mid;
      if (arr[mid] < target) left = mid+1;
      else right = mid;
    }

    return -1;  //temporary fix until modbsearch fixed. target not in array
    // return mid;
  } 

  // FIX THIS LATER TO A BETTER SEARCH
  function _findLargestNeg(arr) {
    let left = 0;
    let right = arr.length-1;
    let mid;

    while (left < right) {
      mid = Math.floor((left + right)/2);

      if (arr[mid] < 0 && arr[mid+1] > 0) return mid;
      if (arr[mid] > 0) right = mid;
      else if (arr[mid] < 0 && arr[mid+1] < 0) left = mid;
    }
  }

    // const permutator = (inputArr) => {
    //   let result = [];

    //   const permute = (arr, m = []) => {
    //     if (arr.length === 0) {
    //       result.push(m)
    //     } else {
    //       for (let i = 0; i < arr.length; i++) {
    //         let curr = arr.slice();
    //         let next = curr.splice(i, 1);
    //         permute(curr.slice(), m.concat(next))
    //       }
    //     }
    //   }

    //   permute(inputArr)
    //   return result;
    // }


  function calculate(e) {
    e.preventDefault();
    if (confirmValid()) {
      // Research accounting concepts

      //Establish recommended portfolio based on user input
      const total = Object.values(userPortfolio).reduce((subTotal, float) => {
        if (float) return subTotal + parseFloat(float);
        else return subTotal;
      }, 0.0)

      const makeRecPortfolio = {};
      const recTrans = []; //Array of subarrays. 
        //First element of subarray = amount needed from fund(s); if int, matching subset of excess accounts; if array, partial transfers needed. 
        //Second element of subarray = excess amts; if int, matching subset of below value accts; if array, partial transfers needed.

      // variables to be used for referencing which categories transfers will come from
      const lessThanRec = {}; //key/value => amount needed: category      ---> none of these categories should transfer out
      const moreThanRec = {}; //key/value => amount extra: category

      let offAmounts = []; //To be sorted array of all amounts needed and excess
      let largestNeg; //To be largest negative value (for quicker slicing & stop points)

      // Determine "offAmounts". Set values to amounts short/in excess and log accounts
      headers.forEach(ctg => {
        makeRecPortfolio[ctg] = Math.round(((parseInt(currPlan[ctg])/100 * total) + Number.EPSILON) * 100) / 100; //review this calculation for simplification
        if (makeRecPortfolio[ctg] === userPortfolio[ctg]) return; //no transfers needed

        if (makeRecPortfolio[ctg] > userPortfolio[ctg]) {
          const setNumber = Math.round((makeRecPortfolio[ctg] - userPortfolio[ctg] + Number.EPSILON) * 100) / 100;
          if (lessThanRec[setNumber]) lessThanRec[setNumber].push(ctg);
          else lessThanRec[setNumber] = [ctg];
          offAmounts.push(setNumber * -1); 
        }
        else {
          const setNumber = Math.round((userPortfolio[ctg] - makeRecPortfolio[ctg] + Number.EPSILON) * 100) / 100;
          if (moreThanRec[setNumber]) moreThanRec[setNumber].push(ctg);
          else moreThanRec[setNumber] = [ctg];
          offAmounts.push(setNumber);
        }
      })
      setRecPortfolio(makeRecPortfolio);

      if (!Object.keys(moreThanRec).length) return setRecTransfers(["No transfers needed, your portfolio is optimal!"]); //no transfers needed - portfolio matches recommended plan

      _insertionSort(offAmounts); //sort off amounts
      largestNeg = _findLargestNeg(offAmounts); //initial declaration of largest negative
      // largestNeg = _modBSearch(offAmounts, 0); //initial declaration of largest negative

      let posOffAmounts = offAmounts.slice(largestNeg+1); //avoid constant slicing if unnecessary
      let negOffAmounts = offAmounts.slice(0, largestNeg+1);
      
      // first grab any matching differences
      for (let i = 0; i <= largestNeg; i++) {
        const current = Math.abs(offAmounts[i]);
        const matchIndex = _modBSearch(posOffAmounts, current) + largestNeg + 1;

        //NEED TO FIX MODBSEARCH
        if (i === matchIndex) continue;

        if (current === offAmounts[matchIndex]) {
          recTrans.push([current, offAmounts[matchIndex]]);
          offAmounts = offAmounts.slice(0, i).concat(offAmounts.slice(i+1, matchIndex)).concat(offAmounts.slice(matchIndex+1)); //adjust for element being removed
          largestNeg = largestNeg - 1; 
          negOffAmounts = offAmounts.slice(0, largestNeg+1);
          posOffAmounts = offAmounts.slice(largestNeg+1)
          i--; 
        }
      }

      // next grab any owed combo with singular excess
      let firstIteration = true;
      while ((Object.keys(sums).length || firstIteration) && offAmounts.length > 0) {
        firstIteration = false;

        //if one lessThan acct or one moreThan acct
        if (posOffAmounts.length === 1 || negOffAmounts.length === 1) {
            if (negOffAmounts.length === 1) {
              recTrans.push([Math.abs(negOffAmounts[0]), posOffAmounts]);
              break;
            } else {
              recTrans.push([negOffAmounts.map(amt => Math.abs(amt)), posOffAmounts[0]]);
              break;
            }
        }


        let bestNum = negOffAmounts.length;
        let bestRec = [];
        let bestExcessIdx = offAmounts.length-1;
        let bestIndices = []; //for slicing

        for (let i = offAmounts.length-1; i > largestNeg; i--) {
          sums = {}; //reassign sums for each iteration

          _subsetSum(negOffAmounts, offAmounts[i] * -1);

          let cost = parseInt(Object.keys(sums)[0]);
          if (bestNum > cost) {
            bestNum = cost;
            bestExcessIdx = i;
            bestIndices = sums[cost].pop(); 
          }
        }

        // confirmed, best group is the best of this iteration
        if (Object.keys(sums).length) { 
          for (let i = bestIndices.length-1; i >= 0; i--) {
            bestRec.push(offAmounts[i]);
            offAmounts = offAmounts.slice(0, i+1).concat(offAmounts.slice(i+1));
          }

          bestExcessIdx -= bestIndices.length; //adjust for sliced negs
          recTrans.push([bestRec, offAmounts[bestExcessIdx]]); //can sum for offAmounts[bestExcessIdx], but use index for QA
          offAmounts = offAmounts.slice(0, bestExcessIdx).concat(offAmounts.slice(bestExcessIdx+1));
          largestNeg = largestNeg - bestIndices.length;
          posOffAmounts = offAmounts.slice(largestNeg+1);
          negOffAmounts = offAmounts.slice(0, largestNeg+1);
        }
      } //ends single excess / owed subsetsum combos


      // max amount of excess combos will be limited to number of risk types (ie five)
      let bestExcessCombos = 2; // bestExcessCombos++ each iteration until reaching posOffAmounts.length
      // permutations of sums (which sum of excess === sum of lessThan)
      while (bestExcessCombos < posOffAmounts.length) { // <=

        // for (let i = 1)
        // bestExcessCombos++;
      }
      




      //transfer to text values
      let recommendText = [];
      recTrans.forEach(subArr => {
        let owed = subArr[0];
        let excess = subArr[1];
        if (!(owed instanceof Array) && !(excess instanceof Array)) {
          recommendText.push(`Transfer $${owed} from ${moreThanRec[excess].pop()} to ${lessThanRec[owed].pop()}.`)
        }
        else if (owed instanceof Array && !(excess instanceof Array)) {
          const singleAcct = moreThanRec[excess].pop();
          owed.forEach(oweAmt => {
            recommendText.push(`Transfer $${oweAmt} from ${singleAcct} to ${lessThanRec[oweAmt].pop()}.`);
          })
        }
        else if (!(owed instanceof Array) && excess instanceof Array) {
          const singleAcct = lessThanRec[owed].pop();
          excess.forEach(excessAmt => {
            recommendText.push(`Transfer $${excessAmt} from ${moreThanRec[excessAmt].pop()} to ${singleAcct}.`);
          })
        }
        else { //both arrays 

        }
      })

      setRecTransfers(recommendText);

    }
    else console.log("Review Errors")
  }

  return (
    
    <div className="personalize-main-div">
      <div className="user-img"></div>

      <h1>Personalize Your Portfolio</h1>

      <div className="personalize-div-wrapper">
        <div className="personalize-right">
          <section className="risk-section">
            { currPlan ? (
              <div>
                <h4 id="risk-section-header">Risk Level {currPlan['Risk']}</h4>
                { headers.map(ctg => (
                  <div key={ctg}>
                    <span>{ctg}</span>
                    <span>{currPlan[ctg]}%</span>
                  </div>
                )) }
              </div>
            ) : <Link to="/plans">Choose a plan that's right for you!</Link> }
          </section>

          { recTransfers.length ? (
            <div className="recommended-trans-div">
              <h3>Recommended Transfers: </h3>
              { recTransfers.map((text, idx) => (
                  <p key={`text-${idx}`}>- {text}</p>
              ))}
            </div>
          ) : null }
        </div>

        <div className="personalize-left">
          <div className="personalize-risk-section">
            <h3>Tell us about your current portfolio: </h3>
            <form onSubmit={calculate}>
              { headers.map(ctg => {
                let recDiff;
                let color; 
                let arrow; 
                if (Object.keys(recPortfolio).length) {
                  recDiff = (recPortfolio[ctg] - userPortfolio[ctg]) ? recPortfolio[ctg] - userPortfolio[ctg] : null;
                  color = recDiff > 0 ? "green" : "red";
                  arrow = recDiff > 0 ? <i className="fas fa-arrow-up"></i> : <i className="fas fa-arrow-down"></i>;
                }
                return (
                  <div key={ctg} className={`${ctg}-div personalize-input-div`}>
                    <label htmlFor={ctg}>{ctg}</label>
                    <input type="text"
                      onChange={updateAmount(ctg)}
                      value={userPortfolio[ctg] ? userPortfolio[ctg] : ""}
                    />
                    { recDiff || recDiff === 0 ? <span className={`rec-${color}`}>{arrow} $ {Math.abs(recDiff).toFixed(2)}</span> : null }
                  </div>
                )
              }) }

              <button>Calculate My Plan!</button>
            </form>
            
          </div>
          { Object.keys(recPortfolio).length ? (

            <div className="recommended-plan-div">
              <h3>Recommended Plan</h3>
              {headers.map((ctg, idx) => {
                return (
                  <div key={`${ctg}-${idx}`}>
                    <span>{ctg}:</span>
                    <span>$ {recPortfolio[ctg]}</span>
                  </div>
                )
              })}
            </div>

          ) : null }

        </div>
      </div>

    </div>
  )
}

export default UserInfo;