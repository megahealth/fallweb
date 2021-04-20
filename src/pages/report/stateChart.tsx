import React, { FC, useEffect, useState } from 'react';
import { connect, Dispatch } from 'umi';
import { ReportState, Loading } from '@/models/connect';
import ReactECharts from 'echarts-for-react';
import { DatePicker, Space } from 'antd';
import moment from 'moment';

const StateChart = props => {
  const getOption = () => {
    return {
      title: {
        text: 'Step Line',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['Step Start', 'Step Middle', 'Step End'],
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '设备状态',
          type: 'line',
          step: 'end',
          data: [450, 432, 401, 454, 590, 530, 510],
        },
      ],
    };
  };

  return <ReactECharts option={getOption()} />;
};

export default StateChart;
