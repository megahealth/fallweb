import React from 'react';
import ReactECharts from 'echarts-for-react';
import moment from 'moment';

const StateChart = props => {
  const { start, end, data } = props;

  const getOption = () => {
    let list = [];
    let listRoll = [];
    data.forEach(d => {
      let n = d.states.map(a => {
        if (a[2] >= 5) {
          return [a[4], 5];
        } else {
          return [a[4], a[2]];
        }
      });
      let r = d.states.map(a => {
        if (a[2] === 3 && a[3] === 1) {
          return [a[4], 3];
        } else {
          return [a[4], null];
        }
      });
      list = list.concat(n);
      listRoll = listRoll.concat(r);
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
    listRoll.sort(function compare(a, b) {
      if (a[0] < b[0]) {
        return -1;
      }
      if (a[0] > b[0]) {
        return 1;
      }
      return 0;
    });
    // list.unshift([start, list[0][1]])
    // list.push([end, list[list.length-1][1]])

    return {
      legend: {
        data: ['目标状态', '翻身'],
        right: 0,
      },
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
          var str = '';
          switch (params[0].value[1]) {
            case 0:
              str = '无人';
              break;
            case 1:
              str = '站姿';
              break;
            case 2:
              str = '坐姿';
              break;
            case 3:
              str = '在床';
              break;
            case 4:
              str = '低姿态';
              break;
            case 5:
              str = '跌倒';
              break;
            // case 5:
            //   str = '1级跌倒';
            //   break;
            // case 6:
            //   str = '2级跌倒';
            //   break;
            // case 7:
            //   str = '3级跌倒';
            //   break;
            // case 8:
            //   str = '4级跌倒';
            //   break;
            // case 9:
            //   str = '5级跌倒';
            //   break;
            // case 10:
            //   str = '6级跌倒';
            //   break;
            // case 11:
            //   str = '7级跌倒';
            //   break;
            default:
              str = '无人';
              break;
          }
          return (
            str + '<br/>' + moment(params[0].value[0]).format('MM-DD HH:mm')
          );
        },
      },
      xAxis: {
        type: 'time',
        min: start,
        max: end,
        splitLine: {},
        axisTick: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: '#e2e9e6',
          },
        },
        axisLabel: {
          showMinLabel: true,
          showMaxLabel: true,
          formatter: function(value, index) {
            if (value === start || value === end) {
              return moment(value).format('MM-DD HH:mm');
            }
            return moment(value).format('HH:mm');
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
        type: 'value',
        splitNumber: 5,
        min: 0,
        max: 5,
        splitLine: {},
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
          formatter: function(data) {
            switch (data) {
              case 0:
                return '无人';
              case 1:
                return '站姿';
              case 2:
                return '坐姿';
              case 3:
                return '在床';
              case 4:
                return '低姿态';
              case 5:
                return '跌倒';
              // case 5:
              //   return '1级跌倒';
              // case 6:
              //   return '2级跌倒';
              // case 7:
              //   return '3级跌倒';
              // case 8:
              //   return '4级跌倒';
              // case 9:
              //   return '5级跌倒';
              // case 10:
              //   return '6级跌倒';
              // case 11:
              //   return '7级跌倒';
              default:
                return '无人';
            }
          },
        },
      },
      series: [
        {
          name: '目标状态',
          symbol: 'none',
          // smooth: true,
          type: 'line',
          step: 'end',
          data: list,
          z: 1,
        },
        {
          name: '翻身',
          type: 'scatter',
          data: listRoll,
          z: 2,
          itemStyle: {
            color: '#ffa83e',
            opacity: 1,
          },
        },
      ],
    };
  };

  return <ReactECharts option={getOption()} style={{ height: '200px' }} />;
};

export default StateChart;
