import React, { FC, useRef, useState, useEffect } from 'react';
import { connect, Dispatch, history, Link } from 'umi';
import { SleepState, Loading } from '@/models/connect';
import styles from './index.less';
import moment from 'moment';
import 睡眠摘要 from '@/assets/睡眠摘要.png';
import 二级页面 from '@/assets/二级页面.png';
import StagePie from './stagePieChart';
import IconTitle from '@/components/iconTitle';

export interface SleepProps {
  sleep: SleepState;
  dispatch: Dispatch;
  loading: boolean;
  sn: string;
}

const validMsg = (valid: number) => {
  switch (valid) {
    case 2:
      return '内存不足';
      break;
    case 3:
      return '无法解析';
      break;
    case 4:
      return '文件过短';
      break;
    case 5:
      return '文件过长';
      break;
    case 6:
      return '地址为空';
      break;
    case 7:
      return '有效时长过短';
      break;
    default:
      return '有效时长过短';
      break;
  }
};

const BreifInfo: FC<SleepProps> = ({ dispatch, sleep, loading, sn }) => {
  const {
    state,
    breath,
    move,
    roll,
    start,
    valid,
    create_data_time: create,
  } = sleep.data;
  const time = valid > 1 ? create : start * 1000;

  useEffect(() => {
    if (sn) {
      dispatch({
        type: 'sleep/getSleepReport',
        payload: {
          sn,
        },
      });
    }
  }, [sn]);

  const stages = (state => {
    let result = [
      { value: 0, name: '清醒期' },
      { value: 0, name: '眼动期' },
      { value: 0, name: '浅睡期' },
      { value: 0, name: '深睡期' },
    ];
    for (let i = 1; i < state.length; i++) {
      let value = state[i];
      let stage;
      switch (value) {
        case 0:
          stage = 0;
          break;
        case 2:
          stage = 1;
          break;
        case 3:
          stage = 2;
          break;
        case 4:
          stage = 3;
          break;
        default:
          stage = 0;
          break;
      }
      result[stage].value++;
    }

    return result;
  })(state);

  const sleepDuration = stages[1].value + stages[2].value + stages[3].value;
  const hours = moment.duration(sleepDuration, 'minutes').hours();
  const minutes = sleepDuration % 60;
  const hour = moment(time).hour();
  let YYYYMMDD_0, YYYYMMDD_1;
  if (hour > 9) {
    YYYYMMDD_0 = moment(time).format('YYYY-MM-DD');
    YYYYMMDD_1 = moment(time)
      .add(1, 'days')
      .format('YYYY-MM-DD');
  } else {
    YYYYMMDD_0 = moment(time)
      .subtract(1, 'days')
      .format('YYYY-MM-DD');
    YYYYMMDD_1 = moment(time).format('YYYY-MM-DD');
  }
  const title = '睡眠报告摘要' + (time ? '（' + YYYYMMDD_0 + '）' : '（--）');
  const startTime = time ? moment(time).format('HH:mm') : '--';
  const endTime = time
    ? moment(time + state.length * 60).format('HH:mm')
    : '--';
  const deepDuration = stages[3].value;
  const tip = time
    ? `统计时间：${YYYYMMDD_0} AM 9:00 - ${YYYYMMDD_1} AM 9:00`
    : null;

  return (
    <div className={styles.breif}>
      <div className={styles.head}>
        <div className={styles.left}>
          <IconTitle title={title} tip={tip} img={睡眠摘要}></IconTitle>
          {valid > 1 && (
            <div className={styles.invalid}>无效报告 - {validMsg(valid)}</div>
          )}
        </div>
        <Link to={`/sleep/${sn}?date=${YYYYMMDD_0}`} className={styles.link}>
          <span>查看完整报告</span>
          <img src={二级页面} />
        </Link>
      </div>
      <div className={styles.body}>
        <div className={styles.left}>
          <div className={styles.title}>睡眠质量</div>
          <div className={styles.content}>
            <StagePie stages={stages}></StagePie>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.title}>睡眠时间统计</div>
          <div className={styles.content}>
            <div className={styles.name}>昨晚睡眠时长</div>
            <div className={styles.value}>
              {hours}小时{minutes}分钟
            </div>
            <div className={styles.group}>
              <div>
                <span>睡眠分期开始</span>
                <span>{startTime}</span>
              </div>
              <div>
                <span>睡眠分期结束</span>
                <span>{endTime}</span>
              </div>
              <div>
                <span>深睡时长</span>
                <span>{deepDuration}分钟</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(
  ({ sleep, loading }: { sleep: SleepState; loading: Loading }) => ({
    sleep,
    loading: loading.models.sleep,
  }),
)(BreifInfo);
