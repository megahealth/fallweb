import React from 'react';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';

const BodyMove = props => {
  const { move, start } = props;

  const getOption = () => {
    const oneStep = 60 * 1000;
    const arr = [];

    if (move.length > 0) {
      for (let i = 0; i < move.length; i++) {
        let now = start + oneStep * i;
        arr.push([now, move[i]]);
      }

      const option = {
        animation: false,
        tooltip: {
          trigger: 'axis',
          formatter: function(value) {
            let item = value[0] && value[0].data[1];
            let t = moment(value[0] && value[0].data[0]).format('MM-DD HH:mm');
            let str = '';
            str += '体动: ' + (item > 0 ? item : '未检出') + '<br />';
            str += t;
            return str;
          },
        },
        title: {
          left: 'center',
          text: '体动',
        },
        xAxis: {
          type: 'time',
          splitNumber: 12,
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#aaa',
            },
          },
          axisLabel: {
            showMinLabel: true,
            showMaxLabel: true,
            formatter: (value, index) => moment(value).format('HH:mm'),
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#efefef',
              type: 'solid',
            },
          },
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100,
          },
        ],
        yAxis: {
          name: '体动',
          type: 'value',
          boundaryGap: [0, '100%'],
          axisLine: {
            lineStyle: {
              color: '#aaa',
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#efefef',
              type: 'solid',
            },
          },
        },
        series: [
          {
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            lineStyle: {
              width: 1,
            },
            itemStyle: {
              normal: {
                color: '#79bd9a',
              },
            },
            // markPoint: {
            //   data: [
            //     {type: 'max', name: '最大值'},
            //     {type: 'min', name: '最小值', symbolRotate: '180'}
            //   ]
            // },
            data: arr,
          },
        ],
      };

      return option;
    } else {
      return {};
    }
  };

  return <ReactEcharts option={getOption()} style={{ height: '300px' }} />;
};

export default BodyMove;
