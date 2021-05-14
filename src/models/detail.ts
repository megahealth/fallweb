import { Effect, Reducer } from 'umi';

export interface DetailState {
  sn: string;
  group: number;
  name: string;
  online: number;
  count: number;
  action: number;
  breath: number;
}

export interface DetailType {
  namespace: 'detail';
  state: DetailState;
  effects: {};
  reducers: {
    save: Reducer<DetailState>;
  };
}

const DetailModel: DetailType = {
  namespace: 'detail',
  state: {
    sn: '',
    group: 0,
    name: '',
    online: 0,
    count: 0,
    action: 0,
    breath: 0,
  },
  effects: {
    *initDetail({ payload }, { call, put, select }) {
      const { sn, group, name, online, count, action, breath } = payload;
      yield put({
        type: 'save',
        payload: {
          sn,
          group,
          name,
          online,
          count,
          action,
          breath,
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
  },
};

export default DetailModel;
