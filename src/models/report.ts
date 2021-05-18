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
      console.log(fall);
      const { actionState } = payload;
      if (fall.length > 0) {
        let fallSpinObj = fall[fall.length - 1];
        let end = new Date().getTime();
        fallSpinObj.end = end;
        fallSpinObj.states.push([0, 0, actionState, 0, end]);
        console.log(fallSpinObj);
        console.log(fall);
        // fall[fall.length - 1] =
        let result = fall;
        result[result.length - 1] = fallSpinObj;
        yield put({
          type: 'addToState',
          payload: {
            fall: result,
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
    // addToState(state, action) {
    //   return {
    //     ...state,
    //     fall: state.fall.push(action.payload),
    //   };
    // },
  },
};

export default ReportModel;
