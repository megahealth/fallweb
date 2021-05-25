import { Effect, Reducer } from 'umi';
import {
  queryGroupList,
  getGroupCount,
  createGroup,
  updateGroup,
  deleteGroup,
} from '@/services/group';
import { ConnectState } from './connect.d';
import { message } from 'antd';

interface GroupProps {
  dev_cnt: number;
  parent_id: number;
  parent_name: string;
  sub_id: number;
  sub_name: string;
}

export interface Groups {
  parents_self: Array<GroupProps>;
  children: Array<GroupProps>;
}
export interface GroupState {
  groupList: Groups;
  count: number;
  start: number;
  limit: number;
}

export interface GroupType {
  namespace: 'group';
  state: GroupState;
  effects: {
    queryGroupList: Effect;
    getGroupCount: Effect;
    createGroup: Effect;
    updateGroup: Effect;
    deleteGroup: Effect;
    pageChange: Effect;
  };
  reducers: {
    save: Reducer<GroupState>;
  };
}

const GroupModel: GroupType = {
  namespace: 'group',
  state: {
    groupList: {
      parents_self: [],
      children: [],
    },
    count: 0,
    start: 0,
    limit: 10,
  },
  effects: {
    *queryGroupList(_, { call, put, select }) {
      const response = yield call(queryGroupList);
      console.log(response);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            groupList: response.msg,
          },
        });
      }
    },
    *getGroupCount({ payload }, { call, put, select }) {
      const response = yield call(getGroupCount, payload);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            count: response.msg[0].group_cnt,
          },
        });
      }
    },
    *createGroup({ payload }, { call, put, select }) {
      const { start, limit } = yield select(
        (state: ConnectState) => state.group,
      );
      const response = yield call(createGroup, payload);
      if (response.code === 0) {
        message.success('添加成功！');
        yield put({
          type: 'queryGroupList',
          payload: {
            start,
            limit,
          },
        });
        // yield put({
        //   type: 'getGroupCount',
        // });
      }
    },
    *updateGroup({ payload }, { call, put, select }) {
      const { start, limit } = yield select(
        (state: ConnectState) => state.group,
      );
      const response = yield call(updateGroup, payload);
      if (response.code === 0) {
        message.success('更新成功！');
        yield put({
          type: 'queryGroupList',
          payload: {
            start,
            limit,
          },
        });
        // yield put({
        //   type: 'getGroupCount',
        // });
      }
    },
    *deleteGroup({ payload }, { call, put, select }) {
      const { start, limit } = yield select(
        (state: ConnectState) => state.group,
      );
      const response = yield call(deleteGroup, payload);
      if (response.code === 0) {
        message.success('删除成功！');
        yield put({
          type: 'queryGroupList',
          payload: {
            start,
            limit,
          },
        });
        // yield put({
        //   type: 'getGroupCount',
        // });
      }
    },
    *pageChange({ payload }, { call, put, select }) {
      const { start, limit } = payload;
      yield put({
        type: 'save',
        payload: {
          start,
          limit,
        },
      });
      yield put({
        type: 'queryGroupList',
        payload: {
          start,
          limit,
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

export default GroupModel;
