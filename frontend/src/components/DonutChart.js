import React from 'react';

import Highcharts, { Point } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

function DonutChart(props) {
  const data = props.data; //Note: Object keys - 'Risk' is a key. 
  const colors = ['#555B6E', '#89B0AE', '#BEE3DB', '#FFD6BA', '#E89C87'];

  // DONUT CHART PLANS #6 //////

  const categories = data ? Object.keys(data).filter(ctg => ctg !== 'Risk') : [];

  const options = data ? {
    chart: {
      type: 'pie',
      renderTo: 'container',
    },
    title: {
      text: `Risk Plan ${data ? data['Risk'] : ""}`,
    },
    plotOptions: {
      pie: {
        // shadow: true,
        colors: colors,
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          pointFormat: '<b>{point.plan}</b><br>{point.y}%',
          distance: -50,
          filter: {
            property: 'percentage',
            operator: '>',
            value: 1
          },
        },
        size: '85%',
        center: ['50%', '40%'],
      }
    },
    // yAxis: {
    //   title: {
    //     text: 'Y-AXIS'
    //   }
    // },
    series: [
      {
        name: "Plan",
        data: categories.map(key => { return {plan: key, y: parseInt(data[key])} }),
        innerSize: '30%',
      }
    ],
    tooltip: {
      headerFormat: '<b>{point.plan}</b>',
      pointFormat: '<b>{point.percentage}%</b>'
    },
    credits: {
      enabled: false
    }
  } : null;

  return (
    // categories
    <div className="donut-chart-div">
      { data ? 
        <HighchartsReact 
          highcharts={Highcharts} 
          options={options}      
          containerProps={{style: {height: '100%',} }} // width: '50vw'} }}
        />
      : null }
    </div>
  );
}

export default DonutChart;