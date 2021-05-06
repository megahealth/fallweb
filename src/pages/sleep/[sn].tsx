import React, { FC, useRef, useState, useEffect } from 'react';
import { DatePicker, Empty } from 'antd';
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

  const onChange = (e: any) => {
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
      <DatePicker allowClear={false} defaultValue={day} onChange={onChange} />
      {start > 0 ? (
        <>
          <SleepStage start={start * 1000} state={state}></SleepStage>
          <BreathTrend start={start * 1000} breath={breath}></BreathTrend>
          <BodyMove start={start * 1000} move={move}></BodyMove>
          <Roll start={start * 1000} roll={roll}></Roll>
        </>
      ) : (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Empty></Empty>
        </div>
      )}
    </div>
  );
};

export default connect(
  ({ sleep, loading }: { sleep: SleepState; loading: Loading }) => ({
    sleep,
    loading: loading.models.sleep,
  }),
)(Sleep);
