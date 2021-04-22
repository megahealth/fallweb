import React, { useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import moment from 'moment';
// import echarts from 'echarts';
// import ecStat from 'echarts-stat';

// echarts.registerTransform(ecStat.transform.regression);

const BreathChart = props => {
  const { start, end, data } = props;
  const chartRef = useRef(null);

  const getOption = () => {
    let list = [];
    data.forEach(d => {
      let n = d.states.map(a => {
        return [a[1], a[0]];
      });
      list = list.concat(n);
    });
    list.sort(function compare(a, b) {
      if (a[0] < b[0]) {
        return -1;
      }
      if (a[0] > b[0]) {
        return 1;
      }
      return 0;
    });
    let t = start;
    list = list.map(i => {
      return [i[0] - t, i[1]];
    });

    return {
      title: {
        left: 'center',
        text: '呼吸',
      },
      // dataset: [{
      //   source: data
      // }, {
      //   transform: {
      //     type: 'ecStat:regression',
      //     config: { method: 'polynomial', order: 3 }
      //   }
      // }],
      tooltip: {
        trigger: 'axis',
        formatter: function(params) {
          return (
            '呼吸：' +
            params[0].value[1] +
            '<br/>' +
            moment(t + params[0].value[0]).format('MM-DD HH:mm')
          );
        },
      },
      xAxis: {
        min: 0,
        max: end - start,
        splitLine: {
          lineStyle: {
            type: 'dashed',
          },
        },
        axisLabel: {
          formatter: function(value, index) {
            return moment(t + value).format('HH:mm');
          },
        },
      },
      dataZoom: [
        {
          type: 'inside',
        },
      ],
      yAxis: {
        min: 0,
        max: 50,
        splitLine: {
          lineStyle: {
            type: 'dashed',
          },
        },
      },
      series: [
        {
          name: '呼吸',
          symbolSize: 5,
          data: list,
          type: 'scatter',
        },
        // {
        //   name: 'line',
        //   type: 'line',
        //   smooth: true,
        //   datasetIndex: 1,
        //   symbolSize: 0.1,
        //   symbol: 'circle',
        //   label: { show: true, fontSize: 16 },
        //   labelLayout: { dx: -20 },
        //   encode: { label: 2, tooltip: 1 }
        // }
      ],
    };
  };

  return <ReactECharts option={getOption()} />;
};

export default BreathChart;
