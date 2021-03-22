import { Effect, Reducer } from 'umi';
import { queryDeviceList } from '@/services/device';

interface DeviceListProps {
  [key: string]: any;
}

export interface DeviceState {
  searchContentVal: string;
  statusVal: string;
  deviceList: DeviceListProps[];
}

export interface QueryDeviceType {
  namespace: 'device';
  state: DeviceState;
  effects: {
    queryDeviceList: Effect;
  };
  reducers: {
    save: Reducer<DeviceState>;
    // 启用 immer 之后
    // save: ImmerReducer<QueryDeviceState>;
  };
}

const DeviceModel: QueryDeviceType = {
  namespace: 'device',
  state: {
    searchContentVal: '',
    statusVal: '',
    deviceList: [],
  },
  effects: {
    *queryDeviceList(_, { call, put, select }) {
      const { searchContentVal, statusVal } = yield select(
        (state: DeviceState) => state,
      );
      const response = yield call(queryDeviceList, {
        searchContentVal,
        statusVal,
      });
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            deviceList: response.msg,
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
    // 启用 immer 之后
    // save(state, action) {
    //   state.name = action.payload;
    // },
  },
};

export default DeviceModel;
