import React from 'react';
import ReactECharts from 'echarts-for-react';
import moment from 'moment';

const BreathChart = props => {
  const { start, end, data } = props;

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
    // list.unshift([start, list[0][1]]);
    // list.push([end, list[list.length - 1][1]]);

    return {
      title: {
        left: 'center',
        text: '设备工作状态',
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(params) {
          var str = '';
          switch (params[0].value[1]) {
            case 0:
              str = '下线';
              break;
            case 1:
              str = '上线';
              break;
            default:
              str = '下线';
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
        axisLabel: {
          showMinLabel: true,
          showMaxLabel: true,
          formatter: function(value, index) {
            if (value === start || value === end) {
              return moment(value).format('MM-DD HH:mm');
            }
            return moment(value).format('HH:mm');
          },
        },
      },
      dataZoom: [
        {
          type: 'inside',
        },
      ],
      yAxis: {
        type: 'value',
        min: 0,
        max: 1,
        splitNumber: 1,
        axisLabel: {
          formatter: function(data) {
            switch (data) {
              case 0:
                return '下线';
              case 1:
                return '上线';
            }
          },
        },
      },
      series: [
        {
          name: '设备工作状态',
          symbol: 'none',
          // smooth: true,
          type: 'line',
          step: 'end',
          data: list,
        },
      ],
    };
  };

  return <ReactECharts option={getOption()} />;
};

export default BreathChart;
