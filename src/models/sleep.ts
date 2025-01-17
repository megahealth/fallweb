import { Effect, Reducer } from 'umi';
import { getSleepReport } from '@/services/sleep';

interface sleepProps {
  state: number[];
  breath: number[];
  move: number[];
  roll: number[];
  start: number;
  valid: number;
  create_data_time: number;
}

export interface SleepState {
  data: sleepProps;
}

export interface SleepType {
  namespace: 'sleep';
  state: SleepState;
  effects: {
    getSleepReport: Effect;
  };
  reducers: {
    save: Reducer<SleepState>;
  };
}

const GroupModel: SleepType = {
  namespace: 'sleep',
  state: {
    data: {
      state: [],
      breath: [],
      move: [],
      roll: [],
      start: 0,
      valid: 0,
      create_data_time: 0,
    },
  },
  effects: {
    *getSleepReport({ payload }, { call, put, select }) {
      const response = yield call(getSleepReport, { ...payload });
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            data: response.msg,
          },
        });
      } else {
        yield put({
          type: 'save',
          payload: {
            data: {
              state: [],
              breath: [],
              move: [],
              roll: [],
              start: 0,
              valid: 0,
              create_data_time: 0,
            },
          },
        });
      }
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};

export default GroupModel;
