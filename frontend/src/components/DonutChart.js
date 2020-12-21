import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { receivePlan } from '../actions/plan_actions';

function DonutChart(props) {
  const colors = ['#555B6E', '#89B0AE', '#BEE3DB', '#FFD6BA', '#E89C87'];
  const data = useSelector(state => state.entities.plans)[0]; //Note: Object keys are 'sorted' alphabetically, 'risk' is a key. 

  //  '#EDE9E9',


  const categories = data ? Object.keys(data).filter(ctg => ctg !== 'Risk') : [];

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(receivePlan({
      'Risk': 8,
      'Bonds': 10,
      'LargeCap': 20,
      'MidCap': 40,
      'Foreign': 20,
      'SmallCap': 10,
    }))

    // dispatch(receivePlan(
    // {
    //   'Risk': 7,
    //   'Bonds': 20,
    //   'LargeCap': 25,
    //   'MidCap': 25,
    //   'Foreign': 25,
    //   'SmallCap': 5,
    // }))

  }, [])


  const options = data ? {
    chart: {
      type: 'pie'
    },
    title: {
      text: 'THIS IS THE CHART TITLE'
    },
    plotOptions: {
      pie: {
        // shadow: true,
        colors: colors,
        allowPointSelect: true,
        cursor: 'pointer',
      }
    },
    // yAxis: {
    //   title: {
    //     text: 'Y-AXIS'
    //   }
    // },
    series: [
      {
        name: "Plans",
        data: categories.map(key => [key, data[key]]),
        innerSize: '30%',
        dataLabels: {
          enabled: false
        }
      }
    ],
    tooltip: {
      
    }
  } : null;

  return (

    // categories
    <div>
      <h1>DONUT CHART</h1>
      { data ? 
      <HighchartsReact highcharts={Highcharts} options={options} />
      : null }
    </div>
  );
}

export default DonutChart;