import React, { FC, useEffect, useState } from 'react';
import { connect, Dispatch } from 'umi';
import { ReportState, Loading } from '@/models/connect';
import { DatePicker, Space } from 'antd';
import moment from 'moment';
import StateChart from './stateChart';
import AlterChart from './alterChart';
import BreathChart from './breathChart';
import RunningChart from './runningChart';
import IconTitle from '@/components/iconTitle';
import 跌倒报告 from '@/assets/跌倒报告.png';
import 呼吸率报告 from '@/assets/呼吸率报告.png';
import 有人无人报告 from '@/assets/有人无人报告.png';
import 告警报告 from '@/assets/告警报告.png';
import styles from './index.less';

const { RangePicker } = DatePicker;

export interface ReportProps {
  dispatch: Dispatch;
  report: ReportState;
  loading: boolean;
  match: any;
}

const Report: FC<ReportProps> = ({ dispatch, report, loading, match }) => {
  const { sn } = match.params;

  const startNum = parseInt(moment().startOf('day').format('x'));
  const endNum = parseInt(moment().format('x'));

  const [start, setStart] = useState(startNum);
  const [end, setEnd] = useState(endNum);

  const { fall, breath, running, alter } = report;
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

    dispatch({
      type: 'report/getReportAlterData',
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

  const onChange = (value: any, dateString: any) => {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
  };

  const onOk = (value: any) => {
    console.log('onOk: ', value);
    setStart(parseInt(value[0].format('x')));
    setEnd(parseInt(value[1].format('x')));
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.range}>
        <RangePicker
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          onChange={onChange}
          onOk={onOk}
          allowClear={false}
          defaultValue={[moment(start), moment(end)]}
        />
      </div>
      <IconTitle title="目标状态" img={跌倒报告}></IconTitle>
      <div className={styles.chart}>
        <StateChart start={start} end={end} data={fall} />
      </div>
      <IconTitle title="呼吸率" img={呼吸率报告}></IconTitle>
      <div className={styles.chart}>
        <BreathChart start={start} end={end} data={breath} />
      </div>
      <IconTitle title="设备工作状态" img={有人无人报告}></IconTitle>
      <div className={styles.chart}>
        <RunningChart start={start} end={end} data={running} />
      </div>
      <IconTitle title="告警记录" img={告警报告}></IconTitle>
      <div className={styles.chart}>
        <AlterChart start={start} end={end} data={alter} />
      </div>
    </div>
  );
};

export default connect(({ report, loading }: { report: ReportState; loading: Loading }) => ({
  report,
  loading: loading.models.report,
}))(Report);
