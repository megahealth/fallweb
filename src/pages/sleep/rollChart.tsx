import React from 'react';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';

const Roll = props => {
  const { roll, start } = props;

  const getOption = () => {
    const oneStep = 60 * 1000;
    const arr = [];
    for (let i = 0; i < roll.length; i++) {
      let now = start + oneStep * i;
      arr.push([now, roll[i]]);
    }

    return {
      title: {
        left: 'center',
        text: '翻身',
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(params) {
          var str = '';
          switch (params[0].value[1]) {
            case 0:
              str = '未翻身';
              break;
            case 1:
              str = '翻身';
              break;
            default:
              str = '未翻身';
              break;
          }
          return (
            str + '<br/>' + moment(params[0].value[0]).format('MM-DD HH:mm')
          );
        },
      },
      xAxis: {
        type: 'time',
        axisLabel: {
          showMinLabel: true,
          showMaxLabel: true,
          formatter: function(value, index) {
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
                return '未翻身';
              case 1:
                return '翻身';
            }
          },
        },
      },
      series: [
        {
          name: '翻身',
          symbol: 'none',
          // smooth: true,
          type: 'line',
          step: 'end',
          data: arr,
        },
      ],
    };
  };

  return <ReactEcharts option={getOption()} style={{ height: '300px' }} />;
};

export default Roll;
