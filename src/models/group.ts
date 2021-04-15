import { Effect, Reducer } from 'umi';
import { queryGroupList } from '@/services/group';

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
  groupList: Groups; // groupTreeList
}

export interface GroupType {
  namespace: 'group';
  state: GroupState;
  effects: {
    queryGroupList: Effect;
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
  },
  effects: {
    *queryGroupList(_, { call, put, select }) {
      const response = yield call(queryGroupList);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            groupList: response.msg,
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
  },
};

export default GroupModel;
