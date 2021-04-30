import React, { FC, useRef, useState, useEffect } from 'react';
import { DatePicker } from 'antd';
import { connect, Dispatch, history } from 'umi';
import { SleepState, Loading } from '@/models/connect';
import SleepStage from './sleepStageChart';
import BreathTrend from './breathTrendChart';
import BodyMove from './bodyMoveChart';
import Roll from './rollChart';
import moment from 'moment';

export interface SleepProps {
  sleep: SleepState;
  dispatch: Dispatch;
  loading: boolean;
}

const Sleep: FC<SleepProps> = ({ dispatch, sleep, loading }) => {
  const { state, breath, move, roll, start } = sleep.data;
  const [day, setDay] = useState(moment());

  useEffect(() => {
    dispatch({
      type: 'sleep/getSleepReport',
      payload: {
        sn: localStorage.getItem('sn'),
        day: day.format('YYYY-MM-DD'),
      },
    });
  }, [day]);

  const onChange = e => {
    setDay(e);
  };

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '25px',
        padding: '20px',
        marginTop: '20px',
      }}
    >
      <DatePicker defaultValue={day} onChange={onChange} />
      <SleepStage start={start} state={state}></SleepStage>
      <BreathTrend start={start} breath={breath}></BreathTrend>
      <BodyMove start={start} move={move}></BodyMove>
      <Roll start={start} roll={roll}></Roll>
    </div>
  );
};

export default connect(
  ({ sleep, loading }: { sleep: SleepState; loading: Loading }) => ({
    sleep,
    loading: loading.models.sleep,
  }),
)(Sleep);
