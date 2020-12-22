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
      type: 'pie'
    },
    title: {
      text: `Risk Plan ${data ? data['Risk'] : ""}`
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
          }
        }
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
    }
  } : null;

  return (
    // categories
    <div>
      {console.log("RAWR DONUTSSS")}
      { data ? 
        <HighchartsReact highcharts={Highcharts} options={options} />
      : null }
    </div>
  );
}

export default DonutChart;