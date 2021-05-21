import { Effect, Reducer } from 'umi';
import {
  getReportFallData,
  getReportBreathData,
  getReportRunningData,
} from '@/services/report';
import { ConnectState } from './connect.d';

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
    addStateList: Effect;
    clearState: Effect;
  };
  reducers: {
    save: Reducer<ReportState>;
    // addToState: Reducer<ReportState>;
  };
}

const ReportModel: ReportType = {
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
    *addStateList({ payload }, { call, put, select }) {
      const { fall } = yield select((state: ConnectState) => state.report);
      const { actionState } = payload;
      if (fall.length > 0) {
        let end = new Date().getTime();

        let fallSpinObj = {
          _id: end.toString(),
          start: end,
          end: end,
          states: [[0, 0, actionState, 0, end]],
          SN: '',
        };
        console.log(fallSpinObj);
        console.log(fall);
        fall.push(fallSpinObj);
        console.log(fall);
        yield put({
          type: 'save',
          payload: {
            fall,
          },
        });
      }
    },
    *clearState(_, { call, put, select }) {
      yield put({
        type: 'save',
        payload: {
          fall: [],
          breath: [],
          running: [],
        },
      });
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    // addToState(state, action) {
    //   return {
    //     ...state,
    //     fall: state.fall.push(action.payload),
    //   };
    // },
  },
};

export default ReportModel;
