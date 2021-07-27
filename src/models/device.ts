import type { Effect, Reducer } from 'umi';
import {
  queryDeviceList,
  getDevice,
  createDevice,
  deleteDevice,
  updateDevice,
  getDeviceCount,
  queryDeviceListSn,
} from '@/services/device';
import { getGroup } from '@/services/group';
import type { ConnectState } from './connect.d';
import { message } from 'antd';

type DeviceListProps = Record<string, any>;

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
  start: number;
  limit: number;
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
    updateDevice: Effect;
    pageChange: Effect;
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
    start: 0,
    limit: 10,
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
      const { start, limit } = yield select((state: ConnectState) => state.device);
      const { sn } = payload;
      let response;
      try {
        if (sn) {
          response = yield call(queryDeviceListSn, { start, limit, sn });
          response.msg = [response.msg];
          if (response.code === 0) {
            const groupRes = yield call(getGroup, { id: response.msg[0].group_id });
            console.log(response.msg);
            console.log(groupRes);
            console.log({
              device_id: groupRes.msg.id,
              group_name: groupRes.msg.name,
              ...response.msg,
            });
            yield put({
              type: 'save',
              payload: {
                deviceList: [
                  { device_id: groupRes.msg.id, group_name: groupRes.msg.name, ...response.msg[0] },
                ],
                count: 1,
              },
            });
          }
        } else {
          response = yield call(queryDeviceList, { start, limit });
          if (response.code === 0) {
            console.log(response.msg);
            yield put({
              type: 'save',
              payload: {
                deviceList: response.msg,
              },
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    *queryDevicesBySelectedGroup({ payload }, { call, put, select }) {
      let { selectedGroups } = payload;
      if (typeof selectedGroups === 'string') {
        selectedGroups = JSON.parse(selectedGroups);
      }
      let list = [];
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
    *queryDeviceCount({ payload }, { call, put, select }) {
      const response = yield call(getDeviceCount, payload);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            count: response.msg[0].device_cnt,
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
      const { start, limit } = yield select((state: ConnectState) => state.device);
      const response = yield call(createDevice, payload);
      if (response.code === 0) {
        message.success('添加成功！');
        yield put({
          type: 'queryDeviceList',
          payload: {
            start,
            limit,
          },
        });
        yield put({
          type: 'queryDeviceCount',
          payload: {
            start,
            limit,
          },
        });
      } else if (response.code === 4) {
        message.error('设备已存在！');
      } else {
        message.error('添加失败！');
      }
    },
    *deleteDevice({ payload }, { call, put, select }) {
      const { start, limit } = yield select((state: ConnectState) => state.device);
      const response = yield call(deleteDevice, payload);
      if (response.code === 0) {
        message.success('删除成功！');
        yield put({
          type: 'queryDeviceList',
          payload: {
            start,
            limit,
          },
        });
        yield put({
          type: 'queryDeviceCount',
          payload: {
            start,
            limit,
          },
        });
      }
    },
    *updateDevice({ payload }, { call, put, select }) {
      const { start, limit } = yield select((state: ConnectState) => state.device);
      const response = yield call(updateDevice, payload);
      if (response.code === 0) {
        message.success('更新成功！');
        yield put({
          type: 'queryDeviceList',
          payload: {
            start,
            limit,
          },
        });
        yield put({
          type: 'queryDeviceCount',
          payload: {
            start,
            limit,
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
    *pageChange({ payload }, { call, put, select }) {
      const { start, limit, sn } = payload;
      yield put({
        type: 'save',
        payload: {
          start,
          limit,
        },
      });
      yield put({
        type: 'queryDeviceList',
        payload: {
          start,
          limit,
          sn,
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
