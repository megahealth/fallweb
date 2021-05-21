import React, { FC, useRef, useState, useEffect } from 'react';
import { DatePicker, Empty, Tooltip } from 'antd';
import { connect, Dispatch, history } from 'umi';
import { SleepState, Loading } from '@/models/connect';
import SleepStage from './sleepStageChart';
import BreathTrend from './breathTrendChart';
import BodyMove from './bodyMoveChart';
import Roll from './rollChart';
import moment from 'moment';
import { QuestionCircleOutlined } from '@ant-design/icons';

export interface SleepProps {
  sleep: SleepState;
  dispatch: Dispatch;
  loading: boolean;
  location: any;
  match: any;
}

const Sleep: FC<SleepProps> = ({
  dispatch,
  sleep,
  loading,
  location,
  match,
}) => {
  const { sn } = match.params;
  const { date } = location.query;

  const { state, breath, move, roll, start } = sleep.data;
  const [day, setDay] = useState(date);

  useEffect(() => {
    dispatch({
      type: 'sleep/getSleepReport',
      payload: {
        sn,
        day,
      },
    });
  }, [day]);

  const onChange = (e: any) => {
    setDay(e.format('YYYY-MM-DD'));
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
      <Tooltip
        title={`统计时间：${day} AM 9:00 - ${moment(day)
          .add(1, 'days')
          .format('YYYY-MM-DD')} AM 9:00`}
      >
        <DatePicker
          allowClear={false}
          defaultValue={moment(day)}
          onChange={onChange}
        />
        <QuestionCircleOutlined
          style={{ fontSize: '18px', color: '#b7b7b7', marginLeft: '10px' }}
        />
      </Tooltip>

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
