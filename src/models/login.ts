import { Effect, Reducer, history } from 'umi';
import { message } from 'antd';
import { queryLogin, logout } from '@/services/login';

import { ConnectState, LoginUserInfoState } from './connect.d';

export interface LoginModelState {
  userInfo: LoginUserInfoState;
  isError: boolean;
}

export interface LoginModelType {
  namespace: 'login';
  state: LoginModelState;
  effects: {
    getUserInfo: Effect;
    queryLogin: Effect;
    logout: Effect;
  };
  reducers: {
    save: Reducer<LoginModelState>;
    // 启用 immer 之后
    // save: ImmerReducer<LoginModelState>;
  };
}

const LoginModel: LoginModelType = {
  namespace: 'login',
  state: {
    userInfo: {
      id: '',
      name: '',
    },
    isError: false,
  },
  effects: {
    *queryLogin({ payload }, { call, put }) {
      // const { name } = yield select((state: ConnectState) => state.global);
      const response = yield call(queryLogin, { ...payload });
      console.log(response);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            userInfo: response.msg,
          },
        });
        localStorage.setItem('userid', response.msg.id);
        localStorage.setItem('token', response.msg.token);
        message.success('登录成功！');
        history.replace('/');
      } else {
        yield put({
          type: 'save',
          payload: {
            isError: true,
          },
        });
        yield logout();
      }
    },
    *getUserInfo({ payload }, { call, put, select }) {
      const { name } = yield select((state: ConnectState) => state.global);
      const data = yield call(queryLogin, { ...payload, name });
      yield put({
        type: 'save',
        payload: {
          userInfo: data,
        },
      });
    },
    *logout(_, { call }) {
      localStorage.clear();
      history.replace({
        pathname: '/login',
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

export default LoginModel;
