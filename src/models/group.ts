import type { Effect, Reducer } from 'umi';
import {
  queryGroupList,
  getGroupCount,
  createGroup,
  updateGroup,
  deleteGroup,
  queryGroupName,
} from '@/services/group';
import type { ConnectState } from './connect.d';
import { message } from 'antd';

interface GroupProps {
  dev_cnt: number;
  parent_id: number;
  parent_name: string;
  sub_id: number;
  sub_name: string;
}

export interface Groups {
  parents_self: GroupProps[];
  children: GroupProps[];
  searchGroup: GroupProps[];
}
export interface GroupState {
  groupList: Groups;
  count: number;
  start: number;
  limit: number;
  queryGroup: string;
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
      searchGroup: [],
    },
    count: 0,
    start: 0,
    limit: 10,
    queryGroup: '',
  },
  effects: {
    *queryGroupList({ payload }, { call, put, select }) {
      let { start, limit, queryGroup, groupList } = yield select(
        (state: ConnectState) => state.group,
      );
      if (payload && payload.queryGroup) queryGroup = payload.queryGroup;
      if (queryGroup) {
        const response = yield call(queryGroupName, queryGroup);
        console.log('sdfasdf', response);
        if (response.code === 0) {
          yield put({
            type: 'save',
            payload: {
              queryGroup: queryGroup,
              groupList: {
                ...groupList,
                searchGroup: [...response.msg],
              },
            },
          });
        } else if (response.code === 2) {
          message.error('找不到该分组');
        } else {
          message.error('查询失败！');
        }
      } else {
        const response = yield call(queryGroupList);
        if (response.code === 0) {
          yield put({
            type: 'save',
            payload: {
              groupList: {
                ...response.msg,
                searchGroup: [],
              },
            },
          });
        }
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
      } else {
        message.error(response.msg);
      }
    },
    *createGroup({ payload }, { call, put, select }) {
      const { start, limit } = yield select((state: ConnectState) => state.group);
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
      } else {
        message.error(response.msg);
      }
    },
    *updateGroup({ payload }, { call, put, select }) {
      const { start, limit } = yield select((state: ConnectState) => state.group);
      const response = yield call(updateGroup, payload);
      if (response.code === 0) {
        message.success('更新成功！');
        yield put({
          type: 'queryGroupList',
          payload: {
            start,
            limit,
            queryGroup: payload.name,
          },
        });
        // yield put({
        //   type: 'getGroupCount',
        // });
      }
    },
    *deleteGroup({ payload }, { call, put, select }) {
      const { start, limit } = yield select((state: ConnectState) => state.group);
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
