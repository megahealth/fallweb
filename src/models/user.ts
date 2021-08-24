import { Effect, Reducer } from 'umi';
import {
  queryUserList,
  queryUserListUser,
  createUser,
  updateUser,
  deleteUser,
  getUserCount,
} from '@/services/user';
import { ConnectState } from './connect.d';
import { message } from 'antd';

interface TableListProps {
  [key: string]: any;
}

export interface UserState {
  searchContentVal: string;
  statusVal: string;
  userSource: TableListProps[];
  count: number;
  start: number;
  limit: number;
}

export interface UserType {
  namespace: 'user';
  state: UserState;
  effects: {
    queryUserList: Effect;
    queryUserCount: Effect;
    createUser: Effect;
    updateUser: Effect;
    deleteUser: Effect;
    pageChange: Effect;
  };
  reducers: {
    save: Reducer<UserState>;
    // 启用 immer 之后
    // save: ImmerReducer<QueryUserState>;
  };
}

const UserModel: UserType = {
  namespace: 'user',
  state: {
    searchContentVal: '',
    statusVal: '',
    userSource: [],
    count: 0,
    start: 0,
    limit: 10,
  },
  effects: {
    *queryUserList(_, { call, put, select }) {
      const { start, limit, searchContentVal } = yield select((state: ConnectState) => state.user);
      if (searchContentVal) {
        const response = yield call(queryUserListUser, {
          start,
          limit,
          searchContentVal,
        });
        console.log(response);
        if (response.code === 0) {
          yield put({
            type: 'save',
            payload: {
              userSource: [
                {
                  ...response.msg.user,
                  user_id: response.msg.user.id,
                  group_name: response.msg.group_name,
                },
              ],
            },
          });
        } else if (response.code === 2) {
          message.error('找不到该用户');
        } else {
          message.error('查询失败！');
        }
      } else {
        const response = yield call(queryUserList, {
          start,
          limit,
        });
        if (response.code === 0) {
          yield put({
            type: 'save',
            payload: {
              userSource: response.msg.children,
            },
          });
        }
      }
    },
    *queryUserCount({ payload }, { call, put, select }) {
      const response = yield call(getUserCount, payload);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            count: response.msg[0].user_cnt,
          },
        });
      }
    },
    *createUser({ payload }, { call, put, select }) {
      const { start, limit } = yield select((state: ConnectState) => state.user);
      const response = yield call(createUser, payload);
      if (response.code === 0) {
        message.success('添加成功！');
        yield put({
          type: 'queryUserList',
          payload: {
            start,
            limit,
          },
        });
        yield put({
          type: 'queryUserCount',
          payload: {
            start,
            limit,
          },
        });
      }
    },
    *updateUser({ payload }, { call, put, select }) {
      const obj = yield select((state: ConnectState) => state.user);
      obj.searchContentVal = payload.name;
      const { start, limit } = obj;
      const response = yield call(updateUser, payload);
      if (response.code === 0) {
        message.success('更新成功！');
        yield put({
          type: 'queryUserList',
          payload: {
            start,
            limit,
          },
        });
        yield put({
          type: 'queryUserCount',
          payload: {
            start,
            limit,
          },
        });
      }
    },
    *deleteUser({ payload }, { call, put, select }) {
      const { start, limit } = yield select((state: ConnectState) => state.user);
      const response = yield call(deleteUser, payload);
      if (response.code === 0) {
        message.success('删除成功！');
        yield put({
          type: 'queryUserList',
          payload: {
            start,
            limit,
          },
        });
        yield put({
          type: 'queryUserCount',
          payload: {
            start,
            limit,
          },
        });
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
        type: 'queryUserList',
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
    // 启用 immer 之后
    // save(state, action) {
    //   state.name = action.payload;
    // },
  },
};

export default UserModel;
