import React, { useRef } from 'react';
import moment from 'moment';
import useEcharts from '@/components/useEcharts';

const AlterChart = (props: any) => {
  const { start, end, data, loading } = props;

  const getOption = () => {
    let list: Array<any> = [];
    data.forEach((d: any) => {
      list.push([d.timestamp, d.alert]);
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
        formatter: function (params: any) {
          var str = '';
          switch (params[0].value[1]) {
            case 0:
              str = '无警告';
              break;
            case 1:
              str = '长时未活动';
              break;
            case 2:
              str = '长时无呼吸';
              break;
            case 3:
              str = '长时无目标';
              break;
            default:
              str = '未知';
              break;
          }
          return str + '<br/>' + moment(params[0].value[0]).format('MM-DD HH:mm');
        },
      },
      xAxis: {
        type: 'time',
        min: start,
        max: end,
        axisLabel: {
          showMinLabel: true,
          showMaxLabel: true,
          formatter: function (value: any, index: number) {
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
        max: 3,
        splitNumber: 4,
        axisLabel: {
          formatter: function (data: number) {
            switch (data) {
              case 0:
                return '无警告';
              case 1:
                return '长时未活动';
              case 2:
                return '长时无呼吸';
              case 3:
                return '长时无目标';
            }
          },
        },
      },
      series: [
        {
          name: '告警情况',
          symbol: 'none',
          // smooth: true,
          type: 'line',
          step: 'end',
          data: list,
        },
      ],
    };
  };

  const chartRef = useRef(null);
  const config = getOption();
  useEcharts(chartRef, config, loading);

  return <div style={{ height: '200px' }} ref={chartRef} />;
};

export default AlterChart;
