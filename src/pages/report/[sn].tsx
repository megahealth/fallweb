import React, { FC, useEffect, useState } from 'react';
import { connect, Dispatch } from 'umi';
import { ReportState, Loading } from '@/models/connect';
import ReactECharts from 'echarts-for-react';
import { DatePicker, Space } from 'antd';
import moment from 'moment';
import StateChart from './stateChart';
import BreathChart from './breathChart';
import RunningChart from './runningChart';

const { RangePicker } = DatePicker;

export interface ReportProps {
  dispatch: Dispatch;
  report: ReportState;
  loading: boolean;
}

const Report: FC<ReportProps> = ({ dispatch, report, loading }) => {
  const startNum = parseInt(
    moment()
      .startOf('day')
      .format('x'),
  );
  const endNum = parseInt(moment().format('x'));

  const [sn, setSn] = useState(localStorage.getItem('sn'));
  const [start, setStart] = useState(startNum);
  const [end, setEnd] = useState(endNum);

  const { fall, breath, running } = report;

  useEffect(() => {
    dispatch({
      type: 'report/getReportFallData',
      payload: {
        orderby: -1,
        skip: 0,
        limit: 100,
        start,
        end,
        sn,
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
        sn,
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
        sn,
      },
    });
  }, [start, end]);

  const onChange = (value, dateString) => {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
  };

  const onOk = value => {
    console.log('onOk: ', value);
    setStart(parseInt(value[0].format('x')));
    setEnd(parseInt(value[1].format('x')));
  };

  return (
    <div style={{ background: '#fff', borderRadius: '25px', padding: '20px' }}>
      <RangePicker
        showTime={{ format: 'HH:mm' }}
        format="YYYY-MM-DD HH:mm"
        onChange={onChange}
        onOk={onOk}
        bordered={false}
        defaultValue={[moment(start), moment(end)]}
      />
      <StateChart start={start} end={end} data={fall} />
      <BreathChart start={start} end={end} data={breath} />
      <RunningChart start={start} end={end} data={running} />
    </div>
  );
};

export default connect(
  ({ report, loading }: { report: ReportState; loading: Loading }) => ({
    report,
    loading: loading.models.report,
  }),
)(Report);
