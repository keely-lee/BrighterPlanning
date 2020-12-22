import React, { useState } from 'react';

import '../stylesheets/portfolios.css';

function Portfolio(props) {
  const plans = props.plans;
  const tableHeaders = plans ? Object.keys(plans[0]) : null;

  // const [compare, selectCompare] = useState(false);


  return (
    <div className="plans-table-div">
      <h1>Explore Portfolio Plans</h1>

{console.log("RENDERING IN PORTFOLIO RETURN")}
      {/* some code in between */}

      { tableHeaders ? 
        <table>
          <tbody>
            <tr key="plans-row-th">
              { tableHeaders.map((col, idx) => <th key={`th-${idx}`}>{col} {idx === 0 ? "" : "%" }</th>) }
            </tr>
            
            {/* Consider better iterations, heavy runtime. Current priority accurate data. */}
            { plans.map((rowObject, idx) => {
              return (
                <tr className={`plans-row-${idx}`} 
                  key={`tr-${idx}`}
                  onClick={() => props.selectPlan(rowObject)}>
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