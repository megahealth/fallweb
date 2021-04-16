import { Effect, Reducer } from 'umi';
import {
  getReportFallData,
  getReportBreathData,
  getReportRunningData,
} from '@/services/report';

interface reportSnipProps {
  _id: string;
  start: number;
  end: number;
  states: [];
  SN: string;
}

export interface ReportState {
  fall: Array<reportSnipProps>; // groupTreeList
  breath: Array<reportSnipProps>;
  running: Array<reportSnipProps>;
}

export interface ReportType {
  namespace: 'report';
  state: ReportState;
  effects: {
    getReportFallData: Effect;
    getReportBreathData: Effect;
    getReportRunningData: Effect;
  };
  reducers: {
    save: Reducer<ReportState>;
  };
}

const GroupModel: ReportType = {
  namespace: 'report',
  state: {
    fall: [],
    breath: [],
    running: [],
  },
  effects: {
    *getReportFallData({ payload }, { call, put, select }) {
      const response = yield call(getReportFallData, { ...payload });
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            fall: response.msg,
          },
        });
      }
    },
    *getReportBreathData({ payload }, { call, put, select }) {
      const response = yield call(getReportBreathData, { ...payload });
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            breath: response.msg,
          },
        });
      }
    },
    *getReportRunningData({ payload }, { call, put, select }) {
      const response = yield call(getReportRunningData, { ...payload });
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            running: response.msg,
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
