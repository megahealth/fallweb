import type { FC} from 'react';
import React, { useMemo, memo } from 'react';
import { Link } from 'umi';
import { getReportFallData, getReportBreathData, getReportRunningData } from '@/services/report'
import { useRequest } from 'ahooks';
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
  state: number;
  sn: string;
}

const isEqual = (prevProps: ReportProps, nextProps: ReportProps) => {
  if (prevProps.sn !== nextProps.sn || prevProps.state !== nextProps.state) {
    return false;
  }
  return true;
}

const BriefReport: FC<ReportProps> = (props) => {
  const { sn, state } = props;
  const start = useMemo(() => {
    return parseInt(
      moment()
        .startOf('day')
        .format('x'),
    );
  }, [])
  const end = useMemo(() => {
    return parseInt(moment().format('x'));
  }, [])

  const params = {
    orderby: -1,
    skip: 0,
    limit: 100,
    start,
    end,
    sn,
  }

  const { data: fallResult, loading: fallLoading } = useRequest(() => getReportFallData(params));
  const { data: breathResult, loading: breathLoading } = useRequest(() => getReportBreathData(params));
  const { data: runningResult, loading: runningLoading } = useRequest(() => getReportRunningData(params));

  const fall = useMemo(() => {
    const arr = fallResult ? fallResult.msg : [];
    const end = new Date().getTime();
    const fallSpinObj = {
      _id: end.toString(),
      start: end,
      end: end,
      states: [[0, 0, state, 0, end]],
      SN: '',
    };
    arr.push(fallSpinObj)
    return arr;
  }, [state])
  const breath = breathResult ? breathResult.msg: [];
  const running = runningResult ? runningResult.msg: [];

  return (
    <div className={styles.wrap}>
      <Link to={`/report/${sn}`} className={styles.link}>
        <span>查看完整报告</span>
        <img src={二级页面} />
      </Link>
      <IconTitle title="目标状态" img={跌倒报告}></IconTitle>
      <div className={styles.chart}>
        <StateChart className={styles.chart} start={start} end={end} data={fall} loading={fallLoading} />
      </div>
      <IconTitle title="呼吸率" img={呼吸率报告}></IconTitle>
      <div className={styles.chart}>
        <BreathChart className={styles.chart} start={start} end={end} data={breath} loading={breathLoading} />
      </div>
      <IconTitle title="设备工作状态" img={有人无人报告}></IconTitle>
      <div className={styles.chart}>
        <RunningChart className={styles.chart} start={start} end={end} data={running} loading={runningLoading} />
      </div>
    </div>
  );
};

export default memo(BriefReport, isEqual);
