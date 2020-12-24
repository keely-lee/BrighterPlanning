import React from 'react';

import '../stylesheets/portfolios.css';

function Portfolio(props) {
  const plans = props.plans;
  const tableHeaders = plans ? Object.keys(plans[0]) : null;


  function selectPlan(e, plan) {
    Array.from(e.currentTarget.parentNode.children).map(node => node.classList.remove("selected"))
    e.currentTarget.classList.add("selected")
    props.selectPlan(plan);
  }


  return (
    <div className="plans-table-div">
      <h1>Explore Portfolio Plans</h1>

      { tableHeaders ? 
        <table>
          <tbody>
            <tr key="plans-row-th">
              { tableHeaders.map((col, idx) => <th key={`th-${idx}`}>{col} {idx === 0 ? "" : "%" }</th>) }
            </tr>
            
            {/* Consider better iterations, heavy runtime. Current priority accurate data. */}
            { plans.map((rowObject, idx) => {
              return (
                <tr className={`plans-row-${idx} plans-row`} 
                  key={`tr-${idx}`}
                  onClick={(e) => selectPlan(e, rowObject)}>
                  { tableHeaders.map((header,subIdx) => {
                    return <td key={`td-${idx}-${subIdx}`}>{rowObject[header]}</td>
                  }) }
                </tr>
              )
            })}
          </tbody>
        </table>
      : null }
    </div>
  )
}

export default Portfolio;