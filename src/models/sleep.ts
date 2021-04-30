import { Effect, Reducer } from 'umi';
import { getSleepReport } from '@/services/sleep';

interface sleepProps {
  // sleep: {
  state: number[];
  breath: number[];
  move: number[];
  roll: number[];
  start: number;
  // };
}

export interface SleepState {
  data: sleepProps; // groupTreeList
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
      // sleep: {
      state: [],
      breath: [],
      move: [],
      roll: [],
      start: 0,
      // },
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
