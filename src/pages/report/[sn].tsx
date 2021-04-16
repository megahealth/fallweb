import React, { FC, useEffect, useState } from 'react';
import { connect, Dispatch } from 'umi';
import { ReportState, Loading } from '@/models/connect';
import ReactECharts from 'echarts-for-react';

export interface ReportProps {
  dispatch: Dispatch;
  report: ReportState;
  loading: boolean;
}

const Report: FC<ReportProps> = ({ dispatch, report, loading }) => {

  const [sn, setSn] = useState(localStorage.getItem('sn'));
  const [option, setOption] = useState();

  const { fall, breath, running} = report;
  // console.log(report)

  useEffect(() => {
    dispatch({
      type: 'report/getReportFallData',
      payload: {
        orderby: -1,
        skip: 0,
        limit: 100,
        start: 0,
        end: new Date().getTime(),
        sn
      },
    });

    dispatch({
      type: 'report/getReportBreathData',
      payload: {
        orderby: -1,
        skip: 0,
        limit: 100,
        start: 0,
        end: new Date().getTime(),
        sn
      },
    });

    dispatch({
      type: 'report/getReportRunningData',
      payload: {
        orderby: -1,
        skip: 0,
        limit: 100,
        start: 0,
        end: new Date().getTime(),
        sn
      },
    });
  }, []);

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
    console.log(list)

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
        boundaryGap: false
      },
      yAxis: {
        type: 'value'
      },
      dataZoom: [{
        type: 'inside',
        start: 0,
        end: 100
    }, {
        start: 0,
        end: 100
    }],
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

  return (
    <div style={{background: '#fff', borderRadius: '25px', padding: '20px'}}>
      <ReactECharts option={getOption(fall, '跌倒')} />
      <ReactECharts option={getOption(breath, '呼吸')} />
      <ReactECharts option={getOption(running, '运动')} />
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