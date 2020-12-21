import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { grabPortfolios } from '../actions/portfolio_actions';

function Portfolio(props) {
  const dispatch = useDispatch();
  const plans = useSelector(state => state.entities.portfolios.data)

  useEffect(() => {
    dispatch(grabPortfolios());
  }, []); //dispatch on initial mount


  const tableHeaders = plans ? Object.keys(plans[0]) : null;

  return (
    <div className="plans-main-div">
      <h1>HOWDY FROM PORTFOLIO</h1>

      {/* some code in between */}

      { tableHeaders ? 
        <table>
          <tbody>
            <tr>
              { tableHeaders.map((col, idx) => <th key={`th-${idx}`}>{col} {idx === 0 ? "" : "%" }</th>) }
            </tr>
            
            {/* Consider better iterations, heavy runtime. Current priority accurate data. */}
            { plans.map((rowObject, idx) => {
              return (
                <tr className={`plans-row-${idx}`}>
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