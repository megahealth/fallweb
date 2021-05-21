import { Effect, Reducer } from 'umi';

export interface DetailState {}

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
  state: {},
  effects: {},
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
