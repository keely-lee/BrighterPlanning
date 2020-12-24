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
    if (Object.keys(inputErrors).length || !Object.values(userPortfolio).some(ele => ele)) return false;
    else return true;
  }

  function calculate(e) {
    e.preventDefault();
    if (confirmValid()) {
      // Research accounting concepts

      const total = Object.values(userPortfolio).reduce((subTotal, float) => {
        if (float) return subTotal + parseFloat(float);
        else return subTotal;
      }, 0.0)

      const recPortfolio = {};
      const recTrans = []; //Array of subarrays. 
        //First element of subarray = amount needed from fund(s); if int, matching subset of excess accounts; if array, partial transfers needed. 
        //Second element of subarray = excess amts; if int, matching subset of below value accts; if array, partial transfers needed.

      // variables to be used for referencing which categories transfers will come from
      const lessThanRec = {}; //key/value => amount needed: category      ---> none of these categories should transfer out
      const moreThanRec = {}; //key/value => amount extra: category

      let offAmounts = []; //To be sorted array of all amounts needed and excess
      let largestNeg; //To be largest negative value (for quicker slicing & stop points)

      headers.forEach(ctg => {
        recPortfolio[ctg] = Math.round(((parseInt(currPlan[ctg])/100 * total) + Number.EPSILON) * 100) / 100; //review this calculation for simplification
        if (recPortfolio[ctg] === userPortfolio[ctg]) return; //no transfers needed

        if (recPortfolio[ctg] > userPortfolio[ctg]) {
          const setNumber = Math.round((recPortfolio[ctg] - userPortfolio[ctg] + Number.EPSILON) * 100) / 100;
          if (lessThanRec[setNumber]) lessThanRec[setNumber].push(ctg);
          else lessThanRec[setNumber] = [ctg];

          offAmounts.push(setNumber * -1); 
        }

        else {
          const setNumber = Math.round((userPortfolio[ctg] - recPortfolio[ctg] + Number.EPSILON) * 100) / 100;
          if (moreThanRec[setNumber]) moreThanRec[setNumber].push(ctg);
          else moreThanRec[setNumber] = [ctg];

          offAmounts.push(setNumber);
        }

      })
      console.log(lessThanRec)
      console.log(moreThanRec)
      console.log(`less, more`)

      setRecPortfolio(recPortfolio);

      if (!Object.keys(moreThanRec).length) return; //no transfers needed - portfolio matches recommended plan


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
          if (arr[mid] > target) right = mid;
          else left = mid+1;
        }

        return mid;
      } 

      _insertionSort(offAmounts); //sort off amounts
      largestNeg = _modBSearch(offAmounts, 0); //initial declaration of largest negative

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


      // offAmounts = [-30, -15, -15, -5, 5, 10, 15, 15, 20]
      // largestNeg = _modBSearch(offAmounts,0)

      let posOffAmounts = offAmounts.slice(largestNeg+1); //avoid constant slicing if unnecessary
      let negOffAmounts = offAmounts.slice(0, largestNeg+1);
      
      // first grab any matching differences
      for (let i = 0; i <= largestNeg; i++) {
        const current = Math.abs(offAmounts[i]);
        const matchIndex = _modBSearch(posOffAmounts, current) + largestNeg + 1;
        if (current === offAmounts[matchIndex]) {
          recTrans.push([current, offAmounts[matchIndex]]);
          offAmounts = offAmounts.slice(0, i).concat(offAmounts.slice(i+1, matchIndex)).concat(offAmounts.slice(matchIndex+1)); 
          //adjust for element being removed
          largestNeg = largestNeg - 1; 
          posOffAmounts = offAmounts.slice(largestNeg+1)
          i--; 
        }
      }

      // next grab any owed combo with singular excess
      let firstIteration = true;
      while ((Object.keys(sums).length || firstIteration) && Object.keys(offAmounts).length) {
        firstIteration = false;

        let bestNum = posOffAmounts.length;
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
        for (let i = bestIndices.length-1; i >= 0; i--) {
          bestRec.push(offAmounts[i]);
          offAmounts = offAmounts.slice(0, i+1).concat(offAmounts.slice(i+1));
        }

        debugger
        bestExcessIdx -= bestIndices.length; //adjust for sliced negs
        recTrans.push([bestRec, offAmounts[bestExcessIdx]]); //can sum for offAmounts[bestExcessIdx], but use index for QA
        offAmounts = offAmounts.slice(0, bestExcessIdx).concat(offAmounts.slice(bestExcessIdx+1));
        largestNeg = largestNeg - bestIndices.length;
        posOffAmounts = offAmounts.slice(largestNeg+1);
        negOffAmounts = offAmounts.slice(0, largestNeg+1);
        debugger
      }





      // let smallestNumTrans = 0;
      // let smallestIndex;
      // let amountS = {}; 

      // //Find all matching lessThan/moreThan amounts & lessThan/(combined moreThan) amounts
      // while (tooLittle.length && smallestNumTrans >= 0) {
      //   for (let i = tooLittle.length-1; i >= 0; i--) {
      //     const startIdx = _modBSearch(tooMuch, tooLittle[i]);
      //     console.log("IN SIDE THE FOR LOOPS")

      //     if (startIdx === -1) return smallestNumTrans = -1; //all the lesser than amounts are smaller than the smallest larger than. split transactions needed
      //     else { 
      //       if (tooMuch[startIdx] === tooLittle[i]) { //first round, optimal, least amount of transfers (matching amounts)
      //         smallestNumTrans = 1;
      //         recTrans.push({[tooLittle[i]]: [tooMuch[startIdx]]})
      //         tooLittle = tooLittle.slice(0, i).concat(tooLittle.slice(i+1));
      //         tooMuch = tooMuch.slice(0, startIdx).concat(tooMuch.slice(startIdx+1));
      //       }
      //       else {
      //         sums = {}; //reset sums after each iteration
      //         subsetSum(tooMuch.slice(0, startIdx+1), tooLittle[i]);
      //         if (!Object.keys(sums).length) continue; //no subsetSums for this tooLittle amount

      //         const numTrans = parseInt(Object.keys(sums)[0]);
              
      //         if (numTrans < smallestNumTrans || !smallestNumTrans) {
      //           // debugger
      //           smallestNumTrans = numTrans;
      //           smallestIndex = i;
      //           amountS[tooLittle[i]] = sums[Object.keys(sums)[0]].pop();
      //         }
      //       }
      //     }
      //   }

      //   if (!Object.keys(sums)) return;

      //   if (smallestNumTrans > 1) {
      //     const tempRec = { [tooLittle[smallestIndex]] : [] };
      //     while (Object.values(amountS)[0].length) {
      //       const lastVals = Object.values(amountS)[0].pop();
      //       tempRec[tooLittle[smallestIndex]].push(tooMuch[lastVals])
      //       tooMuch = tooMuch.slice(0, lastVals).concat(lastVals+1);
      //     }
      //     recTrans.push(tempRec);
      //     tooLittle = tooLittle.slice(0, smallestIndex).concat(tooLittle.slice(smallestIndex+1));
      //   }

      //   smallestNumTrans = 0;
      // }




      // check if any numbers add up to amount needed 
      // insertion sort both Object.keys(more & less than). then use the larger of the "lessThan" to find the moreThan best routes that add up


      //consider approaching target by helper function that calculates least number of iterations to get there plus least number of extra elements used
      // debugger
      // console.log(recTrans);
      // console.log("recTrans");


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