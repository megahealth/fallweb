import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Typography, Skeleton, Button } from 'antd';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';

const SleepStage = props => {
  const { state, start } = props;

  const getOption = () => {
    let result = [];
    for (let i = 1, j = state && state.length; i < j; i++) {
      if (
        state[i] !== 6 &&
        state[i - 1] === 6 &&
        state[i + 1] === 6 &&
        i < j - 1
      ) {
        state[i] = 6;
      }
      if (
        state[i] === 6 &&
        state[i - 1] !== 6 &&
        state[i + 1] !== 6 &&
        i < j - 1
      ) {
        state[i] = state[i - 1];
      }
      let sleepDataResult = state[i - 1] === 0 ? 4 : 5 - state[i - 1];
      if (sleepDataResult === -1) {
        sleepDataResult = 4;
      }
      const bt = new Date(start);
      const nt = new Date(bt);
      nt.setMinutes(bt.getMinutes() + i, 0, 0);
      result.push([nt, sleepDataResult]);
    }

    const option = {
      animation: false,
      title: {
        left: 'center',
        text: '睡眠分期',
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100,
        },
      ],
      visualMap: {
        show: false,
        top: 10,
        right: 10,
        pieces: [
          {
            gt: 0,
            lte: 1,
            color: '#3b8686',
          },
          {
            gt: 1,
            lte: 2,
            color: '#79bd9a',
          },
          {
            gt: 2,
            lte: 3,
            color: '#a8dba8',
          },
          {
            gt: 3,
            lte: 4,
            color: '#cff09e',
          },
        ],
        outOfRange: {
          color: '#cff09e',
        },
      },
      tooltip: {
        trigger: 'axis',
        formatter: params => {
          let str = '';
          switch (params[0].value[1]) {
            case 1:
              str = '深睡期';
              break;
            case 2:
              str = '浅睡期';
              break;
            case 3:
              str = '眼动期';
              break;
            case 4:
              str = '清醒期';
              break;
            case null:
              str = '离床';
              break;
            default:
              break;
          }
          return `${str}<br/>${moment(params[0].value[0]).format(
            'MM-DD HH:mm',
          )}`;
        },
      },
      xAxis: {
        type: 'time',
        splitNumber: 12,
        // min: start,
        // max: sleepStageEnd,
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
          show: false,
          lineStyle: {
            color: '#efefef',
            type: 'solid',
          },
        },
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 4,
        splitLine: {
          show: true,
          lineStyle: {
            color: '#efefef',
            type: 'solid',
          },
        },
        axisLine: {
          lineStyle: {
            color: '#aaa',
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          // rotate: 45,
          formatter: v => {
            switch (v) {
              case 1:
                return '深睡';
              case 2:
                return '浅睡';
              case 3:
                return '眼动';
              case 4:
                return '清醒';
              default:
                break;
            }
          },
        },
      },
      series: {
        name: '分期曲线',
        type: 'line',
        // animation: false,
        symbol: 'none',
        // itemStyle: {
        //   normal: {
        //     color: "#333"
        //   }
        // },
        lineStyle: {
          width: 2,
        },
        // markLine: {
        //   data: leaveArr,
        //   symbol: 'pin',
        //   label: {
        //     show: false,
        //     formatter: function (params) {
        //       return dayjs(params.value).format('HH:mm离床');
        //     },
        //   },
        //   lineStyle: {
        //     color: 'red',
        //     type: 'solid'
        //   }
        // },
        // smooth: true,
        // sampling: 'average',
        data: result,
      },
    };

    return option;
  };

  return <ReactEcharts option={getOption()} style={{ height: '300px' }} />;
};

export default SleepStage;
