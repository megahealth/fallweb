import { Effect, Reducer } from 'umi';
import { queryGroupList } from '@/services/group';
import MultiwayTree from './tree';

interface GroupListProps {
  [key: string]: any;
}

export interface GroupState {
  groupList: [][];
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
    groupList: [],
  },
  effects: {
    *queryGroupList(_, { call, put, select }) {
      const response = yield call(queryGroupList);
      if (response.code === 0) {
        const list = response.msg;
        const parent = list[0].length > 1 ? list[0] : null;
        const self = list[0].length > 1 ? list[1] : list[0];
        const child = list[1];

        // const tree = new MultiwayTree();
        // tree.add(self)
        // tree.add(2, 1, tree.traverseBF)
        // tree.add(3, 1, tree.traverseBF)
        // tree.add(4, 2, tree.traverseBF)
        // for (let i = 0; i < child.length; i++) {
        //   const e = child[i];
        //   console.log(e)
        //   tree.add(e.sub_id, e.parent_id, tree.traverseBF)
        // }
        // console.log(tree)

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
