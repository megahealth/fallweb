import React, { FC, useEffect, useState } from 'react';
import { connect, Dispatch, Link } from 'umi';
import { ReportState, Loading } from '@/models/connect';
import moment from 'moment';
import StateChart from './stateChart';
import BreathChart from './breathChart';
import RunningChart from './runningChart';
import IconTitle from '@/components/iconTitle';
import 跌倒报告 from '@/assets/跌倒报告.png';
import 呼吸率报告 from '@/assets/呼吸率报告.png';
import 有人无人报告 from '@/assets/有人无人报告.png';
import 二级页面 from '@/assets/二级页面.png';
import styles from './index.less';

export interface ReportProps {
  dispatch: Dispatch;
  report: ReportState;
  loading: boolean;
  state: number;
  sn: string;
}

const BriefReport: FC<ReportProps> = ({
  dispatch,
  report,
  loading,
  state,
  sn,
}) => {
  // console.log(state);

  const { fall, breath, running } = report;
  const start = parseInt(
    moment()
      .startOf('day')
      .format('x'),
  );
  const end = parseInt(moment().format('x'));

  useEffect(() => {
    if (sn) {
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
    }
  }, [sn]);

  // const addFallData = fall.push(state)
  // state变化，数组自增即可
  // useEffect(() => {
  //   console.log('state', state);
  //   dispatch({
  //     type: 'report/addStateList',
  //     payload: {
  //       actionState: state,
  //     },
  //   });
  // }, [state]);

  return (
    <div className={styles.wrap}>
      <Link to={`/report/${sn}`} className={styles.link}>
        <span>查看完整报告</span>
        <img src={二级页面} />
      </Link>
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
    </div>
  );
};

export default connect(
  ({ report, loading }: { report: ReportState; loading: Loading }) => ({
    report,
    loading: loading.models.report,
  }),
)(BriefReport);
