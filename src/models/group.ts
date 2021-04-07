import { Effect, Reducer } from 'umi';
import { queryGroupList } from '@/services/group';

interface GroupListProps {
  [key: string]: any;
}

export interface GroupState {
  groupList: [];
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
        // const parent = list[0].length > 1 ? list[0][0] : null;
        const self = response.msg.parents_self[0];
        const child = response.msg.children;

        let root = {
          title: self.sub_name,
          key: self.parent_id + '-' + self.sub_id,
          parent_id: self.parent_id,
          sub_id: self.sub_id,
          parent_name: self.parent_name,
          sub_name: self.sub_name,
          children: [],
        };
        for (let i = 0; i < child.length; i++) {
          const n = child[i];
          if (root.parent_id > n.parent_id) {
            root = n;
          }
        }

        const add = (c: any) => {
          for (let i = 0; i < child.length; i++) {
            const n = child[i];
            if (n.parent_id == c.sub_id) {
              n.title = n.sub_name;
              n.key = n.parent_id + '-' + n.sub_id;
              c.children.push(n);
              add(n);
            }
          }
          return c;
        };
        // console.log(add(root))
        const data = add(root);
        const arr = [];
        arr.push(data);

        yield put({
          type: 'save',
          payload: {
            groupList: arr,
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
