import React, { FC, useEffect, useState } from 'react';
import { connect, Dispatch } from 'umi';
import { ReportState, Loading } from '@/models/connect';
import ReactECharts from 'echarts-for-react';
import { DatePicker, Space } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;

export interface ReportProps {
  dispatch: Dispatch;
  report: ReportState;
  loading: boolean;
}

const Report: FC<ReportProps> = ({ dispatch, report, loading }) => {
  const startNum = parseInt(moment().startOf('day').format('x'));
  const endNum = parseInt(moment().endOf('day').format('x'));

  const [sn, setSn] = useState(localStorage.getItem('sn'));
  const [option, setOption] = useState();
  const [start, setStart] = useState(startNum);
  const [end, setEnd] = useState(endNum);

  const { fall, breath, running} = report;
  // console.log(report)

  useEffect(() => {
    dispatch({
      type: 'report/getReportFallData',
      payload: {
        orderby: -1,
        skip: 0,
        limit: 100,
        start,
        end,
        sn
      },
    });

    dispatch({
      type: 'report/getReportBreathData',
      payload: {
        orderby: -1,
        skip: 0,
        limit: 100,
        start,
        end,
        sn
      },
    });

    dispatch({
      type: 'report/getReportRunningData',
      payload: {
        orderby: -1,
        skip: 0,
        limit: 100,
        start,
        end,
        sn
      },
    });
  }, [start, end]);

  const getOption = (data, title) => {
    let list = [];
    data.forEach(d => {
      let n = d.states.map(a => {
        if(title=='跌倒') {
          if(a[2]<5) {
            a[2] = 0
          }else{
            a[2] = 1
          }
          return [a[4], a[2]]
        }else{
          if(title=='呼吸' && a[0]==0) {
            
          }else{
            return [a[1], a[0]]
          }
        }
      })
      // console.log(d.states)
      list = list.concat(n)
    })
    list.sort(function compare(a, b) {
      if (a[0] < b[0] ) {
        return -1;
      }
      if (a[0] > b[0] ) {
        return 1;
      }
      // a must be equal to b
      return 0;
    })

    return {
      title: {
        left: 'center',
        text: title,
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'time',
        min: start,
        max: end,
        axisLabel: {
          showMinLabel: true,
          showMaxLabel: true,
          formatter: function (value, index) {
            if(value===start || value===end) {
              return moment(value).format('MM-DD HH:mm')
            }
            return moment(value).format('HH:mm');
          }
        },
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: title,
          symbol: 'none',
          smooth: true,
          type: 'line',
          data: list
        }
      ]
    };
  }

  const onChange = (value, dateString) => {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
  }
  
  const onOk = (value) => {
    console.log('onOk: ', value);
    setStart(parseInt(value[0].format('x')));
    setEnd(parseInt(value[1].format('x')));
  }

  return (
    <div style={{background: '#fff', borderRadius: '25px', padding: '20px'}}>
      <RangePicker
        showTime={{ format: 'HH:mm' }}
        format="YYYY-MM-DD HH:mm"
        onChange={onChange}
        onOk={onOk}
        defaultValue={[moment(start), moment(end)]}
      />
      <ReactECharts option={getOption(fall, '跌倒')} />
      <ReactECharts option={getOption(breath, '呼吸')} />
      <ReactECharts option={getOption(running, '运行')} />
    </div>
  )
}

export default connect(({
  report,
  loading
}: {
  report: ReportState;
  loading: Loading
}) => ({
  report,
  loading: loading.models.report
}))(Report);