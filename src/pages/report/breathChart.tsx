import React, { useRef } from 'react';
import moment from 'moment';
import useEcharts from '@/components/useEcharts';

const BreathChart = props => {
  const { start, end, data, loading } = props;

  const getOption = () => {
    let list = [];
    data.forEach(d => {
      let n = d.states.map(a => {
        let b = a[0] || null;
        return [a[1], b];
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
      grid: {
        left: '2%',
        right: '5%',
        bottom: '5%',
        top: '14%',
        containLabel: true,
      },
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
          // lineStyle: {
          //   type: 'dashed',
          // },
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: '#e2e9e6',
          },
        },
        axisLabel: {
          formatter: function(value, index) {
            return moment(t + value).format('HH:mm');
          },
          color: '#666',
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
          // lineStyle: {
          //   type: 'dashed',
          // },
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: '#e2e9e6',
          },
        },
        axisLabel: {
          color: '#666',
        },
      },
      series: [
        {
          name: '呼吸',
          symbol: 'none',
          // symbolSize: 5,
          smooth: true,
          data: list,
          type: 'line',
          lineStyle: {
            color: '#fadd46',
          },
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

  const chartRef = useRef(null);
  const config = getOption();
  useEcharts(chartRef, config, loading);

  return <div style={{ height: '200px' }} ref={chartRef} />;
};

export default BreathChart;
