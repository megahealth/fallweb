import { Effect, Reducer } from 'umi';
import { queryUserList } from '@/services/user';

interface TableListProps {
  [key: string]: any;
}

export interface QueryUserState {
  searchContentVal: string;
  statusVal: string;
  queryUserSource: TableListProps[];
}

export interface QueryTableType {
  namespace: 'queryUser';
  state: QueryUserState;
  effects: {
    queryUserList: Effect;
  };
  reducers: {
    save: Reducer<QueryUserState>;
    // 启用 immer 之后
    // save: ImmerReducer<QueryUserState>;
  };
}

const QueryTableModel: QueryTableType = {
  namespace: 'queryUser',
  state: {
    searchContentVal: '',
    statusVal: '',
    queryUserSource: [],
  },
  effects: {
    *queryUserList(_, { call, put, select }) {
      const { searchContentVal, statusVal } = yield select(
        (state: QueryUserState) => state,
      );
      const response = yield call(queryUserList, {
        searchContentVal,
        statusVal,
      });
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            queryUserSource: response.msg.children,
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

export default QueryTableModel;
