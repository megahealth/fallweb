import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Typography, Skeleton, Button } from 'antd';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import styles from './index.less';

const StagePie = props => {
  const { stages } = props;
  const duration =
    stages[0].value + stages[1].value + stages[2].value + stages[3].value;
  const remPercent = ((stages[1].value / duration) * 100).toFixed(1);
  const lightPercent = ((stages[2].value / duration) * 100).toFixed(1);
  const deepPercent = ((stages[3].value / duration) * 100).toFixed(1);
  const wakePercent = (
    100 -
    parseFloat(remPercent) -
    parseFloat(lightPercent) -
    parseFloat(deepPercent)
  ).toFixed(1);

  const getOption = () => {
    return {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        x: '45%',
        y: 'center',
        selectedMode: false,
        itemWidth: 10,
        itemHeight: 10,
        textStyle: {
          color: '#333',
          fontSize: 14,
        },
        formatter: function(name) {
          switch (name) {
            case '清醒期':
              return '清醒期: ' + stages[0].value + '分钟 ' + wakePercent + '%';
            case '眼动期':
              return '眼动期: ' + stages[1].value + '分钟 ' + remPercent + '%';
            case '浅睡期':
              return (
                '浅睡期: ' + stages[2].value + '分钟 ' + lightPercent + '%'
              );
            case '深睡期':
              return '深睡期: ' + stages[3].value + '分钟 ' + deepPercent + '%';
          }
        },
        data: ['清醒期', '眼动期', '浅睡期', '深睡期'],
      },
      series: [
        {
          name: '睡眠分期',
          type: 'pie',
          center: ['20%', '50%'],
          radius: ['40%', '80%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 5,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              // fontSize: '40',
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: stages,
        },
      ],
    };
  };

  return (
    <ReactEcharts
      option={getOption()}
      style={{ width: '350px', height: '150px' }}
    />
  );
};

export default StagePie;
