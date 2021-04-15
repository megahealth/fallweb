import { Effect, Reducer } from 'umi';
import { queryDeviceList } from '@/services/device';
import { queryGroupList } from '@/services/group';

interface DeviceListProps {
  [key: string]: any;
}

interface Group {
  sub_id: number;
  parent_id: number;
  sub_name: string;
  dev_cnt: number;
  parent_name: string;
}

export interface DeviceState {
  searchContentVal: string;
  deviceList: DeviceListProps[];
  selectedDeviceList: DeviceListProps[];
  count: number;
}

export interface DeviceType {
  namespace: 'device';
  state: DeviceState;
  effects: {
    queryDeviceList: Effect;
    queryDeviceCount: Effect;
    queryDevicesBySelectedGroup: Effect;
  };
  reducers: {
    save: Reducer<DeviceState>;
    // 启用 immer 之后
    // save: ImmerReducer<QueryDeviceState>;
  };
}

const DeviceModel: DeviceType = {
  namespace: 'device',
  state: {
    searchContentVal: '',
    deviceList: [],
    selectedDeviceList: [],
    count: 0,
  },
  effects: {
    *queryDeviceList({ payload }, { call, put, select }) {
      const { searchContentVal } = yield select((state: DeviceState) => state);
      const response = yield call(queryDeviceList, { ...payload });
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            deviceList: response.msg,
          },
        });
      }
    },
    *queryDevicesBySelectedGroup({ payload }, { call, put, select }) {
      const { selectedGroups } = payload;
      var list = [];
      for (let i = 0; i < selectedGroups.length; i++) {
        const group = selectedGroups[i];
        const { sub_id, dev_cnt } = group;
        if (dev_cnt === 0) continue;
        const response = yield call(queryDeviceList, {
          group: sub_id,
          start: 0,
          limit: dev_cnt,
        });
        if (response.code === 0) {
          // console.log(response.msg)
          list = list.concat(response.msg);
        }
      }
      console.log(list);
      yield put({
        type: 'save',
        payload: {
          selectedDeviceList: list,
        },
      });
    },
    *queryDeviceCount(_, { call, put, select }) {
      const response = yield call(queryGroupList);
      if (response.code === 0) {
        const child = response.msg.children;
        let count = 0;
        child.forEach((g: Group) => {
          count += g.dev_cnt;
        });

        yield put({
          type: 'save',
          payload: {
            count,
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
