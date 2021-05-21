import { Effect, Reducer } from 'umi';
import {
  queryDeviceList,
  getDevice,
  createDevice,
  deleteDevice,
} from '@/services/device';
import { queryGroupList } from '@/services/group';
import { ConnectState } from './connect.d';
import { message } from 'antd';

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

interface StatusProps {
  sn: string;
  group: number;
  name: string;
  online: number;
  count: number;
  action_state: number;
  breath: number;
  last_roll_time: number;
  outdoor: number;
  roll: number;
  version: string;
  wifi: string;
  ip: string;
}

export interface DeviceState {
  searchContentVal: string;
  deviceList: DeviceListProps[];
  selectedDeviceList: DeviceListProps[];
  count: number;
  status: StatusProps;
}

export interface DeviceType {
  namespace: 'device';
  state: DeviceState;
  effects: {
    queryDeviceList: Effect;
    queryDeviceCount: Effect;
    queryDevicesBySelectedGroup: Effect;
    getDevice: Effect;
    clearStatus: Effect;
    updateStatus: Effect;
    createDevice: Effect;
    deleteDevice: Effect;
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
    status: {
      sn: '',
      group: 0,
      name: '',
      online: 0,
      count: 0,
      action_state: 0,
      breath: 0,
      last_roll_time: 0,
      outdoor: 0,
      roll: 0,
      version: '',
      wifi: '',
      ip: '',
    },
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
    *getDevice({ payload }, { call, put, select }) {
      const response = yield call(getDevice, {
        id: payload.id,
      });
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            status: response.msg,
          },
        });
      }
    },
    *createDevice({ payload }, { call, put, select }) {
      const response = yield call(createDevice, payload);
      if (response.code === 0) {
        message.success('添加成功！');
        yield put({
          type: 'device/queryDeviceList',
          payload: {
            start: 0,
            limit: 10,
          },
        });
        yield put({
          type: 'device/queryDeviceCount',
          payload: {
            start: 0,
            limit: 10,
          },
        });
      }
    },
    *deleteDevice({ payload }, { call, put, select }) {
      const response = yield call(deleteDevice, payload);
      if (response.code === 0) {
        message.success('删除成功！');
        yield put({
          type: 'device/queryDeviceList',
          payload: {
            start: 0,
            limit: 10,
          },
        });
        yield put({
          type: 'device/queryDeviceCount',
          payload: {
            start: 0,
            limit: 10,
          },
        });
      }
    },
    *clearStatus(_, { call, put, select }) {
      yield put({
        type: 'save',
        payload: {
          status: {
            sn: '',
          },
        },
      });
    },
    *updateStatus({ payload }, { call, put, select }) {
      const { status } = yield select((state: ConnectState) => state.device);

      yield put({
        type: 'save',
        payload: {
          status: { ...status, ...payload },
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
    // 启用 immer 之后
    // save(state, action) {
    //   state.name = action.payload;
    // },
  },
};

export default DeviceModel;
